import styles from './HeaderTag.module.css';

type HeaderTagColor = 'yellow' | 'purple' | 'green' | 'blue' | 'pink';

interface HeaderTagProps {
  label: string;
  color?: HeaderTagColor;
}

export default function HeaderTag({ label, color = 'yellow' }: HeaderTagProps) {
  return (
    <div className={`${styles.headerTag} ${styles[color]}`}>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
