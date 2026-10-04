import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassButton } from "@/components/ui/GlassButton";
import { RichTitle } from "@/components/ui/RichTitle";
import { getI18n } from "@/i18n/server";
import { cn, whatsappUrl } from "@/lib/utils";
import type { CtaAction, SiteCtaContent } from "@/types/content";
import styles from "./SiteCTA.module.css";

function CtaButton({ action, variant, newTab }: { action: CtaAction; variant: "light" | "lavender"; newTab: string }) {
  if (action.kind === "whatsapp") {
    return (
      <GlassButton
        href={whatsappUrl(action.message)}
        external
        variant={variant}
        size="lg"
        icon="whatsapp"
        className={styles.action}
        ariaLabel={`${action.label} ${newTab}`}
      >
        {action.label}
      </GlassButton>
    );
  }
  return (
    <GlassButton href={action.href} variant={variant} size="lg" className={styles.action}>
      {action.label}
    </GlassButton>
  );
}

interface SiteCTAProps {
  content: SiteCtaContent;
  headingId?: string;
}

/**
 * The global call-to-action band that closes every page: the doctor
 * cut-out on a navy liquid-glass surface with pointer-driven tilt, aurora
 * sweep and two glass actions (WhatsApp + contact by default).
 */
export async function SiteCTA({ content, headingId = "site-cta-title" }: SiteCTAProps) {
  const { t } = await getI18n();
  return (
    <section className="page-section" aria-labelledby={headingId}>
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
                  <h2 id={headingId} className={cn("type-h2", styles.title)}>
                    <RichTitle title={content.title} tone="light" />
                  </h2>
                  <p className={cn("type-lead", styles.description)}>{content.description}</p>
                  <div className={styles.actions}>
                    <CtaButton action={content.primaryAction} variant="light" newTab={t.common.newTab} />
                    <CtaButton action={content.secondaryAction} variant="lavender" newTab={t.common.newTab} />
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
