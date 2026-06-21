import { Plus } from "@phosphor-icons/react/dist/ssr";
import styles from "./RequirementSection.module.css";

export default function RequirementSection() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Requirements To Join The Guild</p>
        <Plus size={20} className={styles.headerIcon} />
      </div>

      <div className={styles.content}>
        <ul className={styles.list}>
          <li>
            Personal sites only. No company pages, no portfolios dressed up as a resume, no landing
            pages trying to sell you something.
          </li>
          <li>
            Your site should be worth the click. Ask yourself: would a total stranger leave having
            learned something, gotten curious, or just thought &quot;huh, that&apos;s cool&quot;?
          </li>
          <li>
            Can be anyone - builder, vibe coder, designer, artist, developer, or just someone making
            cool stuff in their spare time. No serious credentials required.
          </li>
          <li>
            No illegal, NSFW, or disturbing content. Should go without saying, but here we are.
          </li>
          <li>
            You must embed the Guild widget visibly on your homepage - that&apos;s literally how the
            ring works.
          </li>
          <li>
            Keep your site updated. Inactive sites and unreachable members get removed from the
            ring.
          </li>
          <li>We manually review every submission and may accept or reject it.</li>
        </ul>
      </div>
    </div>
  );
}
