"use client";

import { useEffect, useRef, useState } from "react";
import WidgetV2Renderer from "@/widgets/v2/WidgetV2Renderer";
import { widgetV2Registry } from "@/widgets/v2/registry";
import { parseGoogleFontFamily } from "@/lib/customFont";
import { SITE_ORIGIN } from "@/lib/site";

const WIDGET_IDS = widgetV2Registry.map((w) => w.id);

function ensureHash(val: string): string {
  if (!val) return "";
  return val.startsWith("#") ? val : "#" + val;
}

export default function EmbedPreviewClient() {
  const [nickname, setNickname] = useState("USER");
  const [widgetId, setWidgetId] = useState(WIDGET_IDS[0]);
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [customFont, setCustomFont] = useState("");
  const [fontReady, setFontReady] = useState(true);
  const [measured, setMeasured] = useState<{ width: number; height: number } | null>(null);
  const [live, setLive] = useState<{ src: string; width: number; height: number } | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Load the custom font before measuring, same as the real join form —
  // font metrics change the widget's real rendered width.
  useEffect(() => {
    if (!customFont) {
      setFontReady(true);
      return;
    }
    setFontReady(false);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = customFont;
    const markReady = () => setFontReady(true);
    link.addEventListener("load", markReady);
    link.addEventListener("error", markReady);
    document.head.appendChild(link);
    return () => {
      link.removeEventListener("load", markReady);
      link.removeEventListener("error", markReady);
      link.remove();
    };
  }, [customFont]);

  const fontFamily = customFont ? parseGoogleFontFamily(customFont) : null;
  const fontVarStyle = fontFamily
    ? ({ "--font-chivo-mono": `"${fontFamily}", 'Chivo Mono', monospace` } as React.CSSProperties)
    : undefined;

  useEffect(() => {
    const measure = measureRef.current;
    if (!measure || !fontReady) return;
    const recompute = () => {
      const width = measure.scrollWidth;
      const height = measure.scrollHeight;
      if (width <= 0) return;
      setMeasured({ width, height });
    };
    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [widgetId, nickname, fontReady]);

  function handleGenerate() {
    if (!measured) return;
    const params = new URLSearchParams({
      nickname,
      widget: widgetId,
      bgColor,
      textColor,
      customFont,
      embedWidth: String(measured.width),
      embedHeight: String(measured.height),
      // Cache-bust so a stale/cached response can't hide behind a URL
      // you've already loaded once in this session.
      _t: String(Date.now()),
    });
    setLive({ src: `${SITE_ORIGIN}/embed/preview?${params.toString()}`, width: measured.width, height: measured.height });
  }

  const embedCodeSrc = live ? `${SITE_ORIGIN}/embed/preview?${live.src.split("?")[1].replace(/&_t=\d+/, "")}` : null;
  const embedCodeText = live ? `<iframe src="${embedCodeSrc}" width="${live.width}" height="${live.height}" style="border:0"></iframe>` : null;

  return (
    <div style={{ padding: 24, maxWidth: 640, margin: "0 auto", fontFamily: "monospace", color: "#eee", background: "#111", minHeight: "100vh" }}>
      <h1>Embed Debug Preview</h1>
      <p>
        Tests the real <code>/embed/[slug]</code> rendering pipeline directly — no member file or PR
        needed. Fill in the fields, then generate a live iframe.
      </p>

      <div style={{ display: "grid", gap: 10, margin: "20px 0" }}>
        <label>
          Nickname
          <input
            style={inputStyle}
            value={nickname}
            maxLength={8}
            onChange={(e) => setNickname(e.target.value.toUpperCase())}
          />
        </label>
        <label>
          Widget
          <select style={inputStyle} value={widgetId} onChange={(e) => setWidgetId(e.target.value)}>
            {WIDGET_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Background Color
          <input style={inputStyle} value={bgColor} onChange={(e) => setBgColor(e.target.value)} placeholder="#356aff" />
        </label>
        <label>
          Text Color
          <input style={inputStyle} value={textColor} onChange={(e) => setTextColor(e.target.value)} placeholder="#ffffff" />
        </label>
        <label>
          Custom Font URL (Google Fonts CSS URL)
          <input
            style={inputStyle}
            value={customFont}
            onChange={(e) => setCustomFont(e.target.value)}
            placeholder="https://fonts.googleapis.com/css2?family=..."
          />
        </label>
      </div>

      {/* Hidden live render used only to measure the widget's real size,
          exactly like the real join form's preview panel. */}
      <div style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", top: -9999, left: -9999 }}>
        <div ref={measureRef} style={fontVarStyle}>
          <WidgetV2Renderer
            widgetId={widgetId}
            nickname={nickname}
            slug="preview"
            bgColor={ensureHash(bgColor)}
            textColor={ensureHash(textColor)}
          />
        </div>
      </div>

      <p>Measured size: {measured ? `${measured.width} x ${measured.height}` : "measuring..."}</p>

      <button style={buttonStyle} onClick={handleGenerate} disabled={!measured}>
        Generate Live Iframe
      </button>

      {live && (
        <div style={{ marginTop: 24 }}>
          <h2>Live Iframe</h2>
          <div style={{ background: "#222", padding: 12, display: "inline-block" }}>
            <iframe key={live.src} src={live.src} width={live.width} height={live.height} style={{ border: "1px dashed #666" }} />
          </div>
          <h3>Embed Code</h3>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", background: "#222", padding: 12 }}>{embedCodeText}</pre>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 4,
  padding: "6px 8px",
  background: "#000",
  color: "#eee",
  border: "1px solid #444",
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  background: "#356aff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
