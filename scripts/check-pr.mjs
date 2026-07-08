import { existsSync, readFileSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'imti-ahmed/The-Misfits';
const PR_NUMBER = process.env.PR_NUMBER;

const COMMENT_MARKER = '<!-- guild-pr-check -->';
const TIMEOUT_MS = 12_000;

// ── GitHub helpers ────────────────────────────────────────────────────────────

async function gh(path, options = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
}

async function getPRFiles() {
  const res = await gh(`/repos/${GITHUB_REPO}/pulls/${PR_NUMBER}/files?per_page=100`);
  return res.json();
}

async function upsertComment(body) {
  const marked = `${COMMENT_MARKER}\n${body}`;
  const listRes = await gh(`/repos/${GITHUB_REPO}/issues/${PR_NUMBER}/comments?per_page=100`);
  const comments = await listRes.json();
  const existing = Array.isArray(comments)
    ? comments.find(c => c.body?.includes(COMMENT_MARKER))
    : null;

  if (existing) {
    await gh(`/repos/${GITHUB_REPO}/issues/comments/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ body: marked }),
    });
  } else {
    await gh(`/repos/${GITHUB_REPO}/issues/${PR_NUMBER}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body: marked }),
    });
  }
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'TheMisfits-PRCheck/1.0', ...(options.headers ?? {}) },
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function checkUrl(url) {
  try {
    const res = await fetchWithTimeout(url);
    return { ok: res.status < 400, status: res.status };
  } catch {
    return { ok: false, status: null };
  }
}

// ── Domain age via RDAP ───────────────────────────────────────────────────────

async function checkDomainAge(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    const parts = hostname.split('.');
    const apex = parts.length > 2 ? parts.slice(-2).join('.') : hostname;

    const res = await fetchWithTimeout(`https://rdap.org/domain/${apex}`, {
      headers: { Accept: 'application/rdap+json' },
    });
    if (!res.ok) return { pass: null, note: 'Could not verify' };

    const data = await res.json();
    const reg = data.events?.find(e => e.eventAction === 'registration');
    if (!reg) return { pass: null, note: 'Registration date not found' };

    const ageDays = Math.floor((Date.now() - new Date(reg.eventDate).getTime()) / 86_400_000);
    return {
      pass: ageDays >= 30,
      note: `${ageDays} day${ageDays === 1 ? '' : 's'} old`,
    };
  } catch {
    return { pass: null, note: 'Could not verify' };
  }
}

// ── Placeholder content check ─────────────────────────────────────────────────

const PLACEHOLDER_KEYWORDS = [
  'coming soon', 'under construction', 'maintenance mode',
  'launching soon', 'stay tuned', 'we\'ll be back',
];

async function checkPlaceholderContent(url) {
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return { pass: null, note: 'Could not fetch page' };
    const html = (await res.text()).toLowerCase();
    if (html.length < 200) return { pass: false, note: 'Page content appears empty' };
    const hit = PLACEHOLDER_KEYWORDS.find(kw => html.includes(kw));
    if (hit) return { pass: false, note: `Contains "${hit}"` };
    return { pass: true, note: '' };
  } catch {
    return { pass: null, note: 'Could not fetch page' };
  }
}

// ── Table row builder ─────────────────────────────────────────────────────────
// pass: true = ✅, false = ❌, null = ⚠️ (warning / unknown)

function row(label, pass, note = '') {
  const icon = pass === true ? '✅' : pass === false ? '❌' : '⚠️';
  const status = pass === true ? 'Pass' : pass === false ? 'Fail' : 'Warning';
  return `| ${label} | ${icon} ${status} | ${note} |`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const files = await getPRFiles();
  if (!Array.isArray(files)) {
    console.error('Could not fetch PR files:', files);
    process.exit(1);
  }

  const allAdded    = files.filter(f => f.status === 'added');
  const memberFiles = files.filter(f => f.filename.startsWith('members/') && f.filename.endsWith('.md'));
  const addedMember = memberFiles.filter(f => f.status === 'added');
  const otherFiles  = files.filter(f => !f.filename.startsWith('members/'));

  const rows = [];

  // ── PR-level checks ───────────────────────────────────────────────────────

  rows.push(row(
    'Only one MD file added',
    allAdded.length === 1 && addedMember.length === 1,
    allAdded.length !== 1 ? `${allAdded.length} file(s) added` : addedMember.length === 0 ? 'Added file is not a member MD' : '',
  ));

  rows.push(row(
    'No other files touched',
    otherFiles.length === 0,
    otherFiles.length > 0 ? otherFiles.map(f => `\`${f.filename}\``).join(', ') : '',
  ));

  rows.push(row(
    'File in `members/` folder',
    addedMember.length === 1,
    addedMember.length === 0 ? 'No member file found' : '',
  ));

  if (addedMember.length === 0) {
    const comment = buildComment('(no member file)', rows, []);
    await upsertComment(comment);
    return;
  }

  const memberFile = addedMember[0];
  const slug = basename(memberFile.filename, '.md');

  // ── MD-level checks ───────────────────────────────────────────────────────

  rows.push(row(
    'Valid slug format',
    /^[a-z0-9][a-z0-9-]*$/.test(slug),
    /^[a-z0-9][a-z0-9-]*$/.test(slug) ? `\`${slug}\`` : `\`${slug}\` — lowercase letters, numbers, hyphens only`,
  ));

  const filePath = join(REPO_ROOT, memberFile.filename);
  let data = {};
  if (existsSync(filePath)) {
    try { data = matter(readFileSync(filePath, 'utf-8')).data; } catch { /* malformed */ }
  }

  const REQUIRED = ['name', 'url', 'email', 'widget'];
  const missing = REQUIRED.filter(f => !data[f] || String(data[f]).trim() === '');
  rows.push(row(
    'Required fields present (`name`, `url`, `email`, `widget`)',
    missing.length === 0,
    missing.length > 0 ? `Missing: ${missing.map(f => `\`${f}\``).join(', ')}` : '',
  ));

  // ── Site checks (run in parallel) ─────────────────────────────────────────

  const [siteResult, screenshotResult, domainAge, contentResult] = await Promise.all([
    data.url ? checkUrl(data.url) : Promise.resolve({ ok: false, status: null }),
    data.screenshot ? checkUrl(data.screenshot) : Promise.resolve({ ok: false, status: null }),
    data.url ? checkDomainAge(data.url) : Promise.resolve({ pass: null, note: 'No URL' }),
    data.url ? checkPlaceholderContent(data.url) : Promise.resolve({ pass: null, note: 'No URL' }),
  ]);

  rows.push(row(
    'Site reachable',
    data.url ? siteResult.ok : false,
    data.url
      ? (siteResult.ok ? `HTTP ${siteResult.status}` : `HTTP ${siteResult.status ?? 'timeout / unreachable'}`)
      : 'No URL in file',
  ));

  const hasScreenshot = !!data.screenshot && String(data.screenshot).trim() !== '';
  rows.push(row(
    'Screenshot captured & uploaded to R2',
    hasScreenshot && screenshotResult.ok,
    hasScreenshot
      ? (screenshotResult.ok ? '' : 'URL not reachable')
      : 'No screenshot URL in file',
  ));

  // ── Warning-level checks ──────────────────────────────────────────────────

  const warnings = [];

  warnings.push(row(
    'Domain live > 30 days',
    domainAge.pass,
    domainAge.pass === false ? `Only ${domainAge.note}` : domainAge.note,
  ));

  warnings.push(row(
    'Content is not a placeholder',
    contentResult.pass,
    contentResult.note,
  ));

  const comment = buildComment(slug, rows, warnings);
  await upsertComment(comment);
}

function buildComment(slug, rows, warnings) {
  const failures = rows.filter(r => r.includes('❌')).length;
  const warnCount = [...rows, ...warnings].filter(r => r.includes('⚠️')).length;

  let verdict;
  if (failures === 0 && warnCount === 0) verdict = '🟢 All checks passed.';
  else if (failures === 0) verdict = `🟡 Passed with ${warnCount} warning(s).`;
  else verdict = `🔴 ${failures} check(s) failed.`;

  return [
    `## Guild PR Check — \`${slug}\``,
    '',
    '### Checks',
    '',
    '| Check | Status | Notes |',
    '|---|---|---|',
    ...rows,
    '',
    '### Warnings',
    '',
    '| Check | Status | Notes |',
    '|---|---|---|',
    ...warnings,
    '',
    `**${verdict}** — manual review required before merging.`,
    '',
    `<sub>Last run: ${new Date().toUTCString()}</sub>`,
  ].join('\n');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
