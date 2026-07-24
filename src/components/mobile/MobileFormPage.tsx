"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import WidgetV2Renderer from "@/widgets/v2/WidgetV2Renderer";
import { WIDGET_V2_SIZES as WIDGET_SIZES, DEFAULT_WIDGET_V2_SIZE as DEFAULT_WIDGET_SIZE } from "@/lib/widgetV2Sizes";
import Toast from "@/components/Toast";
import TaggedSection from "@/components/TaggedSection";
import HeaderTag from "@/components/HeaderTag";
import NavTag from "@/components/NavTag";
import { sounds } from "@/lib/sounds";
import MobileHeader from "./MobileHeader";
import MobileInfoSections from "./MobileInfoSections";
import styles from "./MobileFormPage.module.css";

const WIDGET_IDS = ["001", "002", "003", "004", "005", "006", "007", "008", "009"];
const MOBILE_TICKER_TARGET = 260;

function getMobileTickerScale(widgetId: string): number {
  const { width } = WIDGET_SIZES[widgetId] ?? DEFAULT_WIDGET_SIZE;
  const scale = MOBILE_TICKER_TARGET / width;
  return Math.max(0.4, Math.min(1.4, scale));
}

function ensureHash(val: string): string {
  if (!val) return "";
  return val.startsWith("#") ? val : "#" + val;
}

interface ToastState { message: string; type: "error" | "success"; }

interface SiteInfo {
  views: number;
  memberCount: number;
  latestVersion: string;
  daysOnline: number;
  lastUpdate: string;
}

interface MobileFormPageProps {
  nickname: string;
  selectedWidgetIndex: number;
  siteInfo: SiteInfo;
  onNicknameChange: (n: string) => void;
  onWidgetSelect: (i: number) => void;
  onBack: () => void;
  onSuccess: (slug: string, applicationNumber: number, prUrl?: string) => void;
  onMeasure?: (width: number, height: number) => void;
}

export default function MobileFormPage({
  nickname,
  selectedWidgetIndex,
  siteInfo,
  onNicknameChange,
  onWidgetSelect,
  onBack,
  onSuccess,
  onMeasure,
}: MobileFormPageProps) {
  const [direction, setDirection] = useState<"prev" | "next">("next");
  const [animKey, setAnimKey] = useState(0);

  const [name, setName] = useState("");
  const [nick, setNick] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [embedSize, setEmbedSize] = useState<{ width: number; height: number } | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const closeToast = useCallback(() => setToast(null), []);

  // Measure the real rendered widget size (per selected widget + nickname)
  // instead of relying on the approximate lookup table — text width varies
  // per name and the guess table can clip content in the embed iframe.
  useEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;
    const recompute = () => {
      const width = measure.scrollWidth;
      const height = measure.scrollHeight;
      if (width <= 0) return;
      setEmbedSize({ width, height });
      onMeasure?.(width, height);
    };
    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [selectedWidgetIndex, nickname]);

  function showToast(message: string, type: "error" | "success" = "error") {
    setToast({ message, type });
  }

  function goToPrev() {
    sounds.swoosh();
    const prev = (selectedWidgetIndex - 1 + WIDGET_IDS.length) % WIDGET_IDS.length;
    setDirection("prev");
    setAnimKey((k) => k + 1);
    onWidgetSelect(prev);
  }

  function goToNext() {
    sounds.swoosh();
    const next = (selectedWidgetIndex + 1) % WIDGET_IDS.length;
    setDirection("next");
    setAnimKey((k) => k + 1);
    onWidgetSelect(next);
  }

  const widgetId = WIDGET_IDS[selectedWidgetIndex];
  const tickerScale = getMobileTickerScale(widgetId);

  const slideClass = animKey > 0
    ? (direction === "next" ? styles.slideFromRight : styles.slideFromLeft)
    : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return showToast("Please enter your full name.");
    if (!nick.trim()) return showToast("Please enter a nickname.");
    if (!url.trim()) return showToast("Please enter your website URL.");
    if (!email.trim()) return showToast("Please enter your email address.");
    if (!tags.trim()) return showToast("Please add at least one tag.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          nickname: nick.trim().toUpperCase(),
          url: url.trim(),
          email: email.trim(),
          tags,
          bgColor,
          textColor,
          widgetId,
          embedWidth: embedSize?.width,
          embedHeight: embedSize?.height,
          comments,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        sounds.success();
        onSuccess(data.slug, data.applicationNumber, data.prUrl);
      } else {
        showToast(data.error ?? "Submission failed. Please try again.");
      }
    } catch {
      showToast("Network error — could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDiscard() {
    setNick("");
    setBgColor("");
    setTextColor("");
    onNicknameChange("USER");
    onBack();
  }

  return (
    <div className={styles.page}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

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

        {/* ── Select a widget ──────────────────────────── */}
        <div className={styles.group}>
          <HeaderTag label="select a widget" color="pink" fullWidth />

          <div className={styles.ticker}>
            <div className={styles.tickerDisplay}>
              <div style={{
                transform: `scale(${tickerScale})`,
                transformOrigin: "center center",
                flexShrink: 0,
              }}>
                <div key={animKey} className={slideClass}>
                  <div ref={measureRef} onClick={(e) => e.preventDefault()}>
                    <WidgetV2Renderer
                      widgetId={widgetId}
                      nickname={nickname}
                      slug="preview"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.navRow}>
            <button className={styles.navButton} onClick={goToPrev} aria-label="Previous widget">
              <NavTag label="prev >>" />
            </button>
            <button className={styles.navButton} onClick={goToNext} aria-label="Next widget">
              <NavTag label="next >>" />
            </button>
          </div>
        </div>

        {/* ── Fill the details ─────────────────────────── */}
        <form onSubmit={handleSubmit}>
          <div className={styles.group}>
            <HeaderTag label="fill the details" color="pink" fullWidth />

            <div className={styles.formPart}>
              <input className={styles.field} type="text" placeholder="Your Full Name*" value={name} onChange={(e) => setName(e.target.value)} />
              <input
                className={styles.field}
                type="text"
                placeholder="Nickname (becomes your username)*"
                value={nick}
                maxLength={8}
                onChange={(e) => {
                  setNick(e.target.value);
                  onNicknameChange(e.target.value.trim().toUpperCase() || "USER");
                }}
              />
              <div className={styles.fieldRow}>
                <input className={styles.field} type="text" placeholder="Website Link*" value={url} onChange={(e) => setUrl(e.target.value)} />
                <input className={styles.field} type="text" placeholder="Email Address*" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <input className={styles.field} type="text" placeholder="Tags (Developer, designer, vibe-coder, etc)*" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>

            <div className={styles.formPart}>
              <input className={styles.field} type="text" placeholder="Custom Background Color (Optional)" value={bgColor} onChange={(e) => setBgColor(ensureHash(e.target.value))} />
              <input className={styles.field} type="text" placeholder="Custom Text Color (Optional)" value={textColor} onChange={(e) => setTextColor(ensureHash(e.target.value))} />
              <textarea className={`${styles.field} ${styles.fieldTextarea}`} placeholder="Drop any comments or say something about yourself" value={comments} onChange={(e) => setComments(e.target.value)} />
            </div>

            <div className={styles.navRow}>
              <button
                type="submit"
                className={styles.navButton}
                disabled={submitting}
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.swoosh()}
              >
                <NavTag label={submitting ? "submitting..." : "submit >>"} />
              </button>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => { sounds.click(); handleDiscard(); }}
                onMouseEnter={() => sounds.swoosh()}
              >
                <NavTag label="cancel >>" />
              </button>
            </div>
          </div>
        </form>

        <MobileInfoSections {...siteInfo} onGoBack={onBack} />

      </main>
    </div>
  );
}
