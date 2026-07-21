import styles from './Widget009.module.css';
import { SITE_ORIGIN } from '@/lib/site';

interface Props {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

function GuildMark({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="#f2f2f2" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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

export default function Widget009({ nickname, slug }: Props) {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.headerLabel}>{nickname} - THE MAKERS GUILD</span>
          <GuildMark />
        </div>
      </div>
      <div className={styles.nav}>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/prev`} target="_blank" rel="noopener noreferrer" className={styles.navLink}>PREV</a>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/rand`} target="_blank" rel="noopener noreferrer" className={styles.navLink}>SHUFFLE</a>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/next`} target="_blank" rel="noopener noreferrer" className={styles.navLink}>NEXT</a>
      </div>
    </div>
  );
}
