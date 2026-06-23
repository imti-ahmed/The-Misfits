'use client';

import { useEffect } from 'react';
import styles from './WidgetPending.module.css';

function GuildMark({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="rgba(255,255,255,0.5)" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M7 7V10.5H3.5V7H7Z" />
      <path d="M3.5 7V10.5H0V7H3.5Z" />
      <path d="M5.25 3.5V7H1.75V3.5H5.25Z" />
      <path d="M8.75 0V3.5H5.25V0H8.75Z" />
      <path d="M12.25 3.5V7H8.75V3.5H12.25Z" />
      <path d="M8.75 10.5V14H5.25V10.5H8.75Z" />
      <path d="M10.5 7V10.5H7V7H10.5Z" />
      <path d="M14 7V10.5H10.5V7H14Z" />
    </svg>
  );
}

const POLL_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const MAX_DURATION_MS = 48 * 60 * 60 * 1000; // 2 days

export default function WidgetPending({ slug }: { slug: string }) {
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

  return (
    <div className={styles.widget}>
      <GuildMark />
      <span className={styles.label}>Joining The Makers Guild</span>
    </div>
  );
}
