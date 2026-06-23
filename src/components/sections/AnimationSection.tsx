import { Eye, UserFocus, Plus } from "@phosphor-icons/react/dist/ssr";
import { unstable_noStore as noStore } from "next/cache";
import DotGridBackground from "@/components/DotGridBackground";
import ViewTracker from "@/components/ViewTracker";
import { getSites } from "@/lib/sites";
import { getViews } from "@/lib/db";
import styles from "./AnimationSection.module.css";

export default async function AnimationSection() {
  noStore();

  const count = getSites().length;
  const formattedCount = String(count).padStart(3, "0");

  let views = 0;
  try {
    views = await getViews();
  } catch {
    // DB unavailable — show 0
  }
  const formattedViews = String(views).padStart(6, "0");

  return (
    <div className={styles.container}>
      <ViewTracker />
      <div className={styles.statsHeader}>
        <div className={styles.statsLeft}>
          <div className={styles.statGroup}>
            <Eye size={20} className={styles.statIcon} />
            <p className={styles.statLabel}>Views [{formattedViews}]</p>
          </div>
          <div className={styles.statGroup}>
            <UserFocus size={20} className={styles.statIcon} />
            <p className={styles.statLabel}>Members [{formattedCount}]</p>
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
