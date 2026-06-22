import styles from './Widget006.module.css';

interface Props {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

function GuildMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="#f4f4f5" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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

export default function Widget006({ slug }: Props) {
  return (
    <div className={styles.widget}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <GuildMark />
          <span className={styles.label}>MEMBER OF WEBRING - THE MAKERS GUILD</span>
        </div>
        <div className={styles.buttons}>
          <a href={`/api/ring/${slug}/prev`} className={styles.button}>BACK</a>
          <a href={`/api/ring/${slug}/next`} className={styles.button}>NEXT</a>
          <a href={`/api/ring/${slug}/rand`} className={styles.button}>SHUFFLE</a>
        </div>
      </div>
    </div>
  );
}
