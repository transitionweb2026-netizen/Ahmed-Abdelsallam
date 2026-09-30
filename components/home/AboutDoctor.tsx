import { DoctorStackCard } from "@/components/doctor/DoctorStackCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { GlassRing, Orb } from "@/components/ui/Decor";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { AboutContent } from "@/types/content";
import styles from "./AboutDoctor.module.css";

export function AboutDoctor({ content }: { content: AboutContent }) {
  return (
    <section id="about" className="page-section" aria-labelledby="about-title">
      <Orb className="top-1/3 start-[-16rem] h-[34rem] w-[34rem]" color="lavender" />

      <div className={cn("site-container", styles.grid)}>
        {/* Text — right half in RTL */}
        <div className={styles.text}>
          <SectionHeading heading={content.heading} id="about-title" align="start" />
          <RevealGroup as="ul" className={styles.points} stagger={0.1}>
            {content.points.map((point) => (
              <RevealItem as="li" key={point.title} className={styles.point}>
                <span className={cn("icon-chip-soft", styles.pointIcon)}>
                  <Icon name={point.icon} size={20} />
                </span>
                <div>
                  <h3 className={styles.pointTitle}>{point.title}</h3>
                  <p className={styles.pointText}>{point.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal variant="fade" delay={0.15}>
            <GlassButton href={content.cta.href} variant="secondary">
              {content.cta.label}
            </GlassButton>
          </Reveal>
        </div>

        {/* Layered portrait — left half in RTL */}
        <Reveal variant="scale" className={styles.visual} amount={0.3}>
          <GlassRing className={styles.ring} />
          <DoctorStackCard
            image={content.image}
            variant="offset"
            caption={{ icon: content.badge.icon, title: content.badge.label }}
          />
        </Reveal>
      </div>
    </section>
  );
}
