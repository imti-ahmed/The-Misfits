"use client";

import { useEffect, useRef, useState } from "react";

interface ResponsiveEmbedFrameProps {
  src: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
}

// Scales a fixed-size iframe down (never up) to fit its container's actual
// available width — the raw iframe box itself stays at `width`/`height` so
// its document renders normally; only the wrapper's layout footprint shrinks
// to match the visual scale, which is what keeps it from overflowing narrow
// mobile widths.
export default function ResponsiveEmbedFrame({ src, width, height, style }: ResponsiveEmbedFrameProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const recompute = () => setScale(Math.min(1, wrap.clientWidth / width));
    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={wrapRef} style={{ width: "100%", height: height * scale, ...style }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <iframe src={src} width={width} height={height} style={{ border: 0 }} />
      </div>
    </div>
  );
}
