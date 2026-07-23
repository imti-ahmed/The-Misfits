'use client';

import styles from './WidgetPending.module.css';
import { usePendingApprovalPoll } from './usePendingApprovalPoll';

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

export default function WidgetPending({ slug }: { slug: string }) {
  usePendingApprovalPoll(slug);

  return (
    <div className={styles.widget}>
      <GuildMark />
      <span className={styles.label}>Joining The Makers Guild</span>
    </div>
  );
}
