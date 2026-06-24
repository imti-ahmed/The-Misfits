import { ArrowLeft, ArrowRight, List } from '@phosphor-icons/react/dist/ssr';
import styles from './Widget001.module.css';

interface Props {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

function GuildMark({ size = 11 }: { size?: number }) {
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

export default function Widget001({ nickname, slug, bgColor, textColor }: Props) {
  const style = {
    '--widget-bg': bgColor ?? '#000000',
    '--widget-text': textColor ?? '#ffffff',
  } as React.CSSProperties;

  return (
    <div className={styles.widget} style={style}>
      <div className={styles.header}>
        <GuildMark />
        <span className={styles.label}>{nickname} @ MAKERS GUILD</span>
      </div>
      <div className={styles.nav}>
        <a href={`/api/ring/${slug}/prev`} target="_blank" rel="noopener noreferrer" className={styles.navItem} aria-label="Previous site">
          <ArrowLeft size={12} weight="regular" color="currentColor" />
        </a>
        <a href={`/api/ring/${slug}/rand`} target="_blank" rel="noopener noreferrer" className={styles.navItem} aria-label="Random site">
          <List size={12} weight="regular" color="currentColor" />
        </a>
        <a href={`/api/ring/${slug}/next`} target="_blank" rel="noopener noreferrer" className={styles.navItem} aria-label="Next site">
          <ArrowRight size={12} weight="regular" color="currentColor" />
        </a>
      </div>
    </div>
  );
}
