import Link from "next/link";
import SiteHeader from "@/components/sections/SiteHeader";
import TaggedSection from "@/components/TaggedSection";
import GalleryCard from "@/components/GalleryCard";
import MobileGalleryPage from "@/components/mobile/MobileGalleryPage";
import { getSites } from "@/lib/sites";
import { getRecentMemberActivityMessages } from "@/lib/version";
import layout from "@/styles/screenLayout.module.css";
import styles from "./gallery.module.css";

export default async function GalleryPage() {
  const members = getSites();
  const recentActivity = await getRecentMemberActivityMessages();
  const memberCount = String(members.length).padStart(3, "0");
  const withScreenshots = members.filter((m) => m.screenshot);

  return (
    <>
      <div className={layout.desktopOnly}>
        <main className={layout.page}>
          <div className={layout.bgTexture} aria-hidden />

          <SiteHeader memberCount={memberCount} recentActivity={recentActivity} />

          <div className={styles.grid}>
            <TaggedSection
              headerLabel="gallery of sites"
              color="yellow"
              content={[
                <p key="info">
                  Every website here is part of our growing webring. Want to head back? <Link href="/">Click Here</Link>
                </p>,
              ]}
            />

            {withScreenshots.map((member) => (
              <GalleryCard
                key={member.slug}
                name={member.name || member.nickname}
                imageSrc={member.screenshot}
                href={member.url}
              />
            ))}
          </div>
        </main>
      </div>

      <div className={layout.mobileOnly}>
        <MobileGalleryPage />
      </div>
    </>
  );
}
