import type { CSSProperties } from "react";
import { DoctorStackCard } from "@/components/doctor/DoctorStackCard";
import { StatCard } from "@/components/stats/StatCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DotGrid, Orb } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { StatsContent } from "@/types/content";
import styles from "./StatsSection.module.css";

export function StatsSection({ content, id }: { content: StatsContent; id?: string }) {
  // Pairs of cards read as a 2x2 block; an odd count (no pair for the last
  // card) instead fills a single row, so the grid never leaves a lone card
  // dangling next to an empty cell.
  const statCols = content.stats.length % 2 === 0 ? 2 : content.stats.length;

  return (
    <section id={id} className="page-section" aria-labelledby="stats-title">
      <Orb className="top-1/4 end-[-14rem] h-[36rem] w-[36rem]" color="lavender" />
      <DotGrid className="top-10 start-[4%] h-64 w-64 opacity-70" />

      <div className={cn("site-container", styles.grid)}>
        {/* Statistics — right half in RTL */}
        <div className={styles.statsCol}>
          <SectionHeading heading={content.heading} id="stats-title" align="start" />
          <RevealGroup
            as="ul"
            className={styles.statsGrid}
            style={{ "--stat-cols": statCols } as CSSProperties}
            stagger={0.1}
          >
            {content.stats.map((stat, index) => (
              <RevealItem as="li" key={stat.id} variant="scale">
                <StatCard stat={stat} index={index} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Doctor card stack — left half in RTL */}
        <Reveal variant="scale" className={styles.doctorCol} amount={0.3}>
          <DoctorStackCard
            image={content.doctorImage}
            variant="fan"
            sizes="(min-width: 1024px) 420px, (min-width: 768px) 38vw, 68vw"
            caption={content.caption}
          />
        </Reveal>
      </div>
    </section>
  );
}
