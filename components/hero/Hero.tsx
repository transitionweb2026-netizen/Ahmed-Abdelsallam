import { ChevronLeft } from "lucide-react";
import type { CSSProperties } from "react";
import { SocialPhonePanel } from "@/components/contact/SocialPhonePanel";
import { ArtDirectedImage } from "@/components/media/ArtDirectedImage";
import { AppLink } from "@/components/ui/AppLink";
import { CurveLines } from "@/components/ui/Decor";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";
import { RichTitle } from "@/components/ui/RichTitle";
import { routes } from "@/config/routes";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/utils";
import type { Cta, HeroContent } from "@/types/content";
import styles from "./Hero.module.css";

const delay = (seconds: number) => ({ "--delay": `${seconds}s` }) as CSSProperties;

interface HeroProps {
  content: HeroContent;
  /** "full": viewport-height cover (homepage, most pages). "compact": about one-third shorter. */
  size?: "full" | "compact";
  /** Anchor of the section below, for the scroll cue (full size only). */
  scrollTarget?: string;
  /** Show the social links + phone panel under the actions. */
  showContactPanel?: boolean;
  /**
   * Inner pages: render the eyebrow as a breadcrumb trail
   * (Home › eyebrow). Mirrors the BreadcrumbList JSON-LD.
   */
  breadcrumb?: boolean;
  headingId?: string;
}

function HeroAction({ cta, variant }: { cta: Cta; variant: "primary" | "secondary" }) {
  return (
    <GlassButton
      href={cta.href}
      external={cta.external}
      icon={cta.icon}
      ariaLabel={cta.ariaLabel}
      size="lg"
      variant={variant}
      className={styles.action}
    >
      {cta.label}
    </GlassButton>
  );
}

/**
 * Full-bleed cover hero shared by every page: art-directed photo under a
 * brand colour grade and lavender readability scrim, floating glass cards,
 * display headline and liquid-glass actions. Only content and height vary.
 */
export async function Hero({
  content,
  size = "full",
  scrollTarget,
  showContactPanel = size === "full",
  breadcrumb = false,
  headingId = "hero-title",
}: HeroProps) {
  const { t } = await getI18n();
  const floatingCards = content.floatingCards ?? [];
  return (
    <section className={cn(styles.hero, size === "compact" && styles.compact)} aria-labelledby={headingId}>
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

      {floatingCards.length ? (
        <ul className={styles.floating} aria-label={t.common.careHighlights}>
          {floatingCards.map((card, index) => (
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
      ) : null}

      <div className={cn("site-container", styles.inner)}>
        <div className={styles.content}>
          {breadcrumb ? (
            <nav aria-label={t.common.breadcrumb} className="anim-rise" style={delay(0.05)}>
              <Eyebrow as="div">
                <ol className={styles.crumbs}>
                  <li>
                    <AppLink href={routes.home} className={styles.crumbLink}>
                      {t.nav.home}
                    </AppLink>
                  </li>
                  <li>
                    <ChevronLeft className={styles.crumbSep} size={14} strokeWidth={2.4} aria-hidden="true" />
                    <span aria-current="page">{content.eyebrow}</span>
                  </li>
                </ol>
              </Eyebrow>
            </nav>
          ) : (
            <div className="anim-rise" style={delay(0.05)}>
              <Eyebrow>{content.eyebrow}</Eyebrow>
            </div>
          )}
          <h1 id={headingId} className={cn("type-display", styles.title, "anim-rise")} style={delay(0.14)}>
            <RichTitle title={content.title} />
          </h1>
          <p className={cn("type-lead", styles.description, "anim-rise")} style={delay(0.24)}>
            {content.description}
          </p>
          <div className={cn(styles.actions, "anim-rise")} style={delay(0.34)}>
            <HeroAction cta={content.primaryCta} variant="primary" />
            {content.secondaryCta ? <HeroAction cta={content.secondaryCta} variant="secondary" /> : null}
          </div>
          {showContactPanel ? (
            <div className={cn(styles.panel, "anim-rise")} style={delay(0.44)}>
              <SocialPhonePanel />
            </div>
          ) : null}
        </div>
      </div>

      {size === "full" && scrollTarget && content.scrollCueLabel ? (
        <a href={scrollTarget} className={styles.scrollCue}>
          <span className={styles.mouse} aria-hidden="true" />
          <span>{content.scrollCueLabel}</span>
        </a>
      ) : null}
    </section>
  );
}
