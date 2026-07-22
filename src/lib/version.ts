import fs from "fs";
import path from "path";

export function getLatestVersion(): string {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), "internal", "RELEASES.md"), "utf-8");
    for (const line of content.split("\n")) {
      const m = line.match(/\|\s*(v[\d.]+)\s*\|\s*\d{4}-\d{2}-\d{2}\s*\|/);
      if (m) return m[1];
    }
  } catch {}
  return "v0.0.0";
}

// The site's public launch date — Days Online counts from here, clamped at 0
// until the date arrives.
const LAUNCH_DATE = new Date("2026-07-25T00:00:00Z");

export function getDaysOnline(): number {
  const diffMs = Date.now() - LAUNCH_DATE.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO ?? "imti-ahmed/The-Misfits";

// Latest commit on the base branch — covers merged PRs too, since a merge is
// itself a commit on main.
export async function getLastUpdateDate(): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return "—";

    const data = await res.json();
    const dateStr = data[0]?.commit?.committer?.date;
    if (!dateStr) return "—";

    const d = new Date(dateStr);
    return `${d.getDate()}.${d.getMonth() + 1}.${String(d.getFullYear()).slice(-2)}`;
  } catch {
    return "—";
  }
}

// Member add/remove events are already recorded as plain commit messages
// ("Add member: X" / "Remove member: X") by the apply route and the removal
// scripts — no separate tracking needed, just read recent commit history.
export async function getRecentMemberActivityMessages(limit = 5): Promise<string[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=30`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const messages: string[] = [];
    for (const commit of data) {
      const line = (commit?.commit?.message ?? "").split("\n")[0].trim();

      const added = line.match(/^Add member:\s*(.+)$/i);
      const removed = line.match(/^Remove member:\s*(.+)$/i);
      const nickname = (added?.[1] ?? removed?.[1])?.replace(/\s*\(#\d+\)$/, "").trim();
      if (!nickname) continue;

      messages.push(added ? `${nickname} joined the webring` : `${nickname} left the webring`);
      if (messages.length >= limit) break;
    }

    return messages;
  } catch {
    return [];
  }
}
