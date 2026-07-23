import TaggedSection from "@/components/TaggedSection";

const SOCIAL_LINKS = [
  { label: "Portfolio", href: "https://www.imtiyazahmed.com/" },
  { label: "Twitter", href: "https://x.com/imtiahmed01" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/iamimtiyazahmed/" },
  { label: "Github", href: "http://github.com/imti-ahmed" },
];

interface SiteInfoColumnProps {
  views: number;
  memberCount: number;
  latestVersion: string;
  daysOnline: number;
  lastUpdate: string;
}

export default function SiteInfoColumn({ views, memberCount, latestVersion, daysOnline, lastUpdate }: SiteInfoColumnProps) {
  return (
    <>
      <TaggedSection
        headerLabel="author's note"
        color="green"
        content={[
          <div key="author">
            <p>Designed, developed and maintained by Imtiyaz Ahmed.</p>
            <p>
              Find me on{" "}
              {SOCIAL_LINKS.map((link, i) => (
                <span key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                  {i < SOCIAL_LINKS.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
            <iframe
              src="https://themisfits.byimti.tools/embed/admin"
              width="305"
              height="28"
              style={{ border: 0, marginTop: "12px" }}
            />
          </div>,
        ]}
      />

      <TaggedSection
        headerLabel="site stats"
        color="purple"
        content={[
          <ul key="stats">
            <li>Views {">>"} {String(views).padStart(4, "0")}</li>
            <li>Active Members {">>"} {String(memberCount).padStart(4, "0")}</li>
            <li>Days Online {">>"} {String(daysOnline).padStart(4, "0")}</li>
            <li>Version {">>"} {latestVersion.replace(/^v/, "")}</li>
            <li>Last Update {">>"} {lastUpdate}</li>
          </ul>,
        ]}
      />

      <TaggedSection
        headerLabel="update widget"
        color="blue"
        content={[
          <p key="update">
            We&apos;re working on a feature that will let existing members update their webring widget
            design anytime, without having to fill out the form again.
          </p>,
        ]}
      />
    </>
  );
}
