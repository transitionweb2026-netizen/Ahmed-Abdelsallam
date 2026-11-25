import Image from "next/image";
import { cn } from "@/lib/utils";
import type { IconName, MediaImage } from "@/types/content";
import styles from "./DoctorStackCard.module.css";

interface DoctorStackCardProps {
  image: MediaImage;
  /** "fan": cards fanned like a hand of cards. "offset": a slid, diagonal deck. */
  variant?: "fan" | "offset";
  /** `icon` is CMS content, unused here — the badge is always the brand mark. */
  caption: { icon: IconName; title: string; subtitle?: string };
  sizes?: string;
  className?: string;
}

/**
 * Doctor portrait composed as the top card of a layered glass deck.
 * Pure CSS — the back cards fan out on hover with no client JavaScript.
 */
export function DoctorStackCard({
  image,
  variant = "fan",
  caption,
  sizes = "(min-width: 1024px) 420px, (min-width: 640px) 60vw, 68vw",
  className,
}: DoctorStackCardProps) {
  return (
    <figure className={cn(styles.stack, styles[variant], className)}>
      <span className={styles.halo} aria-hidden="true" />
      <span className={cn(styles.card, styles.back3)} aria-hidden="true" />
      <span className={cn(styles.card, styles.back2)} aria-hidden="true" />
      <span className={cn(styles.card, styles.back1)} aria-hidden="true" />
      <div className={cn(styles.card, styles.main)}>
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className={styles.photo} style={{ objectPosition: image.objectPosition }} />
        <span className={styles.gloss} aria-hidden="true" />
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.captionIcon}>
          <Image src="/icon-192.png" alt="" fill sizes="40px" style={{ objectFit: "cover" }} />
        </span>
        <span className={styles.captionText}>
          <span className={styles.captionTitle}>{caption.title}</span>
          {caption.subtitle ? <span className={styles.captionSub}>{caption.subtitle}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}
