import TaggedSection from "@/components/TaggedSection";
import SiteInfoColumn from "@/components/sections/SiteInfoColumn";
import MobileReturnHomeButton from "./MobileReturnHomeButton";

interface MobileInfoSectionsProps {
  views: number;
  memberCount: number;
  latestVersion: string;
  daysOnline: number;
  lastUpdate: string;
  onGoBack: () => void;
}

export default function MobileInfoSections({
  views,
  memberCount,
  latestVersion,
  daysOnline,
  lastUpdate,
  onGoBack,
}: MobileInfoSectionsProps) {
  return (
    <>
      <TaggedSection
        headerLabel="how it works?"
        color="purple"
        fullWidth
        content={[
          <ul key="steps">
            <li>Choose your favorite widget style.</li>
            <li>Fill out the form and submit your site.</li>
            <li>Receive your unique embed URL.</li>
            <li>Add the widget to your homepage.</li>
            <li>We review your submission.</li>
            <li>Once approved, you&apos;re officially part this webring</li>
          </ul>,
        ]}
      />

      <TaggedSection
        headerLabel="return home"
        color="green"
        fullWidth
        content={[
          <p key="home">
            Wanna go back to the homepage? <MobileReturnHomeButton onGoBack={onGoBack} />
          </p>,
        ]}
      />

      <SiteInfoColumn
        views={views}
        memberCount={memberCount}
        latestVersion={latestVersion}
        daysOnline={daysOnline}
        lastUpdate={lastUpdate}
        fullWidth
      />
    </>
  );
}
