import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const GH_HEADERS = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

interface Release {
  version: string;
  date: Date;
}

function parseReleases(): Release[] {
  try {
    const file = path.join(process.cwd(), 'internal', 'RELEASES.md');
    const content = fs.readFileSync(file, 'utf-8');
    const releases: Release[] = [];
    for (const line of content.split('\n')) {
      const m = line.match(/\|\s*(v[\d.]+)\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|/);
      if (m) releases.push({ version: m[1], date: new Date(m[2]) });
    }
    return releases.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch {
    return [];
  }
}

function versionForDate(commitDate: Date, releases: Release[]): string | null {
  for (const r of releases) {
    if (r.date <= commitDate) return r.version;
  }
  return null;
}

export async function GET() {
  const res = await fetch(
    'https://api.github.com/repos/imti-ahmed/The-Misfits/commits?per_page=5',
    { headers: GH_HEADERS, next: { revalidate: 300 } }
  );

  if (!res.ok) return NextResponse.json([], { status: res.status });

  const data = await res.json();
  const releases = parseReleases();

  const commits = data.map((c: { commit: { message: string; author: { date: string } } }) => {
    const commitDate = new Date(c.commit.author.date);
    return {
      version: versionForDate(commitDate, releases),
      title: c.commit.message.split('\n')[0],
      date: c.commit.author.date,
    };
  });

  return NextResponse.json(commits);
}
