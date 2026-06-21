import { Plus } from "@phosphor-icons/react/dist/ssr";
import styles from "./AuthorSection.module.css";

export default function AuthorSection() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>About The Author</p>
        <Plus size={20} className={styles.headerIcon} />
      </div>

      <div className={styles.content}>
        <div className={styles.bodyText}>
          <p>Designed, developed and maintained by Imtiyaz Ahmed.</p>
          <p>
            Find me on{" "}
            <a href="https://www.imtiyazahmed.com/" target="_blank" rel="noopener noreferrer" className={styles.accentLinks}>Portfolio</a>,{" "}
            <a href="https://x.com/imtiahmed01" target="_blank" rel="noopener noreferrer" className={styles.accentLinks}>Twitter</a>,{" "}
            <a href="https://www.linkedin.com/in/iamimtiyazahmed/" target="_blank" rel="noopener noreferrer" className={styles.accentLinks}>Linkedin</a>,{" "}
            <a href="http://github.com/imti-ahmed" target="_blank" rel="noopener noreferrer" className={styles.accentLinks}>Github</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
