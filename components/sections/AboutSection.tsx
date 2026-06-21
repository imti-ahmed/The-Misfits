import { Plus } from "@phosphor-icons/react/dist/ssr";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>What Is The Makers Guild?</p>
        <Plus size={20} className={styles.headerIcon} />
      </div>

      <div className={styles.content01}>
        <p className={styles.bodyText}>
          The Makers Guild is a webring for people who build things - apps, tools, weird side
          projects, anything made out of curiosity rather than a roadmap. Every member&apos;s site
          links to the next one in the ring. No feed, no algorithm. Just one maker pointing you
          toward another, all the way around.
        </p>
      </div>

      <div className={styles.content02}>
        <div className={styles.bodyText}>
          <p>
            A webring is one of the internet&apos;s oldest discovery tricks - back in the 90s,
            before Google, algorithms, or infinite scroll, personal sites linked to each other in a
            loop, each one wearing a small widget with Previous, Next, and Random buttons, so
            clicking Next enough times eventually brought you back where you started.
          </p>
          <p>
            Rings were everywhere for a few years, run entirely by the people in them - until Yahoo
            bought the biggest network and let it rot, and search and feeds took over deciding what
            to show you next. Not a bad idea, just buried under faster, lazier ways to find things.
            The Makers Guild is bringing that loop back, for people who build.
          </p>
        </div>
      </div>
    </div>
  );
}
