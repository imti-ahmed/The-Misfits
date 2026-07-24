"use client";

import { Copy } from "@phosphor-icons/react";
import { useState, useCallback } from "react";
import WidgetV2Renderer from "@/widgets/v2/WidgetV2Renderer";
import { WIDGET_V2_SIZES as WIDGET_SIZES, DEFAULT_WIDGET_V2_SIZE as DEFAULT_WIDGET_SIZE } from "@/lib/widgetV2Sizes";
import Toast from "@/components/Toast";
import TaggedSection from "@/components/TaggedSection";
import HeaderTag from "@/components/HeaderTag";
import NavTag from "@/components/NavTag";
import { sounds } from "@/lib/sounds";
import { SITE_ORIGIN } from "@/lib/site";
import { buildEmbedCode } from "@/lib/embedCode";
import { resolveEmbedIframeSize } from "@/lib/widgetV2Sizes";
import MobileHeader from "./MobileHeader";
import MobileInfoSections from "./MobileInfoSections";
import styles from "./MobileFormPage.module.css";
import successStyles from "./MobileSuccessPage.module.css";

function getPreviewScale(widgetId: string): number {
  const { width } = WIDGET_SIZES[widgetId] ?? DEFAULT_WIDGET_SIZE;
  return Math.max(0.4, Math.min(1.4, 260 / width));
}

interface SiteInfo {
  views: number;
  memberCount: number;
  latestVersion: string;
  daysOnline: number;
  lastUpdate: string;
}

interface MobileSuccessPageProps {
  widgetId: string;
  nickname: string;
  slug: string;
  prUrl?: string;
  siteInfo: SiteInfo;
  onGoBack: () => void;
  embedWidth?: number;
  embedHeight?: number;
}

export default function MobileSuccessPage({
  widgetId,
  nickname,
  slug,
  prUrl,
  siteInfo,
  onGoBack,
  embedWidth,
  embedHeight,
}: MobileSuccessPageProps) {
  const { width, height } = resolveEmbedIframeSize(widgetId, embedWidth, embedHeight);
  const embedCode = buildEmbedCode(SITE_ORIGIN, slug, width, height);
  const previewScale = getPreviewScale(widgetId);

  const [copied, setCopied] = useState(false);
  const closeToast = useCallback(() => setCopied(false), []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(embedCode);
      sounds.copy();
      setCopied(true);
    } catch {}
  }

  return (
    <div className={styles.page}>
      {copied && (
        <Toast message="Embed code copied!" type="success" onClose={closeToast} />
      )}

      <MobileHeader memberCount={String(siteInfo.memberCount).padStart(3, "0")} />

      <main className={styles.content}>

        <TaggedSection
          headerLabel="join the webring"
          color="yellow"
          fullWidth
          content={[
            <p key="welcome">
              Welcome Cool Misfit.
              <br />
              <br />
              Pick a widget, submit your site, and we&apos;ll handle the rest. Cheers!
            </p>,
          ]}
        />

        {/* ── Form submitted ───────────────────────────── */}
        <div className={styles.group}>
          <HeaderTag label="form submitted" color="pink" fullWidth />

          <div className={styles.ticker}>
            <div style={{ transform: `scale(${previewScale})`, transformOrigin: "center center", flexShrink: 0 }}>
              <WidgetV2Renderer widgetId={widgetId} nickname={nickname} slug={slug} />
            </div>
          </div>

          <div className={successStyles.textBox}>
            <p className={successStyles.text}>
              Your application has successfully submitted. We will review your site and get back
              to you through email in 1-2 days max.
            </p>
          </div>

          <div className={successStyles.textBox}>
            <p className={successStyles.text}>
              Here is your script embed code. Make sure its added to the main page of the website.
            </p>
            <button type="button" className={successStyles.codeBox} onClick={handleCopy} aria-label="Copy embed code">
              <Copy size={20} className={successStyles.codeIcon} />
              <span className={successStyles.code}>{embedCode}</span>
            </button>
          </div>

          <div className={styles.navRow}>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => { sounds.click(); handleCopy(); }}
              onMouseEnter={() => sounds.swoosh()}
            >
              <NavTag label="copy the url >>" />
            </button>
            {prUrl && (
              <a
                href={prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navButton}
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.swoosh()}
              >
                <NavTag label="review submission >>" />
              </a>
            )}
          </div>
        </div>

        <MobileInfoSections {...siteInfo} onGoBack={onGoBack} />

      </main>
    </div>
  );
}
