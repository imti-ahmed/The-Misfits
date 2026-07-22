import styles from './NavTag.module.css';

interface NavTagProps {
  label: string;
}

export default function NavTag({ label }: NavTagProps) {
  return (
    <div className={styles.navTag}>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
