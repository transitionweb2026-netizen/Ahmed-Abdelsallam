import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { StatCard } from "@/components/stats/StatCard";
import { DotGrid, Orb } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SectionHeading as SectionHeadingValue, Stat } from "@/types/content";
import styles from "./StatsBand.module.css";

interface StatsBandProps {
  heading: SectionHeadingValue;
  stats: Stat[];
}

/** Heading plus a row of glass stat cards whose counters run on first view. */
export function StatsBand({ heading, stats }: StatsBandProps) {
  return (
    <section className="page-section" aria-labelledby="about-stats-title">
      <Orb className="top-1/4 end-[-14rem] h-[34rem] w-[34rem]" color="lavender" />
      <DotGrid className="bottom-6 start-[4%] h-56 w-56 opacity-60" />

      <div className="site-container relative">
        <SectionHeading heading={heading} id="about-stats-title" />
        <div className={styles.panel}>
          <RevealGroup as="ul" className={styles.grid} stagger={0.1}>
            {stats.map((stat, index) => (
              <RevealItem as="li" key={stat.id} variant="scale" className={styles.item}>
                <StatCard stat={stat} index={index} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
