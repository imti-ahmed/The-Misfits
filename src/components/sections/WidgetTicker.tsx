"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";
import WidgetRenderer from "@/widgets/WidgetRenderer";
import styles from "./WidgetTicker.module.css";

const WIDGET_IDS = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011"];

interface WidgetTickerProps {
  onSelect?: (index: number) => void;
  nickname?: string;
}

export default function WidgetTicker({ onSelect, nickname = "USER" }: WidgetTickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState<"prev" | "next">("next");
  const [animKey, setAnimKey] = useState(0);

  function goToPrev() {
    const prev = (selectedIndex - 1 + WIDGET_IDS.length) % WIDGET_IDS.length;
    setDirection("prev");
    setSelectedIndex(prev);
    setAnimKey((k) => k + 1);
    onSelect?.(prev);
  }

  function goToNext() {
    const next = (selectedIndex + 1) % WIDGET_IDS.length;
    setDirection("next");
    setSelectedIndex(next);
    setAnimKey((k) => k + 1);
    onSelect?.(next);
  }

  const slideClass = animKey > 0
    ? (direction === "next" ? styles.slideFromRight : styles.slideFromLeft)
    : "";

  return (
    <div className={styles.container}>
      <button className={styles.caretLeft} onClick={goToPrev} aria-label="Previous widget">
        <CaretLeft size={20} />
        <span className={styles.caretLabel}>BACK</span>
      </button>

      <div className={styles.widgetDisplay}>
        <div className={WIDGET_IDS[selectedIndex] !== "006" ? styles.widgetScaled : undefined}>
          <div key={animKey} className={slideClass}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div onClick={(e) => e.preventDefault()}>
              <WidgetRenderer
                widgetId={WIDGET_IDS[selectedIndex]}
                nickname={nickname}
                slug="preview"
              />
            </div>
          </div>
        </div>
      </div>

      <button className={styles.caretRight} onClick={goToNext} aria-label="Next widget">
        <span className={styles.caretLabel}>NEXT</span>
        <CaretRight size={20} />
      </button>
    </div>
  );
}
