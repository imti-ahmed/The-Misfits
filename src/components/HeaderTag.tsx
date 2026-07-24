import styles from './HeaderTag.module.css';

type HeaderTagColor = 'yellow' | 'purple' | 'green' | 'blue' | 'pink';

interface HeaderTagProps {
  label: string;
  color?: HeaderTagColor;
  fullWidth?: boolean;
}

export default function HeaderTag({ label, color = 'yellow', fullWidth = false }: HeaderTagProps) {
  return (
    <div className={`${styles.headerTag} ${styles[color]} ${fullWidth ? styles.full : ''}`}>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
