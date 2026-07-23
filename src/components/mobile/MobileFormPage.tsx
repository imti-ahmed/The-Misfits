"use client";

import { Plus } from "@phosphor-icons/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState, useCallback, useEffect, useRef } from "react";
import WidgetV2Renderer from "@/widgets/v2/WidgetV2Renderer";
import { WIDGET_V2_SIZES as WIDGET_SIZES, DEFAULT_WIDGET_V2_SIZE as DEFAULT_WIDGET_SIZE } from "@/lib/widgetV2Sizes";
import Toast from "@/components/Toast";
import { sounds } from "@/lib/sounds";
import MobileHeader, { FORM_TABS } from "./MobileHeader";
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

interface MobileFormPageProps {
  nickname: string;
  selectedWidgetIndex: number;
  bottomContent: React.ReactNode;
  onNicknameChange: (n: string) => void;
  onWidgetSelect: (i: number) => void;
  onBack: () => void;
  onSuccess: (slug: string, applicationNumber: number, prUrl?: string) => void;
  onMeasure?: (width: number, height: number) => void;
}

export default function MobileFormPage({
  nickname,
  selectedWidgetIndex,
  bottomContent,
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

      <MobileHeader tabs={FORM_TABS as unknown as { label: string; id: string }[]} />

      <main className={styles.content}>

        {/* ── Join The Guild header ──────────────────── */}
        <section id="form">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>Join The Guild</p>
            <Plus size={18} className={styles.sectionIcon} />
          </div>

          {/* Intro text */}
          <div className={styles.block}>
            <p className={styles.bodyText}>
              Welcome Cool Strange. To join the guild, please fill the form below and choose the
              kind of webring widget you want to embed in your website. Want different colors?
              Please specify the hex codes in the form below and submit — and we handle the rest.
              You will get an embed code, add that to your site and once we approve, you will
              part of the webring.
            </p>
          </div>

          {/* Widget ticker */}
          <div className={styles.ticker}>
            <button className={styles.caretBtn} onClick={goToPrev} aria-label="Previous widget">
              <CaretLeft size={18} />
            </button>
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
            <button className={styles.caretBtn} onClick={goToNext} aria-label="Next widget">
              <CaretRight size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
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
              <textarea className={`${styles.field} ${styles.fieldTextarea}`} placeholder="Drop any comments" value={comments} onChange={(e) => setComments(e.target.value)} />
            </div>

            <div className={styles.submitBlock}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.swoosh()}
              >
                {submitting ? "Submitting..." : "Submit The Application"}
                <Plus size={18} />
              </button>
            </div>
            <div className={styles.discardBlock}>
              <button
                type="button"
                className={styles.discardBtn}
                onClick={() => { sounds.click(); handleDiscard(); }}
                onMouseEnter={() => sounds.swoosh()}
              >
                Discard &amp; Go Back
              </button>
            </div>
          </form>
        </section>

        {/* ── Bottom sections (members, gallery, criteria) */}
        {bottomContent}

      </main>
    </div>
  );
}
