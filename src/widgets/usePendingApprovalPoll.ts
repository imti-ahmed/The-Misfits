'use client';

import { useEffect } from 'react';

const POLL_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const MAX_DURATION_MS = 48 * 60 * 60 * 1000; // 2 days

// Polls /api/member/{slug}/status until the member's PR is merged, then
// reloads. That GET call is also what cleans up the members/pending copy
// once the real members/{slug}.md file exists — see the route.
export function usePendingApprovalPoll(slug: string) {
  useEffect(() => {
    const startKey = `guild-pending-start-${slug}`;
    const lastCheckKey = `guild-pending-last-${slug}`;

    const now = Date.now();

    if (!localStorage.getItem(startKey)) {
      localStorage.setItem(startKey, String(now));
    }

    const startTime = parseInt(localStorage.getItem(startKey)!, 10);

    // Stop polling after 2 days
    if (now - startTime >= MAX_DURATION_MS) return;

    const lastCheck = parseInt(localStorage.getItem(lastCheckKey) ?? '0', 10);
    const timeSinceLast = now - lastCheck;
    const delay = Math.max(0, POLL_INTERVAL_MS - timeSinceLast);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/member/${slug}/status`);
        const data = await res.json();
        localStorage.setItem(lastCheckKey, String(Date.now()));
        if (data.active) window.location.reload();
      } catch {
        // silent fail — try again next visit
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [slug]);
}
