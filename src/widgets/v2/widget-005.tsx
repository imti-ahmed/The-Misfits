import styles from './widget-005.module.css';
import { SITE_ORIGIN } from '@/lib/site';
import { MisfitsMark } from './icons';

interface Props {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

export default function Widget005({ nickname, slug, bgColor, textColor }: Props) {
  const style = {
    '--widget-bg': bgColor || '#356aff',
    '--widget-text': textColor || '#ffffff',
  } as React.CSSProperties;

  return (
    <div className={styles.widget} style={style}>
      <div className={styles.navRow}>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/prev`} target="_blank" rel="noopener noreferrer" className={styles.navItem}>
          [prev]
        </a>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/rand`} target="_blank" rel="noopener noreferrer" className={styles.navItem}>
          [rand]
        </a>
        <a href={`${SITE_ORIGIN}/api/ring/${slug}/next`} target="_blank" rel="noopener noreferrer" className={styles.navItem}>
          [next]
        </a>
      </div>
      <div className={styles.identity}>
        <a href={SITE_ORIGIN} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', color: 'inherit' }}>
          <MisfitsMark />
        </a>
        <span className={styles.label}>
          {nickname} @ <a href={SITE_ORIGIN} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>misfits</a>
        </span>
      </div>
    </div>
  );
}
