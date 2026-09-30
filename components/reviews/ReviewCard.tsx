import { Quote } from "lucide-react";
import Image from "next/image";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/content";
import styles from "./ReviewCard.module.css";

const AVATAR_TONES = [styles.toneNavy, styles.toneLavender, styles.toneIndigo, styles.toneSoft];

export function ReviewCard({ review, index = 0 }: { review: Review; index?: number }) {
  const initial = Array.from(review.name.trim())[0] ?? "";
  return (
    <figure className={styles.card}>
      <div className={styles.top}>
        <StarRating rating={review.rating} />
        <Quote className={styles.quote} size={34} strokeWidth={1.4} aria-hidden="true" />
      </div>
      <blockquote className={styles.text}>
        <p>{review.text}</p>
      </blockquote>
      <figcaption className={styles.author}>
        {review.avatar ? (
          <Image src={review.avatar.src} alt="" width={44} height={44} className={styles.avatarImage} />
        ) : (
          <span className={cn(styles.avatar, AVATAR_TONES[index % AVATAR_TONES.length])} aria-hidden="true">
            {initial}
          </span>
        )}
        <span className={styles.who}>
          <span className={styles.name}>{review.name}</span>
          {review.context ? <span className={styles.context}>{review.context}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}
