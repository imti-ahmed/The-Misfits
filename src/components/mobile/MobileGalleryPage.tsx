import Link from "next/link";
import { getSites } from "@/lib/sites";
import TaggedSection from "@/components/TaggedSection";
import GalleryCard from "@/components/GalleryCard";
import MobileHeader from "./MobileHeader";
import styles from "./MobilePage.module.css";

export default function MobileGalleryPage() {
  const members = getSites();
  const memberCount = String(members.length).padStart(3, "0");
  const withScreenshots = members.filter((m) => m.screenshot);

  return (
    <div className={styles.page}>
      <MobileHeader memberCount={memberCount} />

      <main className={styles.content}>
        <TaggedSection
          headerLabel="gallery of sites"
          color="yellow"
          fullWidth
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
      </main>
    </div>
  );
}
