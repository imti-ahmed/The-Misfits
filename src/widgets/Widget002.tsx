import { ArrowLeft, ArrowRight, ArrowSquareOut, List } from '@phosphor-icons/react/dist/ssr';
import styles from './Widget002.module.css';

interface Props {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

function GuildMark({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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

export default function Widget002({ nickname, slug, bgColor, textColor }: Props) {
  const style = {
    '--widget-bg': bgColor ?? '#f8f8f8',
    '--widget-text': textColor ?? '#000000',
  } as React.CSSProperties;

  return (
    <div className={styles.widget} style={style}>
      <div className={styles.header}>
        <div className={styles.identity}>
          <GuildMark />
          <span className={styles.label}>{nickname} @ MAKERS GUILD</span>
        </div>
        <a
          href="https://themakersguil.com"
          className={styles.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit The Makers Guild"
        >
          <ArrowSquareOut size={11} weight="regular" />
        </a>
      </div>
      <div className={styles.nav}>
        <a href={`/api/ring/${slug}/prev`} className={styles.navItem} aria-label="Previous site">
          <ArrowLeft size={12} weight="regular" />
        </a>
        <a href={`/api/ring/${slug}/rand`} className={styles.navItem} aria-label="Random site">
          <List size={12} weight="regular" />
        </a>
        <a href={`/api/ring/${slug}/next`} className={styles.navItem} aria-label="Next site">
          <ArrowRight size={12} weight="regular" />
        </a>
      </div>
    </div>
  );
}
