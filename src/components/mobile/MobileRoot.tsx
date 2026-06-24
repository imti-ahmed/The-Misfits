"use client";

import { useState } from "react";
import WidgetRenderer from "@/widgets/WidgetRenderer";
import SuccessSection from "@/components/sections/SuccessSection";
import PreviewSection from "@/components/sections/PreviewSection";
import MobileHeader, { HOME_TABS } from "./MobileHeader";
import MobileFormPage from "./MobileFormPage";
import { MobileJoinContext } from "./MobileJoinContext";
import styles from "./MobileRoot.module.css";

const WIDGET_IDS = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011"];

type View = "home" | "join" | "success";

interface SuccessData {
  slug: string;
  applicationNumber: number;
  prUrl?: string;
}

interface MobileRootProps {
  homePage: React.ReactNode;
  formBottomContent: React.ReactNode;
}

export default function MobileRoot({ homePage, formBottomContent }: MobileRootProps) {
  const [view, setView] = useState<View>("home");
  const [nickname, setNickname] = useState("USER");
  const [selectedWidgetIndex, setSelectedWidgetIndex] = useState(0);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  function handleBack() {
    setNickname("USER");
    setSelectedWidgetIndex(0);
    setView("home");
  }

  function handleSuccess(slug: string, applicationNumber: number, prUrl?: string) {
    setSuccessData({ slug, applicationNumber, prUrl });
    setView("success");
  }

  if (view === "join") {
    return (
      <MobileFormPage
        nickname={nickname}
        selectedWidgetIndex={selectedWidgetIndex}
        bottomContent={formBottomContent}
        onNicknameChange={setNickname}
        onWidgetSelect={setSelectedWidgetIndex}
        onBack={handleBack}
        onSuccess={handleSuccess}
      />
    );
  }

  if (view === "success" && successData) {
    const widgetId = WIDGET_IDS[selectedWidgetIndex];
    return (
      <div className={styles.successPage}>
        <MobileHeader tabs={HOME_TABS as unknown as { label: string; id: string }[]} />
        <div className={styles.successContent}>
          <PreviewSection
            widgetId={widgetId}
            applicationNumber={successData.applicationNumber}
            widgetPreview={
              <WidgetRenderer
                widgetId={widgetId}
                nickname={nickname}
                slug={successData.slug}
              />
            }
          />
          <SuccessSection
            slug={successData.slug}
            widgetId={widgetId}
            prUrl={successData.prUrl}
            onGoBack={handleBack}
          />
        </div>
      </div>
    );
  }

  return (
    <MobileJoinContext.Provider value={() => setView("join")}>
      {homePage}
    </MobileJoinContext.Provider>
  );
}
