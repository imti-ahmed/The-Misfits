import { Plus } from "@phosphor-icons/react/dist/ssr";
import styles from "./JoinSection.module.css";

export default function JoinSection() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>How To Join?</p>
        <Plus size={20} className={styles.headerIcon} />
      </div>

      <div className={styles.content}>
        <p className={styles.bodyText}>
          Submit your site through the form on this site, or open a request on our GitHub. Once
          approved, embed the widget and you&apos;re officially part of the Guild. Usually takes
          1&ndash;2 days, and you&apos;ll hear back by email.
        </p>
      </div>
    </div>
  );
}
