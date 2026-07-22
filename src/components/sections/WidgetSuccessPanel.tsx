"use client";

import { useState, useCallback } from "react";
import { Copy } from "@phosphor-icons/react";
import HeaderTag from "@/components/HeaderTag";
import NavTag from "@/components/NavTag";
import WidgetV2Renderer from "@/widgets/v2/WidgetV2Renderer";
import Toast from "@/components/Toast";
import { sounds } from "@/lib/sounds";
import { SITE_ORIGIN } from "@/lib/site";
import { buildEmbedCode } from "@/lib/embedCode";
import styles from "./WidgetSuccessPanel.module.css";

interface WidgetSuccessPanelProps {
  widgetId: string;
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

export default function WidgetSuccessPanel({ widgetId, nickname, slug, bgColor, textColor }: WidgetSuccessPanelProps) {
  const embedCode = buildEmbedCode(SITE_ORIGIN, slug, widgetId);
  const [copied, setCopied] = useState(false);
  const closeToast = useCallback(() => setCopied(false), []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(embedCode);
      sounds.copy();
      setCopied(true);
    } catch {
      // clipboard blocked — silently ignore
    }
  }

  return (
    <div className={styles.panel}>
      {copied && <Toast message="Embed code copied!" type="success" onClose={closeToast} />}

      <HeaderTag label="select a widget" color="pink" />
      <div className={styles.previewBox}>
        <WidgetV2Renderer widgetId={widgetId} nickname={nickname} slug={slug} bgColor={bgColor} textColor={textColor} />
      </div>

      <div className={styles.textBox}>
        <p className={styles.text}>
          Your application has successfully submitted. We will review your site and get back to you through email in
          1-2 days max.
        </p>
      </div>

      <div className={styles.textBox}>
        <p className={styles.text}>Here is your script embed code. Make sure its added to the main page of the website.</p>
        <button type="button" className={styles.codeBox} onClick={handleCopy} aria-label="Copy embed code">
          <Copy size={20} className={styles.codeIcon} />
          <span className={styles.code}>{embedCode}</span>
        </button>
      </div>

      <button type="button" className={styles.navButton} onClick={() => { sounds.click(); handleCopy(); }} onMouseEnter={() => sounds.hover()}>
        <NavTag label="copy the url >>" />
      </button>
    </div>
  );
}
