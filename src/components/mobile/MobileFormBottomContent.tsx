import { Plus, Eye, UserFocus } from "@phosphor-icons/react/dist/ssr";
import { unstable_noStore as noStore } from "next/cache";
import fs from "fs";
import path from "path";
import { getSites } from "@/lib/sites";
import { getViews } from "@/lib/db";
import { withRef } from "@/lib/ref";
import MemberLink from "@/components/MemberLink";
import GalleryTrack from "@/components/sections/GalleryTrack";
import UpdateLogButton from "@/components/sections/UpdateLogButton";
import styles from "./MobilePage.module.css";

const MIN_TRACK_ITEMS = 10;

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

export default async function MobileFormBottomContent() {
  noStore();

  const members = getSites();
  const formattedCount = String(members.length).padStart(3, "0");

  let views = 0;
  try {
    views = await getViews();
  } catch {}
  const formattedViews = String(views).padStart(6, "0");

  const latestVersion = getLatestVersion();

  const screenshots = members
    .filter((m) => m.screenshot)
    .map((m) => ({ src: m.screenshot, name: m.name, slug: m.slug }));

  const trackItems =
    screenshots.length > 0
      ? Array.from(
          { length: Math.ceil(MIN_TRACK_ITEMS / screenshots.length) },
          () => screenshots
        ).flat()
      : [];
  const marqueeItems = [...trackItems, ...trackItems];

  return (
    <>
      {/* ── Members ───────────────────────────────────── */}
      <section id="members">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Active Guild Members</p>
          <Plus size={18} className={styles.sectionIcon} />
        </div>
        <div className={styles.block}>
          <p className={styles.bodyText}>
            The list of all the active guild members of this webring. Everyone here is an utterly
            crazy and interesting person making or building cool shit. P.S. The order of the ring
            is randomized.
          </p>
        </div>
        <div className={styles.block}>
          <ol className={styles.membersList}>
            {members.map((member) => (
              <li key={member.slug} className={styles.memberItem}>
                <span className={styles.memberName}>{member.name}</span>
                <MemberLink href={withRef(member.url)} className={styles.memberUrl}>
                  {member.url}
                </MemberLink>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Gallery ───────────────────────────────────── */}
      <section>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Gallery Of Sites</p>
          <Plus size={18} className={styles.sectionIcon} />
        </div>
        <div className={styles.galleryBody}>
          <div className={styles.galleryClip}>
            {marqueeItems.length > 0 ? (
              <GalleryTrack
                items={marqueeItems}
                trackClassName={styles.galleryTrack}
                itemClassName={styles.galleryItem}
              />
            ) : (
              <div className={styles.galleryEmpty} />
            )}
          </div>
        </div>
      </section>

      {/* ── Criteria ──────────────────────────────────── */}
      <section id="criteria">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Requirements To Join The Guild</p>
          <Plus size={18} className={styles.sectionIcon} />
        </div>
        <div className={styles.block}>
          <ul className={styles.criteriaList}>
            <li>Personal sites only. No company pages, landing pages, or portfolios dressed up as a resume.</li>
            <li>Something worth the click. Leave a visitor informed, intrigued, or just thinking &quot;huh, that&apos;s cool.&quot;</li>
            <li>Open to anyone making cool stuff. Builders, vibe coders, designers, artists, developers, hobbyists. No credentials required.</li>
            <li>No illegal, adult, or disturbing content. Goes without saying, but here we are.</li>
            <li>The Webring widget must be embedded visibly on your homepage. That&apos;s literally how the ring works.</li>
            <li>Keep your site live and updated. Inactive sites and unreachable members get removed from the ring.</li>
            <li>Every submission is manually reviewed. We may accept or reject, and we&apos;ll let you know either way.</li>
            <li>This is an attempt to bring cool people together. Not just discover sites — befriend the people making them. Be around builders — that&apos;s my current ongoing motto.</li>
          </ul>
        </div>
      </section>

      {/* ── About The Author ──────────────────────────── */}
      <section>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>About The Author</p>
          <Plus size={18} className={styles.sectionIcon} />
        </div>
        <div className={styles.block}>
          <p className={styles.bodyText}>
            Designed, developed and maintained by Imtiyaz Ahmed. Find me on{" "}
            <MemberLink href="https://www.imtiyazahmed.com/" className={styles.accentLink}>Portfolio</MemberLink>,{" "}
            <MemberLink href="https://x.com/imtiahmed01" className={styles.accentLink}>Twitter</MemberLink>,{" "}
            <MemberLink href="https://www.linkedin.com/in/iamimtiyazahmed/" className={styles.accentLink}>Linkedin</MemberLink>,{" "}
            <MemberLink href="http://github.com/imti-ahmed" className={styles.accentLink}>Github</MemberLink>.
          </p>
        </div>
      </section>

      {/* ── Footer Stats ──────────────────────────────── */}
      <div className={styles.statsRow}>
        <div className={styles.statsLeft}>
          <div className={styles.statGroup}>
            <Eye size={18} className={styles.statIcon} />
            <span className={styles.statLabel}>Views [{formattedViews}]</span>
          </div>
          <div className={styles.statGroup}>
            <UserFocus size={18} className={styles.statIcon} />
            <span className={styles.statLabel}>Members [{formattedCount}]</span>
          </div>
        </div>
        <Plus size={18} className={styles.sectionIcon} />
      </div>
      <UpdateLogButton versionLabel={`Update Logs @2026 [${latestVersion}]`} />
    </>
  );
}
