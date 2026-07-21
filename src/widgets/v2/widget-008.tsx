import styles from './widget-008.module.css';
import { SITE_ORIGIN } from '@/lib/site';
import { MisfitsMark, SkipIcon, ShuffleIcon } from './icons';

interface Props {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

export default function Widget008({ slug, bgColor, textColor }: Props) {
  const style = {
    '--widget-bg': bgColor || '#356aff',
    '--widget-text': textColor || '#ffffff',
  } as React.CSSProperties;

  return (
    <div className={styles.widget} style={style}>
      <div className={styles.label}>misfits webring</div>
      <div className={styles.row}>
        <div className={styles.iconBadge}>
          <MisfitsMark />
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
    </div>
  );
}
