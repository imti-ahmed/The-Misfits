import Link from "next/link";
import LogoBox from "@/components/LogoBox";
import MarqueeTag from "@/components/MarqueeTag";
import HeaderTag from "@/components/HeaderTag";
import StackedTag from "@/components/StackedTag";
import styles from "./SiteHeader.module.css";

interface SiteHeaderProps {
  memberCount: string;
  recentActivity?: string[];
}

export default function SiteHeader({ memberCount, recentActivity = [] }: SiteHeaderProps) {
  const marqueeMessages = [
    "welcome to the webring",
    ...recentActivity,
    "built & maintained by imtiyaz ahmed",
  ];

  return (
    <header className={styles.headerRow} data-transition-group="header">
      <LogoBox />

      <div className={styles.marqueeSlot}>
        <MarqueeTag messages={marqueeMessages} color="green" />
      </div>

      <StackedTag topLabel="active" bottomLabel={`members:${memberCount}`} color="purple" align="end" />

      <Link href="/join" className={styles.headerLink}>
        <StackedTag topLabel="click to" bottomLabel="join >>>" color="yellow" align="start" />
      </Link>

      <a href="https://github.com/imti-ahmed/The-Misfits" target="_blank" rel="noopener noreferrer" className={styles.headerLink}>
        <StackedTag topLabel="visit" bottomLabel="github >" color="yellow" align="start" />
      </a>

      <Link href="/gallery" className={styles.headerLink}>
        <HeaderTag label="gallery >" color="yellow" />
      </Link>
    </header>
  );
}
