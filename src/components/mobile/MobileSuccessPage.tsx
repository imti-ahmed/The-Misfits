"use client";

import { Plus, ArrowUpRight, Copy } from "@phosphor-icons/react";
import { useState, useCallback } from "react";
import WidgetV2Renderer from "@/widgets/v2/WidgetV2Renderer";
import { WIDGET_V2_SIZES as WIDGET_SIZES, DEFAULT_WIDGET_V2_SIZE as DEFAULT_WIDGET_SIZE } from "@/lib/widgetV2Sizes";
import DotGridBackground from "@/components/DotGridBackground";
import Toast from "@/components/Toast";
import { sounds } from "@/lib/sounds";
import { SITE_ORIGIN } from "@/lib/site";
import { buildEmbedCode } from "@/lib/embedCode";
import MobileHeader, { FORM_TABS } from "./MobileHeader";
import pageStyles from "./MobilePage.module.css";
import styles from "./MobileSuccessPage.module.css";

function getPreviewScale(widgetId: string): number {
  const { width } = WIDGET_SIZES[widgetId] ?? DEFAULT_WIDGET_SIZE;
  return Math.max(0.4, Math.min(1.4, 260 / width));
}

interface MobileSuccessPageProps {
  widgetId: string;
  nickname: string;
  slug: string;
  prUrl?: string;
  bottomContent: React.ReactNode;
  onGoBack: () => void;
}

export default function MobileSuccessPage({
  widgetId,
  nickname,
  slug,
  prUrl,
  bottomContent,
  onGoBack,
}: MobileSuccessPageProps) {
  const embedCode = buildEmbedCode(SITE_ORIGIN, slug, widgetId);
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
    <div className={pageStyles.page}>
      {copied && (
        <Toast message="Embed code copied!" type="success" onClose={closeToast} />
      )}

      <MobileHeader tabs={FORM_TABS as unknown as { label: string; id: string }[]} />

      <main className={pageStyles.content}>
        <section id="form">

          {/* Section header */}
          <div className={pageStyles.sectionHeader}>
            <p className={pageStyles.sectionTitle}>Join The Guild</p>
            <Plus size={18} className={pageStyles.sectionIcon} />
          </div>

          {/* Intro text */}
          <div className={pageStyles.block}>
            <p className={pageStyles.bodyText}>
              Welcome Cool Strange. To join the guild, please fill the form below and choose the
              kind of webring widget you want to embed in your website. Want different colors?
              Please specify the hex codes in the form below and submit — and we handle the rest.
              You will get an embed code, add that to your site and once we approve, you will
              part of the webring.
            </p>
          </div>

          {/* Widget preview */}
          <div className={styles.preview}>
            <div
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: "center center",
                flexShrink: 0,
              }}
              onClick={(e) => e.preventDefault()}
            >
              <WidgetV2Renderer widgetId={widgetId} nickname={nickname} slug={slug} />
            </div>
          </div>

          {/* Success confirmation */}
          <div className={pageStyles.block}>
            <p className={pageStyles.bodyText}>
              Your application has successfully submitted. We will review your site and get back
              to you through email in 1-2 days max.
            </p>
          </div>

          {/* Embed code */}
          <div className={styles.embedBlock}>
            <p className={pageStyles.bodyText}>
              Here is your embed code. Make sure its added to the main page of the website.
            </p>
            <div className={styles.embedField}>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={handleCopy}
                aria-label="Copy embed code"
              >
                <Copy size={20} weight="regular" />
              </button>
              <span className={styles.embedCode}>{embedCode}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.submitSection}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => { sounds.click(); onGoBack(); }}
              onMouseEnter={() => sounds.hover()}
            >
              Go Back To Mainpage
            </button>
            <a
              href={prUrl ?? "https://github.com/imti-ahmed/The-Misfits"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtnLink}
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
            >
              {prUrl ? "Review Your Submission" : "Check Github Page"}
              <ArrowUpRight size={20} weight="regular" />
            </a>
            <a
              href="mailto:designer.imtiyaz@gmail.com"
              className={styles.actionBtnLink}
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
            >
              Contact Guild Leader
              <ArrowUpRight size={20} weight="regular" />
            </a>
          </div>

        </section>

        {/* Cool interaction */}
        <div className={pageStyles.interactionBlock}>
          <DotGridBackground />
        </div>

        {/* Members, gallery, criteria */}
        {bottomContent}

      </main>
    </div>
  );
}
