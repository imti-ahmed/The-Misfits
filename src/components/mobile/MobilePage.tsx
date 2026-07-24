import { unstable_noStore as noStore } from "next/cache";
import { getSites } from "@/lib/sites";
import { getViews } from "@/lib/db";
import { withRef } from "@/lib/ref";
import { getLatestVersion, getDaysOnline, getLastUpdateDate } from "@/lib/version";
import MemberLink from "@/components/MemberLink";
import TaggedSection from "@/components/TaggedSection";
import SiteInfoColumn from "@/components/sections/SiteInfoColumn";
import MobileHeader from "./MobileHeader";
import MobileJoinButton from "./MobileJoinButton";
import styles from "./MobilePage.module.css";

export default async function MobilePage() {
  noStore();

  const members = getSites();
  const memberCount = String(members.length).padStart(3, "0");

  let views = 0;
  try {
    views = await getViews();
  } catch {}

  const latestVersion = getLatestVersion();
  const daysOnline = getDaysOnline();
  const lastUpdate = await getLastUpdateDate();

  return (
    <div className={styles.page}>
      <MobileHeader memberCount={memberCount} />

      <main className={styles.content}>
        <TaggedSection
          headerLabel="what is this?"
          color="pink"
          fullWidth
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
          headerLabel="how to join?"
          color="purple"
          fullWidth
          content={[
            <p key="join">
              Submit your site through the form on this site, or open a request on our GitHub. Once
              approved, embed the widget and you&apos;re officially part of the Guild. Usually takes 1–2
              days, and you&apos;ll hear back by email.
              <MobileJoinButton />
            </p>,
          ]}
        />

        <TaggedSection
          headerLabel="requirements to join"
          color="blue"
          fullWidth
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
          headerLabel="active member list"
          color="yellow"
          fullWidth
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

        <SiteInfoColumn
          views={views}
          memberCount={members.length}
          latestVersion={latestVersion}
          daysOnline={daysOnline}
          lastUpdate={lastUpdate}
          fullWidth
        />
      </main>
    </div>
  );
}
