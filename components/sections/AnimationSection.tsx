import { Eye, UserFocus, Plus } from "@phosphor-icons/react/dist/ssr";
import DotGridBackground from "@/components/DotGridBackground";
import styles from "./AnimationSection.module.css";

export default function AnimationSection() {
  return (
    <div className={styles.container}>
      <div className={styles.statsHeader}>
        <div className={styles.statsLeft}>
          <div className={styles.statGroup}>
            <Eye size={20} className={styles.statIcon} />
            <p className={styles.statLabel}>Views [12345]</p>
          </div>
          <div className={styles.statGroup}>
            <UserFocus size={20} className={styles.statIcon} />
            <p className={styles.statLabel}>Members [024]</p>
          </div>
        </div>
        <Plus size={20} className={styles.headerIcon} />
      </div>

      <div className={styles.coolInteraction}>
        <DotGridBackground />
      </div>
    </div>
  );
}
