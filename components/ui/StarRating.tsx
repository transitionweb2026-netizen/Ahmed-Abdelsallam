import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  /** Accessible text, e.g. "Rated 5 out of 5". */
  label: string;
  className?: string;
}

export function StarRating({ rating, max = 5, label, className }: StarRatingProps) {
  return (
    <div role="img" aria-label={label} className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }, (_, index) => {
        const filled = index < rating;
        return (
          <Star
            key={index}
            size={17}
            strokeWidth={1.6}
            aria-hidden="true"
            className={filled ? "fill-accent-ink text-accent-ink" : "fill-secondary-soft text-secondary"}
          />
        );
      })}
    </div>
  );
}
