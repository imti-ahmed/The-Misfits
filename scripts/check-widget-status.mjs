import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MEMBERS_DIR = join(__dirname, '..', 'members');
const STATUS_PATH = 'widget-status.md';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'imti-ahmed/The-Misfits';
const GITHUB_BASE = process.env.GITHUB_BASE_BRANCH ?? 'main';
const SITE_ORIGIN = process.env.SITE_ORIGIN ?? 'https://themisfits.byimti.tools';
const DRY_RUN = process.env.DRY_RUN === 'true';
const CHECK_TIMEOUT_MS = 10_000;

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

// Live-checks a single member's embed URL. "Active" means the real, approved
// widget actually rendered; anything that errors or times out is a "Failure".
// "Not Found" is decided by the caller from local member-file existence,
// since the embed route itself never returns a real 404.
async function checkStatus(slug, approved) {
  if (!approved) return 'Not Found';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
  try {
    const res = await fetch(`${SITE_ORIGIN}/embed/${slug}`, { signal: controller.signal });
    return res.ok ? 'Active' : 'Failure';
  } catch {
    return 'Failure';
  } finally {
    clearTimeout(timeout);
  }
}

function buildStatusMd(rows) {
  return [
    '# Widget Status — The Misfits',
    '',
    '_Live status of each member\'s widget, checked by fetching `/embed/[slug]` directly. Populated by `scripts/check-widget-status.mjs` on a cron. **Active** = the real widget rendered successfully. **Failure** = the request errored or timed out. **Not Found** = no member file exists for that slug._',
    '',
    '| Member | Slug | Status |',
    '|--------|------|--------|',
    ...rows.map(r => `| ${r.name} | ${r.slug} | ${r.status} |`),
    '',
  ].join('\n');
}

async function main() {
  if (!DRY_RUN && !GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN is not set');
    process.exit(1);
  }

  // members/ won't exist once the last .md file in it is removed — Git
  // doesn't track empty directories.
  const files = existsSync(MEMBERS_DIR) ? readdirSync(MEMBERS_DIR).filter(f => f.endsWith('.md')).sort() : [];
  const members = files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const raw = readFileSync(join(MEMBERS_DIR, filename), 'utf-8');
    const { data } = matter(raw);
    return { slug, ...data, filePath: join(MEMBERS_DIR, filename) };
  });

  const rows = await Promise.all(
    members
      .map(m => ({ name: m.nickname || m.name || m.slug, slug: m.slug, approved: existsSync(m.filePath) }))
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map(async m => ({ ...m, status: await checkStatus(m.slug, m.approved) }))
  );

  rows.forEach(r => console.log(`${r.slug}: ${r.status}`));

  const md = buildStatusMd(rows);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Would write widget-status.md:\n');
    console.log(md);
    return;
  }

  await updateFile(STATUS_PATH, md, 'Update widget status log');
  console.log('widget-status.md updated.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
