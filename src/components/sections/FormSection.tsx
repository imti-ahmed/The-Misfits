"use client";

import { useState, useCallback } from "react";
import styles from "./FormSection.module.css";
import Toast from "@/components/Toast";
import NavTag from "@/components/NavTag";
import { sounds } from "@/lib/sounds";

interface FormSectionProps {
  widgetId?: string;
  embedWidth?: number;
  embedHeight?: number;
  onDiscard?: () => void;
  onNicknameChange?: (nickname: string) => void;
  onBgColorChange?: (bgColor: string) => void;
  onTextColorChange?: (textColor: string) => void;
  onCustomFontChange?: (customFont: string) => void;
  onCustomFontFamilyChange?: (customFontFamily: string) => void;
  onSuccess?: (slug: string, applicationNumber: number, prUrl?: string) => void;
}

interface ToastState {
  message: string;
  type: "error" | "success";
}

function ensureHash(val: string): string {
  if (!val) return "";
  return val.startsWith("#") ? val : "#" + val;
}

function ensureHttps(val: string): string {
  if (!val) return "";
  if (/^https?:\/\//i.test(val)) return val;
  // Let the user type or backspace through a partial "https://" themselves
  // instead of fighting them with a re-added prefix on every keystroke.
  if ("https://".startsWith(val.toLowerCase())) return val;
  return "https://" + val;
}

export default function FormSection({
  widgetId,
  embedWidth,
  embedHeight,
  onDiscard,
  onNicknameChange,
  onBgColorChange,
  onTextColorChange,
  onCustomFontChange,
  onCustomFontFamilyChange,
  onSuccess,
}: FormSectionProps) {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [customFont, setCustomFont] = useState("");
  const [customFontFamily, setCustomFontFamily] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const closeToast = useCallback(() => setToast(null), []);

  function showToast(message: string, type: "error" | "success" = "error") {
    setToast({ message, type });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return showToast("Please enter your full name.");
    if (!nickname.trim()) return showToast("Please enter a nickname.");
    if (!url.trim()) return showToast("Please enter your website URL.");
    if (!email.trim()) return showToast("Please enter your email address.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          nickname: nickname.trim().toUpperCase(),
          url: url.trim(),
          email: email.trim(),
          tags,
          bgColor,
          textColor,
          customFont,
          customFontFamily,
          widgetId,
          embedWidth,
          embedHeight,
          comments,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        sounds.success();
        onSuccess?.(data.slug, data.applicationNumber, data.prUrl);
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
    setNickname("");
    setBgColor("");
    setTextColor("");
    setCustomFont("");
    setCustomFontFamily("");
    onNicknameChange?.("USER");
    onBgColorChange?.("");
    onTextColorChange?.("");
    onCustomFontChange?.("");
    onCustomFontFamilyChange?.("");
    onDiscard?.();
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.part}>
          <div className={styles.row}>
            <input
              className={styles.field}
              type="text"
              placeholder="Your Full Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={styles.field}
              type="text"
              placeholder="Nickname (becomes your username)*"
              value={nickname}
              maxLength={8}
              onChange={(e) => {
                setNickname(e.target.value);
                onNicknameChange?.(e.target.value.trim().toUpperCase() || "USER");
              }}
            />
          </div>
          <div className={styles.row}>
            <input
              className={styles.field}
              type="text"
              placeholder="Website Link*"
              value={url}
              onChange={(e) => setUrl(ensureHttps(e.target.value))}
            />
            <input
              className={styles.field}
              type="text"
              placeholder="Email Address*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <input
            className={styles.field}
            type="text"
            placeholder="Tags (Developer, designer, vibe-coder, etc) (optional)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className={styles.part}>
          <div className={styles.row}>
            <input
              className={styles.field}
              type="text"
              placeholder="Custom Background Color (Optional)"
              value={bgColor}
              maxLength={7}
              onChange={(e) => {
                const val = ensureHash(e.target.value);
                setBgColor(val);
                onBgColorChange?.(val);
              }}
            />
            <input
              className={styles.field}
              type="text"
              placeholder="Custom Text Color (Optional)"
              value={textColor}
              maxLength={7}
              onChange={(e) => {
                const val = ensureHash(e.target.value);
                setTextColor(val);
                onTextColorChange?.(val);
              }}
            />
          </div>
          <div className={styles.row}>
            <input
              className={styles.field}
              type="text"
              placeholder="Custom Font: Google Fonts or CDN stylesheet URL (Optional)"
              value={customFont}
              onChange={(e) => {
                setCustomFont(e.target.value);
                onCustomFontChange?.(e.target.value);
              }}
            />
            <input
              className={styles.field}
              type="text"
              placeholder="Font Family Name (only needed for non-Google-Fonts URLs)"
              value={customFontFamily}
              onChange={(e) => {
                setCustomFontFamily(e.target.value);
                onCustomFontFamilyChange?.(e.target.value);
              }}
            />
          </div>
          <textarea
            className={`${styles.field} ${styles.fieldTextarea}`}
            placeholder="Drop any comments or say something about yourself (optional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <div className={styles.submitRow}>
          <button type="submit" className={styles.navButton} disabled={submitting} onClick={() => sounds.click()} onMouseEnter={() => sounds.hover()}>
            <NavTag label={submitting ? "submitting..." : "submit >>"} />
          </button>
          <button type="button" className={styles.navButton} onClick={() => { sounds.click(); handleDiscard(); }} onMouseEnter={() => sounds.hover()}>
            <NavTag label="cancel >>" />
          </button>
        </div>
      </form>
    </>
  );
}
