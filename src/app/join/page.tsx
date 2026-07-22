import Link from "next/link";
import SiteHeader from "@/components/sections/SiteHeader";
import SiteInfoColumn from "@/components/sections/SiteInfoColumn";
import JoinFormClient from "@/components/sections/JoinFormClient";
import TaggedSection from "@/components/TaggedSection";
import ResolutionIndicator from "@/components/ResolutionIndicator";
import { getSites } from "@/lib/sites";
import { getViews } from "@/lib/db";
import { getLatestVersion, getDaysOnline, getLastUpdateDate, getRecentMemberActivityMessages } from "@/lib/version";
import layout from "@/styles/screenLayout.module.css";

export default async function JoinPage() {
  const members = getSites();
  const views = await getViews().catch(() => 0);
  const latestVersion = getLatestVersion();
  const daysOnline = getDaysOnline();
  const lastUpdate = await getLastUpdateDate();
  const recentActivity = await getRecentMemberActivityMessages();
  const memberCount = String(members.length).padStart(3, "0");

  return (
    <div className={layout.desktopOnly}>
      <main className={layout.page}>
        <div className={layout.bgTexture} aria-hidden />
        {/* TODO: dev-only reference overlay, remove before final ship */}
        <ResolutionIndicator />

        <SiteHeader memberCount={memberCount} recentActivity={recentActivity} />

        <div className={layout.content}>
          <div className={layout.leftColumn}>
            <TaggedSection
              headerLabel="join the webring"
              color="yellow"
              content={[
                <p key="welcome">
                  Welcome Cool Misfit.
                  <br />
                  <br />
                  Pick a widget, submit your site, and we&apos;ll handle the rest. Cheers!
                </p>,
              ]}
            />

            <TaggedSection
              headerLabel="how it works?"
              color="purple"
              content={[
                <ul key="steps">
                  <li>Choose your favorite widget style.</li>
                  <li>Fill out the form and submit your site.</li>
                  <li>Receive your unique embed URL.</li>
                  <li>Add the widget to your homepage.</li>
                  <li>Optionally override the widget&apos;s width and font from your own site&apos;s embed script — nothing else is customizable from there.</li>
                  <li>We review your submission.</li>
                  <li>Once approved, you&apos;re officially part this webring</li>
                </ul>,
              ]}
            />

            <TaggedSection
              headerLabel="return home"
              color="green"
              content={[
                <p key="home">
                  Wanna go back to the homepage? <Link href="/">Click Here</Link>
                </p>,
              ]}
            />
          </div>

          <div className={layout.centerColumn}>
            <JoinFormClient />
          </div>

          <div className={layout.rightColumn}>
            <SiteInfoColumn
              views={views}
              memberCount={members.length}
              latestVersion={latestVersion}
              daysOnline={daysOnline}
              lastUpdate={lastUpdate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
