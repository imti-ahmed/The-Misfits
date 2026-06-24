"use client";

import { Plus } from "@phosphor-icons/react";
import styles from "./MobileHeader.module.css";

const TABS = [
  { label: "About",      id: "about" },
  { label: "Criteria",   id: "criteria" },
  { label: "Join Guild", id: "join" },
  { label: "Members",    id: "members" },
] as const;

export default function MobileHeader() {
  function handleTabClick(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoRow}>
        <span className={styles.siteName}>The Maker Guild Webring</span>
        <Plus size={14} className={styles.logoIcon} />
      </div>
      <nav className={styles.tabRow} aria-label="Page sections">
        {TABS.map(({ label, id }) => (
          <button
            key={id}
            className={styles.tab}
            onClick={() => handleTabClick(id)}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
