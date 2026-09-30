import { DoctorStackCard } from "@/components/doctor/DoctorStackCard";
import { StatCard } from "@/components/home/StatCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DotGrid, Orb } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { StatsContent } from "@/types/content";
import styles from "./StatsSection.module.css";

export function StatsSection({ content }: { content: StatsContent }) {
  return (
    <section className="page-section" aria-labelledby="stats-title">
      <Orb className="top-1/4 end-[-14rem] h-[36rem] w-[36rem]" color="lavender" />
      <DotGrid className="top-10 start-[4%] h-64 w-64 opacity-70" />

      <div className={cn("site-container", styles.grid)}>
        {/* Statistics — right half in RTL */}
        <div className={styles.statsCol}>
          <SectionHeading heading={content.heading} id="stats-title" align="start" />
          <RevealGroup as="ul" className={styles.statsGrid} stagger={0.1}>
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
            caption={{ icon: "stethoscope", title: content.doctorName, subtitle: content.doctorRole }}
          />
        </Reveal>
      </div>
    </section>
  );
}
