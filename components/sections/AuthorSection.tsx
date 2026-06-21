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
            <span className={styles.accentLinks}>Portfolio, Twitter, Linkedin, Github.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
