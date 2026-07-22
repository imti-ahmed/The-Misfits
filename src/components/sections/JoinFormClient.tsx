"use client";

import { useState } from "react";
import HeaderTag from "@/components/HeaderTag";
import WidgetPreviewPanel from "./WidgetPreviewPanel";
import FormSection from "./FormSection";
import styles from "./JoinFormClient.module.css";

export default function JoinFormClient() {
  const [nickname, setNickname] = useState("USER");
  const [widgetId, setWidgetId] = useState("001");
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");

  return (
    <>
      <div className={styles.group}>
        <HeaderTag label="select a widget" color="pink" />
        <WidgetPreviewPanel
          nickname={nickname}
          onSelect={setWidgetId}
          bgColor={bgColor}
          textColor={textColor}
        />
      </div>

      <div className={styles.group}>
        <HeaderTag label="fill the details" color="pink" />
        {/* TODO: no success/discard screen exists yet in the new design — wire once built */}
        <FormSection
          widgetId={widgetId}
          onNicknameChange={setNickname}
          onBgColorChange={setBgColor}
          onTextColorChange={setTextColor}
        />
      </div>
    </>
  );
}
