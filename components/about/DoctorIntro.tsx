import { Check } from "lucide-react";
import { DoctorStackCard } from "@/components/doctor/DoctorStackCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { GlassRing, Orb } from "@/components/ui/Decor";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassButton } from "@/components/ui/GlassButton";
import { RichTitle } from "@/components/ui/RichTitle";
import { cn } from "@/lib/utils";
import type { AboutPageContent } from "@/types/content";
import styles from "./DoctorIntro.module.css";

/**
 * Doctor introduction: the layered DoctorStackCard on the right (first
 * column in RTL), the story on the left — two equal, mirrored halves.
 */
export function DoctorIntro({ content }: { content: AboutPageContent["introduction"] }) {
  return (
    <section id="doctor" className="page-section" aria-labelledby="doctor-intro-title">
      <Orb className="top-1/3 end-[-16rem] h-[34rem] w-[34rem]" color="lavender" />

      <div className={cn("site-container", styles.grid)}>
        <Reveal variant="scale" className={styles.visual} amount={0.3}>
          <GlassRing className={styles.ring} />
          <DoctorStackCard
            image={content.image}
            variant="fan"
            caption={content.caption}
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 68vw"
          />
        </Reveal>

        <div className={styles.text}>
          <Reveal variant="blur" className={styles.heading}>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h2 id="doctor-intro-title" className="type-h2">
              <RichTitle title={content.title} />
            </h2>
          </Reveal>

          <RevealGroup className={styles.paragraphs} stagger={0.1}>
            {content.paragraphs.map((paragraph) => (
              <RevealItem as="p" key={paragraph} className={cn("type-lead", styles.paragraph)}>
                {paragraph}
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealGroup as="ul" className={styles.bullets} stagger={0.08}>
            {content.bullets.map((bullet) => (
              <RevealItem as="li" key={bullet} className={styles.bullet}>
                <span className={styles.check} aria-hidden="true">
                  <Check size={15} strokeWidth={2.6} />
                </span>
                {bullet}
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal variant="fade" delay={0.15}>
            <GlassButton href={content.cta.href}>{content.cta.label}</GlassButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
