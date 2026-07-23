import SiteHeader from "@/components/sections/SiteHeader";
import SiteInfoColumn from "@/components/sections/SiteInfoColumn";
import TaggedSection from "@/components/TaggedSection";
import MemberLink from "@/components/MemberLink";
import MobilePage from "@/components/mobile/MobilePage";
import MobileRoot from "@/components/mobile/MobileRoot";
import MobileFormBottomContent from "@/components/mobile/MobileFormBottomContent";
import { getSites } from "@/lib/sites";
import { getViews } from "@/lib/db";
import { withRef } from "@/lib/ref";
import { getLatestVersion, getDaysOnline, getLastUpdateDate, getRecentMemberActivityMessages } from "@/lib/version";
import layout from "@/styles/screenLayout.module.css";
import styles from "./page.module.css";

export default async function Home() {
  const members = getSites();
  const views = await getViews().catch(() => 0);
  const latestVersion = getLatestVersion();
  const daysOnline = getDaysOnline();
  const lastUpdate = await getLastUpdateDate();
  const recentActivity = await getRecentMemberActivityMessages();
  const memberCount = String(members.length).padStart(3, "0");

  return (
    <>
      <div className={layout.desktopOnly}>
        <main className={layout.page}>
          <div className={layout.bgTexture} aria-hidden />

          <SiteHeader memberCount={memberCount} recentActivity={recentActivity} />

          <div className={layout.content}>
            <div className={layout.leftColumn}>
              <TaggedSection
                headerLabel="active member list"
                color="yellow"
                content={[
                  "List of active members. Everyone here is an utterly crazy and interesting person making or building cool shit. P.S. The order of the ring is randomized daily.",
                  <ol key="members" className={styles.memberList}>
                    {members.map((member) => (
                      <li key={member.slug}>
                        {member.name}
                        <br />
                        <MemberLink href={withRef(member.url)}>{member.url}</MemberLink>
                      </li>
                    ))}
                  </ol>,
                ]}
              />
            </div>

            <div className={layout.centerColumn}>
              <TaggedSection
                headerLabel="what is this?"
                color="pink"
                content={[
                  <div key="body">
                    <p>
                      The Misfits Webring is a webring for people who make weird, thoughtful things on the
                      internet - apps, tools, tiny websites, experiments, side projects, anything built out of
                      curiosity rather than a roadmap. Every site links to the next. No feed, no algorithm. Just
                      one misfit pointing you toward another.
                    </p>
                    <p>
                      A webring is one of the internet&apos;s oldest discovery tricks. Back in the 90s, personal
                      websites linked to each other in a loop with simple Previous, Next, and Random buttons.
                      Before search engines and infinite feeds, this was how you stumbled across cool corners of
                      the web.
                    </p>
                    <p>The Misfits Webring brings that loop back for a more curious, human internet.</p>
                  </div>,
                ]}
              />

              <TaggedSection
                headerLabel="requirements to join"
                color="blue"
                content={[
                  <ul key="reqs">
                    <li>Personal sites only. No company pages, resumes, or sales funnels.</li>
                    <li>Make it worth the click. Share something interesting, useful, or fun.</li>
                    <li>Anyone can join. Builders, designers, artists, developers, or curious creators.</li>
                    <li>No illegal, NSFW, or disturbing content.</li>
                    <li>Keep the Webring widget visible on your homepage.</li>
                    <li>Keep your site alive. Dead or abandoned sites may be removed.</li>
                    <li>Every submission is reviewed before joining.</li>
                  </ul>,
                ]}
              />

              <TaggedSection
                headerLabel="how to join?"
                color="purple"
                content={[
                  <p key="join">
                    Submit your site through the form on this site, or open a request on our GitHub. Once
                    approved, embed the widget and you&apos;re officially part of the Guild. Usually takes 1–2
                    days, and you&apos;ll hear back by email.{" "}
                    <a href="/join">Click Here To Join</a>
                  </p>,
                ]}
              />
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

      <div className={layout.mobileOnly}>
        <MobileRoot
          homePage={<MobilePage />}
          formBottomContent={<MobileFormBottomContent />}
        />
      </div>
    </>
  );
}
