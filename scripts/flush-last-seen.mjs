import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MEMBERS_DIR = join(__dirname, '..', 'members');
const LAST_SEEN_PATH = 'last-seen.md';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'imti-ahmed/The-Misfits';
const GITHUB_BASE = process.env.GITHUB_BASE_BRANCH ?? 'main';
const SITE_ORIGIN = process.env.SITE_ORIGIN ?? 'https://themisfits.byimti.tools';
const HITS_FLUSH_SECRET = process.env.HITS_FLUSH_SECRET;
const DRY_RUN = process.env.DRY_RUN === 'true';

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

async function getFileSha(filePath, ref) {
  const res = await gh(`/repos/${GITHUB_REPO}/contents/${filePath}?ref=${ref}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha;
}

async function updateFile(filePath, content, message) {
  const sha = await getFileSha(filePath, GITHUB_BASE);
  const res = await gh(`/repos/${GITHUB_REPO}/contents/${filePath}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      branch: GITHUB_BASE,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`File update failed: ${err.message}`);
  }
}

function parseLastSeenTable(raw) {
  const map = new Map();
  const lines = raw.split('\n');
  for (const line of lines) {
    const match = line.match(/^\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/);
    if (!match || match[2] === 'Slug') continue;
    map.set(match[2], { name: match[1], lastSeenAt: match[3] });
  }
  return map;
}

function buildLastSeenMd(members, seenMap) {
  const rows = members
    .map(m => {
      const entry = seenMap.get(m.slug);
      return { name: m.nickname || m.name || m.slug, slug: m.slug, lastSeenAt: entry?.lastSeenAt ?? '—' };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return [
    '# Last Seen — The Misfits',
    '',
    '_Best-effort log of the most recent time each member\'s widget actually loaded, based on real hits to `/widget/[slug]`. Populated by `scripts/flush-last-seen.mjs` on a cron. Since the counter lives in serverless function memory, this can lag or miss low-traffic members between flushes — treat it as a "gone dark" signal, not precise analytics._',
    '',
    '| Member | Slug | Last Seen (Widget Ping) |',
    '|--------|------|--------------------------|',
    ...rows.map(r => `| ${r.name} | ${r.slug} | ${r.lastSeenAt} |`),
    '',
  ].join('\n');
}

async function main() {
  if (!DRY_RUN && !GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN is not set');
    process.exit(1);
  }
  if (!HITS_FLUSH_SECRET) {
    console.error('HITS_FLUSH_SECRET is not set');
    process.exit(1);
  }

  const res = await fetch(`${SITE_ORIGIN}/api/widget-hits?token=${encodeURIComponent(HITS_FLUSH_SECRET)}`);
  if (!res.ok) {
    console.error(`Failed to fetch widget hits: HTTP ${res.status}`);
    process.exit(1);
  }
  const hits = await res.json();
  console.log(`Fetched ${Object.keys(hits).length} new hit(s).`);

  const files = readdirSync(MEMBERS_DIR).filter(f => f.endsWith('.md')).sort();
  const members = files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const raw = readFileSync(join(MEMBERS_DIR, filename), 'utf-8');
    const { data } = matter(raw);
    return { slug, ...data };
  });

  let existing = '';
  try {
    existing = readFileSync(join(__dirname, '..', LAST_SEEN_PATH), 'utf-8');
  } catch {
    // no existing file yet
  }
  const seenMap = parseLastSeenTable(existing);

  for (const [slug, timestamp] of Object.entries(hits)) {
    const member = members.find(m => m.slug === slug);
    seenMap.set(slug, { name: member?.nickname || member?.name || slug, lastSeenAt: timestamp });
  }

  const md = buildLastSeenMd(members, seenMap);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Would write last-seen.md:\n');
    console.log(md);
    return;
  }

  await updateFile(LAST_SEEN_PATH, md, 'Update last-seen widget ping log');
  console.log('last-seen.md updated.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
