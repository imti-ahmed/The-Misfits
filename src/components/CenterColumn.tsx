"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AboutSection from "@/components/sections/AboutSection";
import RequirementSection from "@/components/sections/RequirementSection";
import JoinSection from "@/components/sections/JoinSection";
import JoinGuildSection from "@/components/sections/JoinGuildSection";
import FormSection from "@/components/sections/FormSection";
import WidgetTicker from "@/components/sections/WidgetTicker";
import PreviewSection from "@/components/sections/PreviewSection";
import SuccessSection from "@/components/sections/SuccessSection";
import WidgetRenderer from "@/widgets/WidgetRenderer";

const WIDGET_IDS = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011"];

type View = "home" | "join" | "success";

interface SuccessData {
  slug: string;
  applicationNumber: number;
  prUrl?: string;
}

export default function CenterColumn() {
  const router = useRouter();
  const [view, setView] = useState<View>("home");
  const [nickname, setNickname] = useState("USER");
  const [selectedWidgetIndex, setSelectedWidgetIndex] = useState(0);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  function handleDiscard() {
    setView("home");
    setNickname("USER");
    setSelectedWidgetIndex(0);
  }

  function handleSuccess(slug: string, applicationNumber: number, prUrl?: string) {
    setSuccessData({ slug, applicationNumber, prUrl });
    setView("success");
    router.refresh();
  }

  if (view === "join") {
    return (
      <>
        <JoinGuildSection />
        <WidgetTicker
          nickname={nickname}
          onSelect={(index) => setSelectedWidgetIndex(index)}
        />
        <FormSection
          widgetId={WIDGET_IDS[selectedWidgetIndex]}
          onDiscard={handleDiscard}
          onNicknameChange={setNickname}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  if (view === "success" && successData) {
    const widgetId = WIDGET_IDS[selectedWidgetIndex];
    return (
      <>
        <JoinGuildSection />
        <PreviewSection
          widgetId={widgetId}
          widgetPreview={
            <WidgetRenderer
              widgetId={widgetId}
              nickname={nickname}
              slug={successData.slug}
            />
          }
          applicationNumber={successData.applicationNumber}
        />
        <SuccessSection
          slug={successData.slug}
          prUrl={successData.prUrl}
          onGoBack={handleDiscard}
        />
      </>
    );
  }

  return (
    <>
      <AboutSection />
      <RequirementSection />
      <JoinSection onJoin={() => setView("join")} />
    </>
  );
}
