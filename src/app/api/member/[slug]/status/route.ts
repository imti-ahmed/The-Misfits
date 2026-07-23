import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'imti-ahmed/The-Misfits';
const GITHUB_BASE = process.env.GITHUB_BASE_BRANCH ?? 'main';

async function gh(path: string, options: RequestInit = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...((options.headers ?? {}) as Record<string, string>),
    },
  });
}

// Best-effort — the pending copy is only a stopgap for pre-approval
// rendering, so leaving it behind on failure isn't harmful, just untidy.
async function deletePendingFile(slug: string): Promise<void> {
  if (!GITHUB_TOKEN) return;
  try {
    const repoPath = `members-pending/${slug}.md`;
    const check = await gh(`/repos/${GITHUB_REPO}/contents/${repoPath}?ref=${GITHUB_BASE}`);
    if (!check.ok) return;
    const existing = await check.json();
    await gh(`/repos/${GITHUB_REPO}/contents/${repoPath}`, {
      method: 'DELETE',
      body: JSON.stringify({ message: `Remove pending widget preview: ${slug}`, sha: existing.sha, branch: GITHUB_BASE }),
    });
  } catch (err) {
    console.error('[member-status] Failed to clean up pending widget preview:', err);
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'members', `${slug}.md`);
  const active = fs.existsSync(filePath);

  if (active && fs.existsSync(path.join(process.cwd(), 'members-pending', `${slug}.md`))) {
    void deletePendingFile(slug);
  }

  return NextResponse.json({ active });
}
