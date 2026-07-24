import { ReactNode } from 'react';
import HeaderTag from './HeaderTag';
import styles from './TaggedSection.module.css';

type TaggedSectionColor = 'yellow' | 'purple' | 'green' | 'blue' | 'pink';

interface TaggedSectionProps {
  headerLabel: string;
  content: ReactNode[];
  color?: TaggedSectionColor;
  fullWidth?: boolean;
}

export default function TaggedSection({ headerLabel, content, color = 'yellow', fullWidth = false }: TaggedSectionProps) {
  return (
    <div className={`${styles.section} ${fullWidth ? styles.sectionFullWidth : ''}`} data-transition-group="card">
      <HeaderTag label={headerLabel} color={color} fullWidth={fullWidth} />
      {content.map((node, i) => (
        <div key={i} className={styles.contentBox}>
          <div className={styles.contentText}>{node}</div>
        </div>
      ))}
    </div>
  );
}
