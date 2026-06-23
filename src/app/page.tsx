import { Suspense } from "react";
import AnimationSection from "@/components/sections/AnimationSection";
import AuthorSection from "@/components/sections/AuthorSection";
import GallerySection from "@/components/sections/GallerySection";
import GuildSection from "@/components/sections/GuildSection";
import CenterColumn from "@/components/CenterColumn";
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
                <Suspense fallback={null}>
                  <CenterColumn />
                </Suspense>
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
