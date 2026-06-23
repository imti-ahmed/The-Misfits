"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

export default function CenterColumn() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nickname, setNickname] = useState("USER");
  const [selectedWidgetIndex, setSelectedWidgetIndex] = useState(0);

  function handleDiscard() {
    setNickname("USER");
    setSelectedWidgetIndex(0);
    router.push("/");
  }

  function handleSuccess(slug: string, applicationNumber: number, prUrl?: string) {
    const widgetId = WIDGET_IDS[selectedWidgetIndex];
    const params = new URLSearchParams({
      slug,
      n: String(applicationNumber),
      w: widgetId,
      nick: nickname,
      ...(prUrl ? { pr: prUrl } : {}),
    });
    router.push(`/success?${params}`);
  }

  if (pathname === "/apply") {
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

  if (pathname === "/success") {
    const slug = searchParams.get("slug") ?? "";
    const applicationNumber = Number(searchParams.get("n") ?? 0);
    const widgetId = searchParams.get("w") ?? "001";
    const nick = searchParams.get("nick") ?? "USER";
    const prUrl = searchParams.get("pr") ?? undefined;

    if (!slug) {
      router.replace("/");
      return null;
    }

    return (
      <>
        <JoinGuildSection />
        <PreviewSection
          widgetId={widgetId}
          widgetPreview={
            <WidgetRenderer widgetId={widgetId} nickname={nick} slug={slug} />
          }
          applicationNumber={applicationNumber}
        />
        <SuccessSection
          slug={slug}
          prUrl={prUrl}
          onGoBack={() => router.push("/")}
        />
      </>
    );
  }

  return (
    <>
      <AboutSection />
      <RequirementSection />
      <JoinSection onJoin={() => router.push("/apply")} />
    </>
  );
}
