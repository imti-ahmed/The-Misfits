"use client";

import { useState } from "react";
import styles from "./GallerySection.module.css";

interface Item {
  src: string;
  name: string;
  slug: string;
}

export default function GalleryTrack({ items }: { items: Item[] }) {
  const [reversed, setReversed] = useState(false);

  return (
    <div
      className={styles.track}
      style={{ animationDirection: reversed ? "reverse" : "normal" }}
      onMouseEnter={() => setReversed(r => !r)}
    >
      {items.map((item, i) => (
        <div key={i} className={styles.imageItem}>
          <img src={item.src} alt={item.name} />
        </div>
      ))}
    </div>
  );
}
