"use client";

import styles from "./MobileHeader.module.css";

function GuildMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M7 7V10.5H3.5V7H7Z" />
      <path d="M3.5 7V10.5H0V7H3.5Z" />
      <path d="M5.25 3.5V7H1.75V3.5H5.25Z" />
      <path d="M8.75 0V3.5H5.25V0H8.75Z" />
      <path d="M12.25 3.5V7H8.75V3.5H12.25Z" />
      <path d="M8.75 10.5V14H5.25V10.5H8.75Z" />
      <path d="M10.5 7V10.5H7V7H10.5Z" />
      <path d="M14 7V10.5H10.5V7H14Z" />
    </svg>
  );
}

export const HOME_TABS = [
  { label: "About",      id: "about" },
  { label: "Criteria",   id: "criteria" },
  { label: "Join Guild", id: "join" },
  { label: "Members",    id: "members" },
] as const;

export const FORM_TABS = [
  { label: "Form",       id: "form" },
  { label: "Criteria",   id: "criteria" },
  { label: "Join Guild", id: "join" },
  { label: "Members",    id: "members" },
] as const;

type Tab = { label: string; id: string };

interface MobileHeaderProps {
  tabs?: Tab[];
}

export default function MobileHeader({ tabs = HOME_TABS as unknown as Tab[] }: MobileHeaderProps) {
  function handleTabClick(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoRow}>
        <span className={styles.siteName}>The Maker Guild Webring</span>
        <GuildMark size={14} />
      </div>
      <nav className={styles.tabRow} aria-label="Page sections">
        {tabs.map(({ label, id }) => (
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
