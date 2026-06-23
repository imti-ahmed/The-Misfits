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
            Personal sites only. No company pages, landing pages, or portfolios
            dressed up as a resume.
          </li>
          <li>
            Something worth the click. Leave a visitor informed, intrigued, or
            just thinking &quot;huh, that&apos;s cool.&quot;
          </li>
          <li>
            Open to anyone making cool stuff. Builders, vibe coders, designers,
            artists, developers, hobbyists. No credentials required.
          </li>
          <li>
            No illegal, adult, or disturbing content. Goes without saying, but
            here we are.
          </li>
          <li>
            The Webring widget must be embedded visibly on your homepage.
            That&apos;s literally how the ring works.
          </li>
          <li>
            Keep your site live and updated. Inactive sites and unreachable
            members get removed from the ring.
          </li>
          <li>
            Every submission is manually reviewed. We may accept or reject, and
            we&apos;ll let you know either way.
          </li>
          <li>
            This is an attempt to bring cool people together. Not just discover
            sites - befriend the people making them. Be around builders that&apos;s
            my current ongoing motto.
          </li>
        </ul>
      </div>
    </div>
  );
}
