import AnimationSection from "@/components/sections/AnimationSection";
import AuthorSection from "@/components/sections/AuthorSection";
import GallerySection from "@/components/sections/GallerySection";
import GuildSection from "@/components/sections/GuildSection";
import CenterColumn from "@/components/CenterColumn";
import ScaleWrapper from "@/components/ScaleWrapper";
import MobilePage from "@/components/mobile/MobilePage";
import MobileRoot from "@/components/mobile/MobileRoot";
import MobileFormBottomContent from "@/components/mobile/MobileFormBottomContent";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <div className={styles.desktopOnly}>
        <ScaleWrapper>
          <main className={styles.page}>
            <div className={styles.content}>

              <div className={styles.leftColumn}>
                <GuildSection />
              </div>

              <div className={styles.rightSide}>
                <div className={styles.topRow}>

                  <div className={styles.centerColumn}>
                    <CenterColumn />
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
      </div>

      <div className={styles.mobileOnly}>
        <MobileRoot
          homePage={<MobilePage />}
          formBottomContent={<MobileFormBottomContent />}
        />
      </div>
    </>
  );
}
