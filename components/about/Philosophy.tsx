import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { GlassRing, Orb } from "@/components/ui/Decor";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichTitle } from "@/components/ui/RichTitle";
import { cn } from "@/lib/utils";
import type { AboutPageContent } from "@/types/content";
import styles from "./Philosophy.module.css";

/** Oversized typographic quotation mark, drawn as two glass teardrops. */
function QuoteMark({ className, id }: { className?: string; id: string }) {
  return (
    <svg className={className} viewBox="0 0 64 50" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D3DAFA" />
          <stop offset="0.55" stopColor="#8394E2" />
          <stop offset="1" stopColor="#1B275B" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id}-fill)`}
        d="M0 29C0 13 10 3 25 0l2.4 5.2C18.6 8.3 14 14 13.2 21.5H25V50H0V29Zm37 0C37 13 47 3 62 0l2.4 5.2C55.6 8.3 51 14 50.2 21.5H62V50H37V29Z"
      />
    </svg>
  );
}

/**
 * The doctor's philosophy: a large portrait on the left (second column in
 * RTL) and, on the right, the quote on a glass card framed by oversized
 * quotation marks, soft glow and value chips.
 */
export function Philosophy({ content }: { content: AboutPageContent["philosophy"] }) {
  return (
    <section id="philosophy" className="page-section" aria-labelledby="philosophy-title">
      <Orb className="top-1/4 start-[-12rem] h-[36rem] w-[36rem]" color="lavender" />
      <Orb className="bottom-0 end-[-10rem] h-[28rem] w-[28rem]" color="navy" />

      <div className={cn("site-container", styles.grid)}>
        <div className={styles.quoteCol}>
          <Reveal variant="blur" className={styles.heading}>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h2 id="philosophy-title" className="type-h2">
              <RichTitle title={content.title} />
            </h2>
          </Reveal>

          <Reveal variant="up" amount={0.3} className={styles.quoteWrap}>
            <span className={styles.glow} aria-hidden="true" />
            <figure className={cn(styles.quoteCard, "group")}>
              <span className="glass-sheen" aria-hidden="true" />
              <QuoteMark id="philosophy-open" className={styles.markOpen} />
              <blockquote className={styles.quote}>
                <p>{content.quote}</p>
              </blockquote>
              <figcaption className={styles.attribution}>
                <span className={styles.line} aria-hidden="true" />
                <span className={styles.who}>
                  <span className={styles.name}>{content.attribution.name}</span>
                  <span className={styles.role}>{content.attribution.role}</span>
                </span>
              </figcaption>
              <QuoteMark id="philosophy-close" className={styles.markClose} />
            </figure>
          </Reveal>

          <RevealGroup as="ul" className={styles.values} stagger={0.08} aria-label="قيم الرعاية">
            {content.values.map((value) => (
              <RevealItem as="li" key={value.label} className={styles.value}>
                <span className={cn("icon-chip-soft", styles.valueIcon)}>
                  <Icon name={value.icon} size={18} />
                </span>
                {value.label}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal variant="scale" amount={0.25} className={styles.imageCol}>
          <span className={styles.halo} aria-hidden="true" />
          <GlassRing className={styles.ring} />
          <div className={styles.photoFrame}>
            <div className={styles.photo}>
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(min-width: 1024px) 520px, 88vw"
                className={styles.photoImage}
                style={{ objectPosition: content.image.objectPosition }}
              />
              <span className={styles.photoGloss} aria-hidden="true" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
