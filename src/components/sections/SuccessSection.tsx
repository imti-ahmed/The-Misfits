"use client";

import { Copy, ArrowUpRight } from "@phosphor-icons/react";
import { useState, useCallback } from "react";
import styles from "./SuccessSection.module.css";
import Toast from "@/components/Toast";

interface SuccessSectionProps {
  slug: string;
  prUrl?: string;
  onGoBack?: () => void;
}

export default function SuccessSection({ slug, prUrl, onGoBack }: SuccessSectionProps) {
  const embedCode = `<iframe src="https://the-makers-guild.vercel.app/embed/${slug}" width="300" height="103" style="border:none;"></iframe>`;
  const [copied, setCopied] = useState(false);
  const closeCopied = useCallback(() => setCopied(false), []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
    } catch {
      // clipboard blocked — silently ignore
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.confirmation}>
        <p className={styles.bodyText}>
          Your application has successfully submitted. We will review your site and get back to you
          through email in 1-2 days max.
        </p>
      </div>

      <div className={styles.embedRow}>
        <p className={styles.bodyText}>
          Here is your iframe embed code. Make sure its added to the main page of the website.
        </p>
        <div className={styles.embedField}>
          <button type="button" className={styles.copyBtn} onClick={handleCopy} aria-label="Copy embed code">
            <Copy size={20} weight="regular" />
          </button>
          <span className={styles.embedCode}>{embedCode}</span>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button type="button" className={styles.btn} onClick={onGoBack}>
          Go Back To Mainpage
        </button>
        <div className={styles.actionsRight}>
          <a
            href={prUrl ?? "https://github.com/imti-ahmed/The-Makers-Guild"}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWithIcon}
          >
            {prUrl ? "Review Your Submission" : "Check Github Page"}
            <ArrowUpRight size={20} weight="regular" />
          </a>
          <a
            href="mailto:designer.imtiyaz@gmail.com"
            className={styles.btnWithIcon}
          >
            Contact Guild Leader
            <ArrowUpRight size={20} weight="regular" />
          </a>
        </div>
      </div>
      {copied && <Toast message="Embed code copied to clipboard!" type="success" onClose={closeCopied} />}
    </div>
  );
}
