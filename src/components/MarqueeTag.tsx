"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './MarqueeTag.module.css';

type MarqueeTagColor = 'yellow' | 'purple' | 'green' | 'blue' | 'pink';

interface MarqueeTagProps {
  messages: string[];
  color?: MarqueeTagColor;
}

const SPEED = 0.5; // px per frame at 60fps — slow
const MIN_COPIES = 2;

export default function MarqueeTag({ messages, color = 'green' }: MarqueeTagProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const [copies, setCopies] = useState(MIN_COPIES);

  const text = `${messages.join(' • ')} •`;

  // Keep enough duplicated copies to always cover at least 2x the visible width,
  // so the seamless-wrap loop never runs out of content and shows a gap — recomputed
  // whenever the container is resized (the header slot is itself responsive).
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const recompute = () => {
      const singleWidth = track.scrollWidth / copies;
      if (singleWidth <= 0) return;
      const needed = Math.max(MIN_COPIES, Math.ceil((container.clientWidth * 2) / singleWidth));
      if (needed !== copies) setCopies(needed);
    };

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(container);
    return () => observer.disconnect();
  }, [copies, text]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let unitWidth = 0;
    let rafId: number;

    function tick() {
      if (unitWidth === 0) unitWidth = track!.scrollWidth / copies;

      if (unitWidth > 0) {
        posRef.current -= SPEED;
        if (posRef.current <= -unitWidth) posRef.current += unitWidth;
        track!.style.transform = `translateX(${posRef.current}px)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [copies]);

  return (
    <div ref={containerRef} className={`${styles.marqueeTag} ${styles[color]}`}>
      <div ref={trackRef} className={styles.track}>
        {Array.from({ length: copies }).map((_, i) => (
          <p key={i} className={styles.label}>{text}</p>
        ))}
      </div>
    </div>
  );
}
