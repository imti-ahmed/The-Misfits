import styles from './widget-007.module.css';
import { SITE_ORIGIN } from '@/lib/site';
import { SkipIcon, ShuffleIcon } from './icons';

interface Props {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

export default function Widget007({ slug, bgColor, textColor }: Props) {
  const style = {
    '--widget-bg': bgColor || '#356aff',
    '--widget-text': textColor || '#ffffff',
  } as React.CSSProperties;

  return (
    <div className={styles.widget} style={style}>
      <div className={styles.identity}>
        <span className={styles.label}>misfits</span>
      </div>
      <div className={styles.navPill}>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/prev`} target="_blank" rel="noopener noreferrer" className={styles.navBtn} aria-label="Previous site">
          <SkipIcon flip />
        </a>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/rand`} target="_blank" rel="noopener noreferrer" className={styles.navBtn} aria-label="Random site">
          <ShuffleIcon />
        </a>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/next`} target="_blank" rel="noopener noreferrer" className={styles.navBtn} aria-label="Next site">
          <SkipIcon />
        </a>
      </div>
    </div>
  );
}
