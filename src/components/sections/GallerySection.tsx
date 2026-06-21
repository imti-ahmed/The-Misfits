import { Plus } from "@phosphor-icons/react/dist/ssr";
import styles from "./GallerySection.module.css";

const GALLERY_IMAGES = [
  "https://www.figma.com/api/mcp/asset/7476de8e-cd07-4787-b063-11ec5b64dc6a",
  "https://www.figma.com/api/mcp/asset/a66e1d47-a8a7-458d-9a63-ce65f3ebfdf0",
  "https://www.figma.com/api/mcp/asset/71d4d789-d454-48e0-ba78-ced7c295b48b",
  "https://www.figma.com/api/mcp/asset/1f7f4efb-9723-4b1c-988c-02c1ab371275",
  "https://www.figma.com/api/mcp/asset/da1513bb-fd28-4160-881b-cfa23e4a0245",
  "https://www.figma.com/api/mcp/asset/2132e273-aa02-4ad9-82c3-2ee1328698cb",
  "https://www.figma.com/api/mcp/asset/03f73549-053c-4577-8527-50cf8340a3c6",
  "https://www.figma.com/api/mcp/asset/769ca65c-5e49-44f9-9fe3-98b062431fc4",
  "https://www.figma.com/api/mcp/asset/fb883f22-ca0d-42f3-91ae-0828faee8a0b",
  "https://www.figma.com/api/mcp/asset/63d143d4-b50c-4e07-9a1a-70a890f79bdb",
  "https://www.figma.com/api/mcp/asset/b020f51a-aa32-4973-a55c-d3c295ccf7d6",
  "https://www.figma.com/api/mcp/asset/41f351ce-9de6-4366-9f53-7f05de173cf4",
  "https://www.figma.com/api/mcp/asset/8e350ccd-9780-4d72-ab96-5b988bf9409a",
  "https://www.figma.com/api/mcp/asset/f2952ecd-f122-4f8a-a717-80de5f7ce63d",
  "https://www.figma.com/api/mcp/asset/a06f2157-cb52-4f4f-b52c-eb62efb5f0ba",
];

export default function GallerySection() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Gallery Of Sites</p>
        <Plus size={20} className={styles.headerIcon} />
      </div>

      <div className={styles.imageSection}>
        <div className={styles.trackClip}>
        {/* Track is duplicated so the marquee loops seamlessly at -50% */}
        <div className={styles.track}>
          {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((src, i) => (
            <div key={i} className={styles.imageItem}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
