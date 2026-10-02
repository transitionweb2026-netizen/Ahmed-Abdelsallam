import { ArrowUpLeft } from "lucide-react";
import Image from "next/image";
import { AppLink } from "@/components/ui/AppLink";
import { routes } from "@/config/routes";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Condition } from "@/types/content";
import styles from "./ConditionCard.module.css";

/** Link target for a condition (explicit `href`, else its section on /services). */
export const conditionHref = (condition: Condition) =>
  condition.href ?? `${routes.services}#condition-${condition.slug}`;

interface ConditionCardProps {
  condition: Condition;
  /** `sizes` for the card image. */
  sizes?: string;
  /** When set, the card opens a detail dialog instead of navigating. */
  onSelect?: () => void;
}

/**
 * Same glass family as the service cards, its own identity: a wide tile
 * pairing an inset photo with the text (side by side on wide screens,
 * stacked below), a concentric "examination" halo badge, a brand accent
 * edge and symptom chips. The whole card is clickable via a stretched link
 * (or a stretched dialog button).
 */
export function ConditionCard({
  condition,
  sizes = "(min-width: 1280px) 250px, (min-width: 768px) 46vw, 92vw",
  onSelect,
}: ConditionCardProps) {
  return (
    <article className={cn(styles.card, "group")}>
      <span className="glass-sheen" aria-hidden="true" />
      <span className={styles.edge} aria-hidden="true" />

      <div className={styles.mediaWrap}>
        <div className={styles.media}>
          <Image
            src={condition.image.src}
            alt={condition.image.alt}
            fill
            sizes={sizes}
            className={styles.image}
            style={{ objectPosition: condition.image.objectPosition }}
          />
          <span className={styles.mediaTint} aria-hidden="true" />
        </div>
        <span className={styles.halo} aria-hidden="true">
          <span className={styles.ringOuter} />
          <span className={cn("icon-chip-soft", styles.icon)}>
            <Icon name={condition.icon} size={22} />
          </span>
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={cn("type-h3", styles.title)}>
          {onSelect ? (
            <button type="button" className={styles.link} onClick={onSelect} aria-haspopup="dialog">
              {condition.title}
            </button>
          ) : (
            <AppLink href={conditionHref(condition)} className={styles.link}>
              {condition.title}
            </AppLink>
          )}
        </h3>
        <p className={styles.excerpt}>{condition.excerpt}</p>
        <ul className={styles.symptoms} aria-label={`أعراض شائعة: ${condition.title}`}>
          {condition.symptoms.map((symptom) => (
            <li key={symptom} className={styles.chip}>
              {symptom}
            </li>
          ))}
        </ul>
      </div>

      <span className={styles.corner} aria-hidden="true">
        <ArrowUpLeft size={18} strokeWidth={2.2} />
      </span>
    </article>
  );
}
