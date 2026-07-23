"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HeaderTag from "@/components/HeaderTag";
import WidgetPreviewPanel from "./WidgetPreviewPanel";
import FormSection from "./FormSection";
import WidgetSuccessPanel from "./WidgetSuccessPanel";
import styles from "./JoinFormClient.module.css";

// Matches the exit/enter timing used by the page-level transition
// (src/components/PageTransition.tsx) for a consistent feel.
const EXIT_DURATION = 0.1;
const ENTER_DURATION = 0.32;

export default function JoinFormClient() {
  const [nickname, setNickname] = useState("USER");
  const [widgetId, setWidgetId] = useState("002");
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [customFont, setCustomFont] = useState("");
  const [customFontFamily, setCustomFontFamily] = useState("");
  const [embedSize, setEmbedSize] = useState<{ width: number; height: number } | null>(null);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const isEnteringRef = useRef(false);

  // Plays the enter animation once the success panel has actually mounted.
  useEffect(() => {
    if (!isEnteringRef.current) return;
    isEnteringRef.current = false;

    const el = wrapperRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: ENTER_DURATION, ease: "back.out(2.2)", clearProps: "transform,opacity" }
    );
  }, [successSlug]);

  function handleSuccess(slug: string) {
    const el = wrapperRef.current;
    if (!el) {
      setSuccessSlug(slug);
      return;
    }

    gsap.to(el, {
      opacity: 0,
      scale: 0.97,
      duration: EXIT_DURATION,
      ease: "power1.in",
      onComplete: () => {
        isEnteringRef.current = true;
        setSuccessSlug(slug);
      },
    });
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {successSlug ? (
        <WidgetSuccessPanel
          widgetId={widgetId}
          nickname={nickname}
          slug={successSlug}
          bgColor={bgColor}
          textColor={textColor}
          embedWidth={embedSize?.width}
          embedHeight={embedSize?.height}
        />
      ) : (
        <>
          <div className={styles.group} data-transition-group="card">
            <HeaderTag label="select a widget" color="pink" />
            <WidgetPreviewPanel
              nickname={nickname}
              onSelect={setWidgetId}
              bgColor={bgColor}
              textColor={textColor}
              customFont={customFont}
              customFontFamily={customFontFamily}
              onMeasure={(_widgetId, width, height) => setEmbedSize({ width, height })}
            />
          </div>

          <div className={styles.group} data-transition-group="card">
            <HeaderTag label="fill the details" color="pink" />
            <FormSection
              widgetId={widgetId}
              embedWidth={embedSize?.width}
              embedHeight={embedSize?.height}
              onNicknameChange={setNickname}
              onBgColorChange={setBgColor}
              onTextColorChange={setTextColor}
              onCustomFontChange={setCustomFont}
              onCustomFontFamilyChange={setCustomFontFamily}
              onSuccess={(slug) => handleSuccess(slug)}
            />
          </div>
        </>
      )}
    </div>
  );
}
