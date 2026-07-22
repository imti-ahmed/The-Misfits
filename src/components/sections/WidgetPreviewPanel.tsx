"use client";

import { useEffect, useRef, useState } from "react";
import WidgetV2Renderer from "@/widgets/v2/WidgetV2Renderer";
import { widgetV2Registry } from "@/widgets/v2/registry";
import NavTag from "@/components/NavTag";
import { sounds } from "@/lib/sounds";
import styles from "./WidgetPreviewPanel.module.css";

const WIDGET_IDS = widgetV2Registry.map((w) => w.id);
const OUT_DURATION_MS = 150;
const IN_DURATION_MS = 350;

interface WidgetPreviewPanelProps {
  onSelect?: (widgetId: string) => void;
  nickname?: string;
  bgColor?: string;
  textColor?: string;
}

export default function WidgetPreviewPanel({ onSelect, nickname = "USER", bgColor, textColor }: WidgetPreviewPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [fitScale, setFitScale] = useState(1);
  const pendingIndexRef = useRef<number | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Shrink the widget to fit the box whenever it (or the box) is wider than
  // the available space — e.g. widget-001 is 752px wide and can overflow the
  // preview box in cramped viewport ranges. Independent of the bounce
  // animation's own transform (applied on a nested inner element) so the two
  // don't fight over the same transform property.
  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const recompute = () => {
      const naturalWidth = measure.scrollWidth;
      if (naturalWidth <= 0) return;
      const cs = getComputedStyle(container);
      const paddingH = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const availableWidth = container.clientWidth - paddingH;
      setFitScale(Math.min(1, availableWidth / naturalWidth));
    };

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(container);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [selectedIndex]);

  function transitionTo(nextIndex: number) {
    pendingIndexRef.current = nextIndex;
    setPhase("out");

    const outTimeout = setTimeout(() => {
      setSelectedIndex(pendingIndexRef.current!);
      setPhase("in");

      const inTimeout = setTimeout(() => setPhase("idle"), IN_DURATION_MS);
      timeoutsRef.current.push(inTimeout);
    }, OUT_DURATION_MS);

    timeoutsRef.current.push(outTimeout);
  }

  function goToPrev() {
    sounds.swoosh();
    const prev = (selectedIndex - 1 + WIDGET_IDS.length) % WIDGET_IDS.length;
    onSelect?.(WIDGET_IDS[prev]);
    transitionTo(prev);
  }

  function goToNext() {
    sounds.swoosh();
    const next = (selectedIndex + 1) % WIDGET_IDS.length;
    onSelect?.(WIDGET_IDS[next]);
    transitionTo(next);
  }

  const animClass = phase === "out" ? styles.scaleOut : phase === "in" ? styles.scaleInBounce : "";

  return (
    <div className={styles.panel}>
      <div ref={containerRef} className={styles.previewBox}>
        <div style={{ transform: `scale(${fitScale})`, transformOrigin: "center" }}>
          <div ref={measureRef} className={animClass}>
            <WidgetV2Renderer
              widgetId={WIDGET_IDS[selectedIndex]}
              nickname={nickname}
              slug="preview"
              bgColor={bgColor}
              textColor={textColor}
            />
          </div>
        </div>
      </div>

      <div className={styles.navRow}>
        <button className={styles.navButton} onClick={goToPrev} aria-label="Previous widget">
          <NavTag label="prev >>" />
        </button>
        <button className={styles.navButton} onClick={goToNext} aria-label="Next widget">
          <NavTag label="next >>" />
        </button>
      </div>
    </div>
  );
}
