"use client";

import { Copy, ArrowUpRight } from "@phosphor-icons/react";
import { useState, useCallback } from "react";
import styles from "./SuccessSection.module.css";
import Toast from "@/components/Toast";
import { sounds } from "@/lib/sounds";
import { WIDGET_SIZES, DEFAULT_WIDGET_SIZE } from "@/lib/widgetSizes";

interface SuccessSectionProps {
  slug: string;
  widgetId?: string;
  prUrl?: string;
  onGoBack?: () => void;
}

export default function SuccessSection({ slug, widgetId, prUrl, onGoBack }: SuccessSectionProps) {
  const { width, height, defaultScale } = (widgetId ? WIDGET_SIZES[widgetId] : null) ?? DEFAULT_WIDGET_SIZE;
  const embedCode = `<iframe src="https://the-makers-guild.vercel.app/embed/${slug}" width="${Math.round(width * defaultScale)}" height="${Math.round(height * defaultScale)}" style="border:none;"></iframe>`;
  const resizeScript = `<script>window.addEventListener('message',function(e){if(!e.data||e.data.type!=='tmg-resize')return;var f=document.querySelectorAll('iframe');for(var i=0;i<f.length;i++){if(f[i].contentWindow===e.source){f[i].width=e.data.width;f[i].height=e.data.height;break;}}});<\/script>`;
  const [copied, setCopied] = useState<"iframe" | "script" | null>(null);
  const closeCopied = useCallback(() => setCopied(null), []);

  async function handleCopy(text: string, type: "iframe" | "script") {
    try {
      await navigator.clipboard.writeText(text);
      sounds.copy();
      setCopied(type);
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
          <button type="button" className={styles.copyBtn} onClick={() => handleCopy(embedCode, "iframe")} aria-label="Copy embed code">
            <Copy size={20} weight="regular" />
          </button>
          <span className={styles.embedCode}>{embedCode}</span>
        </div>
        <p className={styles.bodyText}>
          Optional: add this script so the iframe auto-resizes when you tweak the scale.
        </p>
        <div className={styles.embedField}>
          <button type="button" className={styles.copyBtn} onClick={() => handleCopy(resizeScript, "script")} aria-label="Copy resize script">
            <Copy size={20} weight="regular" />
          </button>
          <span className={styles.embedCode}>{resizeScript}</span>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button type="button" className={styles.btn} onClick={() => { sounds.click(); onGoBack?.(); }} onMouseEnter={() => sounds.hover()}>
          Go Back To Mainpage
        </button>
        <div className={styles.actionsRight}>
          <a
            href={prUrl ?? "https://github.com/imti-ahmed/The-Makers-Guild"}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWithIcon}
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
          >
            {prUrl ? "Review Your Submission" : "Check Github Page"}
            <ArrowUpRight size={20} weight="regular" />
          </a>
          <a
            href="mailto:designer.imtiyaz@gmail.com"
            className={styles.btnWithIcon}
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
          >
            Contact Guild Leader
            <ArrowUpRight size={20} weight="regular" />
          </a>
        </div>
      </div>
      {copied && <Toast message={copied === "script" ? "Resize script copied!" : "Embed code copied to clipboard!"} type="success" onClose={closeCopied} />}
    </div>
  );
}
