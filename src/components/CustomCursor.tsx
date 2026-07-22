"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./CustomCursor.module.css";

const ACCENTS = [
  "#356aff", // blue
  "#ffc62b", // yellow
  "#944bc4", // purple
  "#65d35f", // green
  "#c44b86", // pink
];

function hexToRgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

const ACCENT_RGB = ACCENTS.map(hexToRgb);
const ALT_OFFSET = 2; // how far around the palette to jump when avoiding a color clash

interface TrailDot {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
}

let uid = 0;

export default function CustomCursor() {
  const pathname = usePathname();
  const isWidgetRoute = pathname?.startsWith("/widget") || pathname?.startsWith("/embed");

  const [enabled, setEnabled] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  const cursorRef = useRef<HTMLDivElement>(null);
  const colorIndexRef = useRef(0);
  const swappedRef = useRef(false);
  const lastTrailRef = useRef(0);

  useEffect(() => { colorIndexRef.current = colorIndex; }, [colorIndex]);
  useEffect(() => { swappedRef.current = swapped; }, [swapped]);

  useEffect(() => {
    if (isWidgetRoute) return;
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    setEnabled(true);
    document.body.classList.add("customCursorActive");

    const currentColor = () =>
      swappedRef.current
        ? ACCENTS[(colorIndexRef.current + ALT_OFFSET) % ACCENTS.length]
        : ACCENTS[colorIndexRef.current];
    const currentRgb = () =>
      swappedRef.current
        ? ACCENT_RGB[(colorIndexRef.current + ALT_OFFSET) % ACCENT_RGB.length]
        : ACCENT_RGB[colorIndexRef.current];

    function onMove(e: PointerEvent) {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 6}px, ${e.clientY - 6}px, 0)`;
      }

      const now = performance.now();
      if (now - lastTrailRef.current > 45) {
        lastTrailRef.current = now;
        const id = uid++;
        const dot = { id, x: e.clientX - 6, y: e.clientY - 6, color: currentColor() };
        setTrail(t => [...t.slice(-7), dot]);
        setTimeout(() => setTrail(t => t.filter(d => d.id !== id)), 350);
      }

      const rgb = currentRgb();
      let el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      let matched = false;
      let depth = 0;
      while (el && depth < 6) {
        if (getComputedStyle(el).backgroundColor === rgb) { matched = true; break; }
        el = el.parentElement;
        depth++;
      }
      if (matched !== swappedRef.current) setSwapped(matched);
    }

    function onDown(e: PointerEvent) {
      setColorIndex(i => (i + 1) % ACCENTS.length);

      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]');
      if (!clickable) return;

      const rect = clickable.getBoundingClientRect();
      const cx = Math.min(Math.max(e.clientX, rect.left), rect.right);
      const cy = Math.min(Math.max(e.clientY, rect.top), rect.bottom);
      const color = currentColor();

      const COUNT = 12;
      const burst: Particle[] = Array.from({ length: COUNT }, (_, i) => {
        const angle = (Math.PI * 2 * i) / COUNT + (Math.random() - 0.5) * 0.4;
        const dist = 28 + Math.random() * 30;
        const size = 7 + Math.random() * 7;
        return {
          id: uid++,
          x: cx - size / 2,
          y: cy - size / 2,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size,
          color,
        };
      });
      setParticles(p => [...p, ...burst]);
      const ids = burst.map(b => b.id);
      setTimeout(() => setParticles(p => p.filter(b => !ids.includes(b.id))), 340);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.body.classList.remove("customCursorActive");
    };
  }, [isWidgetRoute]);

  if (!enabled) return null;

  const displayColor = swapped
    ? ACCENTS[(colorIndex + ALT_OFFSET) % ACCENTS.length]
    : ACCENTS[colorIndex];

  return (
    <>
      {trail.map(d => (
        <div
          key={d.id}
          className={styles.trailDot}
          style={{ backgroundColor: d.color, "--x": `${d.x}px`, "--y": `${d.y}px` } as React.CSSProperties}
        />
      ))}
      {particles.map(p => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            backgroundColor: p.color,
            "--size": `${p.size}px`,
            "--x": `${p.x}px`,
            "--y": `${p.y}px`,
            "--dx": `${p.x + p.dx}px`,
            "--dy": `${p.y + p.dy}px`,
          } as React.CSSProperties}
        />
      ))}
      <div ref={cursorRef} className={styles.cursor} style={{ backgroundColor: displayColor }} />
    </>
  );
}
