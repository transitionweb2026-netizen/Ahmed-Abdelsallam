import { Clock } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { GlassRing, Orb, PlusMark } from "@/components/ui/Decor";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { IntroContent } from "@/types/content";
import styles from "./IntroSection.module.css";

export function IntroSection({ content }: { content: IntroContent }) {
  const { video } = content;
  return (
    <section id="intro" className="page-section" aria-labelledby="intro-title">
      <Orb className="-top-24 start-[-12rem] h-[34rem] w-[34rem]" color="lavender" />
      <Orb className="bottom-0 end-[-10rem] h-[28rem] w-[28rem]" color="blue" />

      <div className={cn("site-container", styles.grid)}>
        {/* Text — second column on desktop (left in RTL), first on mobile. */}
        <div className={styles.text}>
          <SectionHeading heading={content.heading} id="intro-title" align="start" />
          <RevealGroup as="ul" className={styles.highlights} stagger={0.08} aria-label="ما يميز الرعاية">
            {content.highlights.map((item) => (
              <RevealItem as="li" key={item.label} className={styles.highlight}>
                <span className={cn("icon-chip-soft", styles.highlightIcon)}>
                  <Icon name={item.icon} size={19} />
                </span>
                {item.label}
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal variant="fade" delay={0.2}>
            <GlassButton href={content.link.href}>{content.link.label}</GlassButton>
          </Reveal>
        </div>

        {/* Video — first column on desktop (right in RTL). */}
        <Reveal variant="scale" className={styles.videoCol} amount={0.3}>
          <GlassRing className={styles.ring} />
          <PlusMark id="intro-plus" className={styles.plus} />
          <div className={styles.frame}>
            <VideoPlayer
              video={video}
              sizes="(min-width: 1320px) 620px, (min-width: 1024px) 46vw, 92vw"
              className={styles.screen}
              overlay={
                <span className={styles.caption} aria-hidden="true">
                  <span className={styles.captionTitle}>{video.title}</span>
                  {video.duration ? (
                    <span className={styles.captionMeta}>
                      <Clock size={14} />
                      <span dir="ltr">{video.duration}</span>
                    </span>
                  ) : null}
                </span>
              }
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
