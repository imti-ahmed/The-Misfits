import { Plus, GitFork, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { getSites } from "@/lib/sites";
import { withRef } from "@/lib/ref";
import styles from "./GuildSection.module.css";

export default function GuildSection() {
  const members = getSites();

  return (
    <div className={styles.container}>
      {/* Guild Info */}
      <div className={styles.infoHeader}>
        <p className={styles.infoHeaderTitle}>The Guild Members</p>
        <Plus size={20} className={styles.infoHeaderIcon} />
      </div>

      <div className={styles.infoContent}>
        <p className={styles.infoText}>
          The list of all the active guild members of this webring. Everyone here is an utterly
          crazy and interesting person making or building cool shit. P.S. The order of the ring is
          randomized.
        </p>
      </div>

      {/* Members List */}
      <div className={styles.membersListWrapper}>
        <ol className={styles.membersList}>
          {members.map((member) => (
            <li key={member.slug} className={styles.memberItem}>
              <span className={styles.memberName}>{member.name}</span>
              <a href={withRef(member.url)} target="_blank" rel="noopener noreferrer" className={styles.memberUrl}>{member.url}</a>
            </li>
          ))}
        </ol>
      </div>

      {/* Update Log Header */}
      <div className={styles.updateLogHeader}>
        <div className={styles.updateLogLeft}>
          <GitFork size={20} className={styles.updateLogIcon} />
          <p className={styles.updateLogText}>Update Logs @2026 [v2.0.1]</p>
        </div>
        <CaretRight size={20} className={styles.updateLogIcon} />
      </div>
    </div>
  );
}
