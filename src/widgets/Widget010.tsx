import { CaretLeft, CaretRight, List } from '@phosphor-icons/react/dist/ssr';
import styles from './Widget010.module.css';

interface Props {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

function GuildMark({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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

export default function Widget010({ nickname, slug }: Props) {
  return (
    <div className={styles.widget}>
      <GuildMark />
      <span className={styles.nickname}>{nickname}</span>
      <span className={styles.slash}>/</span>
      <span className={styles.guild}>THE MAKERS GUILD</span>
      <div className={styles.nav}>
        <a href={`/api/ring/${slug}/prev`} target="_blank" rel="noopener noreferrer" className={styles.navItem} aria-label="Previous site">
          <CaretLeft size={14} weight="regular" color="#ffffff" />
        </a>
        <a href={`/api/ring/${slug}/rand`} target="_blank" rel="noopener noreferrer" className={styles.navItem} aria-label="Random site">
          <List size={14} weight="regular" color="#ffffff" />
        </a>
        <a href={`/api/ring/${slug}/next`} target="_blank" rel="noopener noreferrer" className={styles.navItem} aria-label="Next site">
          <CaretRight size={14} weight="regular" color="#ffffff" />
        </a>
      </div>
    </div>
  );
}
