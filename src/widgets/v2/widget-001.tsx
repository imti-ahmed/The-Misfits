import styles from './widget-001.module.css';
import { SITE_ORIGIN } from '@/lib/site';
import { MisfitsMark } from './icons';

interface Props {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

export default function Widget001({ nickname, slug, bgColor, textColor }: Props) {
  const style = {
    '--widget-bg': bgColor || '#356aff',
    '--widget-text': textColor || '#ffffff',
  } as React.CSSProperties;

  return (
    <div className={styles.widget} style={style}>
      <div className={styles.badge}>
        <MisfitsMark />
        <span className={styles.badgeLabel}>{nickname} @ misfits</span>
      </div>
      <div className={styles.bar}>
        <span className={styles.barLabel}>member of the webring</span>
        <div className={styles.nav}>
          <a href={`${SITE_ORIGIN}/api/ring/${slug}/next`} target="_blank" rel="noopener noreferrer" className={styles.navItem}>
            [next]
          </a>
          <a href={`${SITE_ORIGIN}/api/ring/${slug}/rand`} target="_blank" rel="noopener noreferrer" className={styles.navItem}>
            [rand]
          </a>
          <a href={`${SITE_ORIGIN}/api/ring/${slug}/prev`} target="_blank" rel="noopener noreferrer" className={styles.navItem}>
            [prev]
          </a>
        </div>
      </div>
    </div>
  );
}
