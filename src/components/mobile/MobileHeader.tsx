"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import LogoBox from "@/components/LogoBox";
import HeaderTag from "@/components/HeaderTag";
import StackedTag from "@/components/StackedTag";
import { sounds } from "@/lib/sounds";
import { useMobileJoin } from "./MobileJoinContext";
import styles from "./MobileHeader.module.css";

interface MobileHeaderProps {
  memberCount: string;
}

export default function MobileHeader({ memberCount }: MobileHeaderProps) {
  const onJoin = useMobileJoin();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const joinRef = useRef<HTMLButtonElement>(null);
  const [showJoin, setShowJoin] = useState(true);

  // The join tag is the lowest-priority header item — it's dropped first on
  // narrow widths rather than letting the header wrap to a second line.
  // Kept mounted (moved out of flow via position:absolute instead of
  // unmounted) so its natural width stays measurable and it can reappear
  // once the viewport grows enough to fit all four items in one row again.
  // The remaining items are direct flex children of the header (not grouped
  // in a wrapper) so justify-content:space-between spreads whichever 2-4 of
  // them are visible evenly across the row, instead of clumping them left.
  useLayoutEffect(() => {
    const header = headerRef.current;
    const logo = logoRef.current;
    const gallery = galleryRef.current;
    const active = activeRef.current;
    const join = joinRef.current;
    if (!header || !logo || !gallery || !active || !join) return;

    function recompute() {
      const gap = parseFloat(getComputedStyle(header!).columnGap || "0");
      const available = header!.clientWidth;
      const coreNeeded = logo!.scrollWidth + gallery!.scrollWidth + active!.scrollWidth + gap * 2;
      const neededWithJoin = coreNeeded + gap + join!.scrollWidth;
      setShowJoin(neededWithJoin <= available);
    }

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(header);
    return () => observer.disconnect();
  }, [memberCount]);

  return (
    <header ref={headerRef} className={styles.header}>
      <div ref={logoRef} className={styles.item}>
        <LogoBox />
      </div>

      <div ref={galleryRef} className={styles.item}>
        <Link
          href="/gallery"
          className={styles.headerLink}
          onMouseEnter={() => sounds.swoosh()}
          onClick={() => sounds.click()}
        >
          <HeaderTag label="gallery >" color="yellow" />
        </Link>
      </div>

      <div ref={activeRef} className={styles.item}>
        <StackedTag topLabel="active" bottomLabel={`members:${memberCount}`} color="purple" align="end" />
      </div>

      <button
        ref={joinRef}
        type="button"
        className={`${styles.item} ${styles.headerLinkBtn}`}
        style={showJoin ? undefined : { visibility: "hidden", position: "absolute", pointerEvents: "none" }}
        onMouseEnter={() => sounds.swoosh()}
        onClick={() => { sounds.click(); onJoin?.(); }}
      >
        <StackedTag topLabel="click to" bottomLabel="join >>>" color="yellow" align="start" />
      </button>
    </header>
  );
}
