import styles from './Widget011.module.css';
import { SITE_ORIGIN } from '@/lib/site';

interface Props {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

function GoldGuildMark({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="#f1ac3c" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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

function MenuIcon() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="#f1ac3c" aria-hidden>
      <rect x="0" y="0"   width="12" height="2" rx="0.5" />
      <rect x="0" y="4"   width="12" height="2" rx="0.5" />
      <rect x="0" y="8"   width="12" height="2" rx="0.5" />
    </svg>
  );
}

function LeftCaret() {
  const d = 1.714;
  const r = 0.857;
  return (
    <svg width="15" height="12" viewBox="0 0 14.571 12" fill="#f1ac3c" aria-hidden>
      <rect x="5.14" y="0"     width={d} height={d} rx={r} />
      <rect x="2.57" y="2.57"  width={d} height={d} rx={r} />
      <rect x="0"    y="5.14"  width={d} height={d} rx={r} />
      <rect x="2.57" y="7.71"  width={d} height={d} rx={r} />
      <rect x="5.14" y="10.29" width={d} height={d} rx={r} />
      <rect x="12.86" y="0"     width={d} height={d} rx={r} />
      <rect x="10.29" y="2.57"  width={d} height={d} rx={r} />
      <rect x="7.71"  y="5.14"  width={d} height={d} rx={r} />
      <rect x="10.29" y="7.71"  width={d} height={d} rx={r} />
      <rect x="12.86" y="10.29" width={d} height={d} rx={r} />
    </svg>
  );
}

function RightCaret() {
  const d = 1.714;
  const r = 0.857;
  return (
    <svg width="15" height="12" viewBox="0 0 14.571 12" fill="#f1ac3c" aria-hidden>
      <rect x="0"    y="0"     width={d} height={d} rx={r} />
      <rect x="2.57" y="2.57"  width={d} height={d} rx={r} />
      <rect x="5.15" y="5.14"  width={d} height={d} rx={r} />
      <rect x="2.57" y="7.71"  width={d} height={d} rx={r} />
      <rect x="0"    y="10.29" width={d} height={d} rx={r} />
      <rect x="7.72"  y="0"     width={d} height={d} rx={r} />
      <rect x="10.29" y="2.57"  width={d} height={d} rx={r} />
      <rect x="12.86" y="5.14"  width={d} height={d} rx={r} />
      <rect x="10.29" y="7.71"  width={d} height={d} rx={r} />
      <rect x="7.72"  y="10.29" width={d} height={d} rx={r} />
    </svg>
  );
}


export default function Widget011({ nickname, slug }: Props) {
  return (
    <div className={styles.widget}>
      <div className={styles.identity}>
        <span className={styles.label}>{nickname}</span>
        <GoldGuildMark />
        <span className={styles.label}>the makers guild</span>
      </div>
      <div className={styles.nav}>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/prev`} target="_blank" rel="noopener noreferrer" className={styles.navLink} aria-label="Previous site">
          <LeftCaret />
        </a>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/rand`} target="_blank" rel="noopener noreferrer" className={styles.navLink} aria-label="Random site">
          <MenuIcon />
        </a>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/next`} target="_blank" rel="noopener noreferrer" className={styles.navLink} aria-label="Next site">
          <RightCaret />
        </a>
      </div>
    </div>
  );
}
