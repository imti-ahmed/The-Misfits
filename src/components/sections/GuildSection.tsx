import { Plus } from "@phosphor-icons/react/dist/ssr";
import fs from "fs";
import path from "path";
import { getSites } from "@/lib/sites";
import { withRef } from "@/lib/ref";
import MemberLink from "@/components/MemberLink";
import UpdateLogButton from "@/components/sections/UpdateLogButton";
import styles from "./GuildSection.module.css";

function getLatestVersion(): string {
  try {
    const content = fs.readFileSync(
      path.join(process.cwd(), "internal", "RELEASES.md"),
      "utf-8"
    );
    for (const line of content.split("\n")) {
      const m = line.match(/\|\s*(v[\d.]+)\s*\|\s*\d{4}-\d{2}-\d{2}\s*\|/);
      if (m) return m[1];
    }
  } catch {}
  return "v0.0.0";
}

export default function GuildSection() {
  const members = getSites();
  const latestVersion = getLatestVersion();

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
              <MemberLink href={withRef(member.url)} className={styles.memberUrl}>{member.url}</MemberLink>
            </li>
          ))}
        </ol>
      </div>

      <UpdateLogButton versionLabel={`Update Logs @2026 [${latestVersion}]`} />
    </div>
  );
}
