import { Plus } from "@phosphor-icons/react/dist/ssr";
import { getSites } from "@/lib/sites";
import styles from "./GallerySection.module.css";

const MIN_TRACK_ITEMS = 10;

export default function GallerySection() {
  const screenshots = getSites()
    .filter(m => m.screenshot)
    .map(m => ({ src: m.screenshot, name: m.name, slug: m.slug }));

  const trackItems = screenshots.length > 0
    ? Array.from(
        { length: Math.ceil(MIN_TRACK_ITEMS / screenshots.length) },
        () => screenshots
      ).flat()
    : [];

  const marqueeItems = [...trackItems, ...trackItems];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Gallery Of Sites</p>
        <Plus size={20} className={styles.headerIcon} />
      </div>

      <div className={styles.imageSection}>
        <div className={styles.trackClip}>
          {marqueeItems.length > 0 ? (
            <div className={styles.track}>
              {marqueeItems.map((item, i) => (
                <div key={i} className={styles.imageItem}>
                  <img src={item.src} alt={item.name} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty} />
          )}
        </div>
      </div>
    </div>
  );
}
