import { Eye, UserFocus, Plus } from "@phosphor-icons/react/dist/ssr";
import styles from "./AnimationSection.module.css";

const COOL_INTERACTION_PLACEHOLDER =
  "https://www.figma.com/api/mcp/asset/d7be47c9-b813-4413-9b78-c2623941422c";

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

      {/* Placeholder for GSAP animation — image to be replaced */}
      <div className={styles.coolInteraction}>
        <img src={COOL_INTERACTION_PLACEHOLDER} alt="" />
      </div>
    </div>
  );
}
