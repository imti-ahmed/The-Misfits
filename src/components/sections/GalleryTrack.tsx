"use client";

import { useRef, useEffect } from "react";
import styles from "./GallerySection.module.css";

interface Item {
  src: string;
  name: string;
  slug: string;
}

const SPEED = 1.2; // px per frame at 60fps

export default function GalleryTrack({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef    = useRef(0);
  const dirRef    = useRef<1 | -1>(-1); // -1 = scroll left, +1 = scroll right
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let halfWidth = 0;
    let rafId: number;

    function tick() {
      // Lazily resolve halfWidth once images have painted
      if (halfWidth === 0) halfWidth = track!.scrollWidth / 2;

      if (!pausedRef.current && halfWidth > 0) {
        posRef.current += dirRef.current * SPEED;

        // Seamless wrap in both directions
        if (posRef.current <= -halfWidth) posRef.current += halfWidth;
        if (posRef.current >=  0)         posRef.current -= halfWidth;

        track!.style.transform = `translateX(${posRef.current}px)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={trackRef}
      className={styles.track}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => {
        dirRef.current = dirRef.current === -1 ? 1 : -1;
        pausedRef.current = false;
      }}
    >
      {items.map((item, i) => (
        <div key={i} className={styles.imageItem}>
          <img src={item.src} alt={item.name} />
        </div>
      ))}
    </div>
  );
}
