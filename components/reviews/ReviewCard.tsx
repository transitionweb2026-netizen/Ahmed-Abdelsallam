import { Quote } from "lucide-react";
import Image from "next/image";
import { StarRating } from "@/components/ui/StarRating";
import { interpolate } from "@/i18n/format";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/content";
import styles from "./ReviewCard.module.css";

const AVATAR_TONES = [styles.toneNavy, styles.toneLavender, styles.toneIndigo, styles.toneSoft];

interface ReviewCardProps {
  review: Review;
  index?: number;
  /** Clamp long reviews to four lines (compact grids). Off shows the full text. */
  clamp?: boolean;
}

const MAX_RATING = 5;

export async function ReviewCard({ review, index = 0, clamp = true }: ReviewCardProps) {
  const { t } = await getI18n();
  const initial = Array.from(review.name.trim())[0] ?? "";
  return (
    <figure className={styles.card}>
      <div className={styles.top}>
        <StarRating
          rating={review.rating}
          max={MAX_RATING}
          label={interpolate(t.reviews.rating, { rating: review.rating, max: MAX_RATING })}
        />
        <Quote className={styles.quote} size={34} strokeWidth={1.4} aria-hidden="true" />
      </div>
      <blockquote className={cn(styles.text, clamp && styles.clamped)}>
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
