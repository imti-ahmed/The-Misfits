import { Plus, GitFork, CaretRight } from "@phosphor-icons/react/dist/ssr";
import styles from "./GuildSection.module.css";

const MEMBERS = [
  { name: "Imtiyaz Ahmed", url: "https://www.imtiyazahmed.com" },
  { name: "Jia Chen", url: "https://www.jia.build" },
  { name: "Edoardo Lunardi", url: "https://www.edoardolunardi.dev/" },
  { name: "Mark Zuckerberg", url: "https://www.irritatedmarky.dev" },
  { name: "Elon Musk", url: "https://www.elonmusk.com" },
  { name: "Pablo Stanley", url: "https://www.pablo.me" },
  { name: "Sheldon Cooper", url: "https://www.sheldon.bazinga" },
  { name: "Rachel Tan", url: "https://www.rachelartwork.com" },
  { name: "Zoe Chin", url: "https://www.zoechin.com" },
  { name: "Queenie Hsioa", url: "https://www.queenie.works" },
  { name: "Mariano Pascual", url: "https://www.marianopascual.me/" },
];

export default function GuildSection() {
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
          randomized daily.
        </p>
      </div>

      {/* Members List */}
      <div className={styles.membersListWrapper}>
        <ol className={styles.membersList}>
          {MEMBERS.map((member) => (
            <li key={member.url} className={styles.memberItem}>
              <span className={styles.memberName}>{member.name}</span>
              <span className={styles.memberUrl}>{member.url}</span>
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
