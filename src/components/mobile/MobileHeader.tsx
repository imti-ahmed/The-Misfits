"use client";

import Link from "next/link";
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

  return (
    <header className={styles.header}>
      <LogoBox />

      <Link
        href="/gallery"
        className={styles.headerLink}
        onMouseEnter={() => sounds.swoosh()}
        onClick={() => sounds.click()}
      >
        <HeaderTag label="gallery >" color="yellow" />
      </Link>

      <StackedTag topLabel="active" bottomLabel={`members:${memberCount}`} color="purple" align="end" />

      <button
        type="button"
        className={styles.headerLinkBtn}
        onMouseEnter={() => sounds.swoosh()}
        onClick={() => { sounds.click(); onJoin?.(); }}
      >
        <StackedTag topLabel="click to" bottomLabel="join >>>" color="yellow" align="start" />
      </button>
    </header>
  );
}
