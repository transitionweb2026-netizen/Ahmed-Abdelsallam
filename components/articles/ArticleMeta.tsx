"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import { useDictionary, useLocale } from "@/components/i18n/LocaleProvider";
import { formatDate, plural } from "@/i18n/format";
import { cn } from "@/lib/utils";
import type { ArticleWithMeta } from "@/types/content";
import styles from "./ArticleMeta.module.css";

/** Date · reading time, shared by cards, the featured article and the reader. */
export function ArticleMeta({ article, className }: { article: ArticleWithMeta; className?: string }) {
  const locale = useLocale();
  const t = useDictionary();
  return (
    <p className={cn(styles.meta, className)}>
      <span className={styles.item}>
        <CalendarDays size={15} aria-hidden="true" />
        <time dateTime={article.publishedAt}>{formatDate(locale, article.publishedAt)}</time>
      </span>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.item}>
        <Clock3 size={15} aria-hidden="true" />
        {/* Plural rules per language, e.g. Arabic 1 → "دقيقة واحدة", 2 → "دقيقتان". */}
        <span>{plural(locale, article.readingMinutes, t.articles.readingTime)}</span>
      </span>
    </p>
  );
}

/** Lavender glass category chip. */
export function CategoryChip({ children, className }: { children: string; className?: string }) {
  return <span className={cn(styles.category, className)}>{children}</span>;
}
