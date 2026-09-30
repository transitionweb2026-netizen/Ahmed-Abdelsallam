import type { CSSProperties } from "react";
import { SocialPhonePanel } from "@/components/home/SocialPhonePanel";
import { ArtDirectedImage } from "@/components/media/ArtDirectedImage";
import { CurveLines } from "@/components/ui/Decor";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";
import { RichTitle } from "@/components/ui/RichTitle";
import { cn } from "@/lib/utils";
import type { HeroContent } from "@/types/content";
import styles from "./Hero.module.css";

const delay = (seconds: number) => ({ "--delay": `${seconds}s` }) as CSSProperties;

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <div className={styles.parallax}>
          <div className={styles.settle}>
            <ArtDirectedImage image={content.image} className={styles.image} priority />
          </div>
        </div>
        <div className={styles.tint} aria-hidden="true" />
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.edge} aria-hidden="true" />
      </div>

      <CurveLines className={styles.curves} />

      <ul className={styles.floating} aria-label="ما يميز الرعاية">
        {content.floatingCards.map((card, index) => (
          <li
            key={card.title}
            className={cn(styles.floatCard, index === 0 ? styles.floatA : styles.floatB, "anim-rise")}
            style={delay(0.7 + index * 0.15)}
          >
            <span className={cn("icon-chip", styles.floatIcon)}>
              <Icon name={card.icon} size={20} />
            </span>
            <span className={styles.floatText}>
              <span className={styles.floatTitle}>{card.title}</span>
              <span className={styles.floatSub}>{card.text}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className={cn("site-container", styles.inner)}>
        <div className={styles.content}>
          <div className="anim-rise" style={delay(0.05)}>
            <Eyebrow>{content.eyebrow}</Eyebrow>
          </div>
          <h1 id="hero-title" className={cn("type-display", styles.title, "anim-rise")} style={delay(0.14)}>
            <RichTitle title={content.title} />
          </h1>
          <p className={cn("type-lead", styles.description, "anim-rise")} style={delay(0.24)}>
            {content.description}
          </p>
          <div className={cn(styles.actions, "anim-rise")} style={delay(0.34)}>
            <GlassButton href={content.primaryCta.href} size="lg" className={styles.action}>
              {content.primaryCta.label}
            </GlassButton>
            <GlassButton href={content.secondaryCta.href} size="lg" variant="secondary" className={styles.action}>
              {content.secondaryCta.label}
            </GlassButton>
          </div>
          <div className={cn(styles.panel, "anim-rise")} style={delay(0.44)}>
            <SocialPhonePanel />
          </div>
        </div>
      </div>

      <a href="#intro" className={styles.scrollCue}>
        <span className={styles.mouse} aria-hidden="true" />
        <span>{content.scrollCueLabel}</span>
      </a>
    </section>
  );
}
