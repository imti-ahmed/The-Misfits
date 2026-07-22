import { ReactNode } from 'react';
import HeaderTag from './HeaderTag';
import styles from './TaggedSection.module.css';

type TaggedSectionColor = 'yellow' | 'purple' | 'green' | 'blue' | 'pink';

interface TaggedSectionProps {
  headerLabel: string;
  content: ReactNode[];
  color?: TaggedSectionColor;
}

export default function TaggedSection({ headerLabel, content, color = 'yellow' }: TaggedSectionProps) {
  return (
    <div className={styles.section}>
      <HeaderTag label={headerLabel} color={color} />
      {content.map((node, i) => (
        <div key={i} className={styles.contentBox}>
          <div className={styles.contentText}>{node}</div>
        </div>
      ))}
    </div>
  );
}
