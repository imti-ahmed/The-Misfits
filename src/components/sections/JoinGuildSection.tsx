import { Plus } from "@phosphor-icons/react/dist/ssr";
import styles from "./JoinGuildSection.module.css";

export default function JoinGuildSection() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Join The Guild</p>
        <Plus size={20} className={styles.headerIcon} />
      </div>

      <div className={styles.content}>
        <p className={styles.bodyText}>
          Welcome Cool Strange. To join the guild, please fill the form below and choose the kind
          of webring widget you want to embed in your website. Want different colors? Please specify
          the hex codes in the form below and submit - and we handle the rest. You will get an
          embed code, add that to your site and once we approve, you will part of the webring.
        </p>
      </div>
    </div>
  );
}
