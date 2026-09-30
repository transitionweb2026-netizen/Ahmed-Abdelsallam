import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassButton } from "@/components/ui/GlassButton";
import { RichTitle } from "@/components/ui/RichTitle";
import { cn, whatsappUrl } from "@/lib/utils";
import type { FinalCtaContent } from "@/types/content";
import styles from "./FinalCTA.module.css";

export function FinalCTA({ content }: { content: FinalCtaContent }) {
  return (
    <section className="page-section" aria-labelledby="final-cta-title">
      <div className="site-container">
        <Reveal variant="scale" amount={0.25}>
          <TiltCard className={cn("group", styles.card)}>
            <div className={styles.surface} data-surface="dark">
              <span className={styles.aurora} aria-hidden="true" />
              <span className={styles.glow} aria-hidden="true" />
              <span className={styles.rings} aria-hidden="true" />
              <span className="glass-sheen" aria-hidden="true" />

              <div className={styles.grid}>
                <div className={styles.content}>
                  <Eyebrow tone="light">{content.eyebrow}</Eyebrow>
                  <h2 id="final-cta-title" className={cn("type-h2", styles.title)}>
                    <RichTitle title={content.title} tone="light" />
                  </h2>
                  <p className={cn("type-lead", styles.description)}>{content.description}</p>
                  <div className={styles.actions}>
                    <GlassButton
                      href={whatsappUrl(content.whatsappMessage)}
                      external
                      variant="light"
                      size="lg"
                      icon="whatsapp"
                      className={styles.action}
                      ariaLabel={`${content.whatsappLabel} (يفتح في نافذة جديدة)`}
                    >
                      {content.whatsappLabel}
                    </GlassButton>
                    <GlassButton href={content.contactCta.href} variant="lavender" size="lg" className={styles.action}>
                      {content.contactCta.label}
                    </GlassButton>
                  </div>
                </div>

                <div className={styles.visual}>
                  <span className={styles.visualRing} aria-hidden="true" />
                  <span className={styles.visualDisc} aria-hidden="true" />
                  <div className={styles.portrait}>
                    <Image
                      src={content.image.src}
                      alt={content.image.alt}
                      width={content.image.width}
                      height={content.image.height}
                      sizes="(min-width: 1024px) 420px, 70vw"
                      className={styles.portraitImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
