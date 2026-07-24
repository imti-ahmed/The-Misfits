"use client";

import { useState } from "react";
import MobileFormPage from "./MobileFormPage";
import MobileSuccessPage from "./MobileSuccessPage";
import { MobileJoinContext } from "./MobileJoinContext";

const WIDGET_IDS = ["001", "002", "003", "004", "005", "006", "007", "008", "009"];

type View = "home" | "join" | "success";

interface SuccessData {
  slug: string;
  applicationNumber: number;
  prUrl?: string;
}

interface SiteInfo {
  views: number;
  memberCount: number;
  latestVersion: string;
  daysOnline: number;
  lastUpdate: string;
}

interface MobileRootProps {
  homePage: React.ReactNode;
  siteInfo: SiteInfo;
}

export default function MobileRoot({ homePage, siteInfo }: MobileRootProps) {
  const [view, setView] = useState<View>("home");
  const [nickname, setNickname] = useState("USER");
  const [selectedWidgetIndex, setSelectedWidgetIndex] = useState(0);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [embedSize, setEmbedSize] = useState<{ width: number; height: number } | null>(null);

  function handleBack() {
    window.scrollTo(0, 0);
    setNickname("USER");
    setSelectedWidgetIndex(0);
    setView("home");
  }

  function handleSuccess(slug: string, applicationNumber: number, prUrl?: string) {
    window.scrollTo(0, 0);
    setSuccessData({ slug, applicationNumber, prUrl });
    setView("success");
  }

  if (view === "join") {
    return (
      <MobileFormPage
        nickname={nickname}
        selectedWidgetIndex={selectedWidgetIndex}
        siteInfo={siteInfo}
        onNicknameChange={setNickname}
        onWidgetSelect={setSelectedWidgetIndex}
        onBack={handleBack}
        onSuccess={handleSuccess}
        onMeasure={(width, height) => setEmbedSize({ width, height })}
      />
    );
  }

  if (view === "success" && successData) {
    return (
      <MobileSuccessPage
        widgetId={WIDGET_IDS[selectedWidgetIndex]}
        nickname={nickname}
        slug={successData.slug}
        prUrl={successData.prUrl}
        siteInfo={siteInfo}
        onGoBack={handleBack}
        embedWidth={embedSize?.width}
        embedHeight={embedSize?.height}
      />
    );
  }

  return (
    <MobileJoinContext.Provider value={() => { window.scrollTo(0, 0); setView("join"); }}>
      {homePage}
    </MobileJoinContext.Provider>
  );
}
