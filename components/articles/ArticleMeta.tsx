import { CalendarDays, Clock3 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { ArticleWithMeta } from "@/types/content";
import styles from "./ArticleMeta.module.css";

/** Arabic number agreement: 1 → "دقيقة واحدة", 2 → "دقيقتان", 3–10 → "n دقائق", 11+ → "n دقيقة". */
function readingTime(minutes: number): string {
  if (minutes <= 1) return "دقيقة واحدة";
  if (minutes === 2) return "دقيقتان";
  return `${minutes} ${minutes <= 10 ? "دقائق" : "دقيقة"}`;
}

/** Date · reading time, shared by cards, the featured article and the reader. */
export function ArticleMeta({ article, className }: { article: ArticleWithMeta; className?: string }) {
  return (
    <p className={cn(styles.meta, className)}>
      <span className={styles.item}>
        <CalendarDays size={15} aria-hidden="true" />
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </span>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.item}>
        <Clock3 size={15} aria-hidden="true" />
        <span>{readingTime(article.readingMinutes)} للقراءة</span>
      </span>
    </p>
  );
}

/** Lavender glass category chip. */
export function CategoryChip({ children, className }: { children: string; className?: string }) {
  return <span className={cn(styles.category, className)}>{children}</span>;
}
