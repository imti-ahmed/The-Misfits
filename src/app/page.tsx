import AboutSection from "@/components/sections/AboutSection";
import AnimationSection from "@/components/sections/AnimationSection";
import AuthorSection from "@/components/sections/AuthorSection";
import GallerySection from "@/components/sections/GallerySection";
import GuildSection from "@/components/sections/GuildSection";
import JoinSection from "@/components/sections/JoinSection";
import RequirementSection from "@/components/sections/RequirementSection";
import ScaleWrapper from "@/components/ScaleWrapper";
import styles from "./page.module.css";

export default function Home() {
  return (
    <ScaleWrapper>
    <main className={styles.page}>
      <div className={styles.content}>

        <div className={styles.leftColumn}>
          <GuildSection />
        </div>

        <div className={styles.rightSide}>
          <div className={styles.topRow}>

            <div className={styles.centerColumn}>
              <AboutSection />
              <RequirementSection />
              <JoinSection />
            </div>

            <div className={styles.rightColumn}>
              <AnimationSection />
              <AuthorSection />
            </div>

          </div>

          <div className={styles.bottomRow}>
            <GallerySection />
          </div>
        </div>

      </div>
    </main>
    </ScaleWrapper>
  );
}
