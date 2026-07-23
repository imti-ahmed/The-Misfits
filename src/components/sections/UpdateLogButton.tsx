"use client";

import { useState, useEffect, useRef } from "react";
import { GitFork, Plus, X } from "@phosphor-icons/react";
import { sounds } from "@/lib/sounds";
import styles from "./UpdateLogButton.module.css";

interface Commit {
  version: string | null;
  title: string;
  date: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UpdateLogButton({ versionLabel }: { versionLabel: string }) {
  const [open, setOpen] = useState(false);
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || commits) return;
    fetch("/api/commits")
      .then((r) => r.json())
      .then(setCommits)
      .catch(() => setCommits([]));
  }, [open, commits]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function toggle() {
    sounds.click();
    setOpen((v) => !v);
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Popup */}
      <div className={`${styles.popup} ${open ? styles.visible : ""}`}>
        <div className={styles.popupHeader}>
          <span className={styles.popupTitle}>Recent Updates</span>
          <button
            className={styles.closeBtn}
            onClick={toggle}
            aria-label="Close update log"
            onMouseEnter={() => sounds.swoosh()}
          >
            <X size={16} />
          </button>
        </div>

        {!commits ? (
          <p className={styles.loading}>Loading...</p>
        ) : commits.length === 0 ? (
          <p className={styles.loading}>Could not load commits.</p>
        ) : (
          <ul className={styles.commitList}>
            {commits.map((c, i) => (
              <li key={i} className={styles.commitItem}>
                <span className={styles.bullet}>•</span>
                <span className={styles.commitMeta}>
                  {c.version ?? "—"} ({formatDate(c.date)})
                </span>
                <span className={styles.commitTitle}>{c.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Trigger button */}
      <button className={styles.button} onClick={toggle} onMouseEnter={() => sounds.swoosh()}>
        <GitFork size={20} className={styles.buttonIcon} />
        <p className={styles.buttonText}>{versionLabel}</p>
      </button>
    </div>
  );
}
