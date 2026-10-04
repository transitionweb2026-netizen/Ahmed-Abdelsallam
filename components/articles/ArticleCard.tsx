import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { ArticleMeta, CategoryChip } from "@/components/articles/ArticleMeta";
import { cn } from "@/lib/utils";
import type { ArticleWithMeta } from "@/types/content";
import styles from "./ArticleCard.module.css";

interface ArticleCardProps {
  article: ArticleWithMeta;
  readLabel: string;
  onOpen: () => void;
  /** "featured": the large horizontal card at the top of /articles. */
  variant?: "default" | "featured";
  /** Badge on the featured card, e.g. "Featured article". */
  badge?: string;
  headingLevel?: "h2" | "h3" | "h4";
  sizes?: string;
}

/**
 * Article teaser in the site's glass-tile language. The title is a button
 * stretched over the whole card; activating it opens the full article in
 * the shared dialog.
 */
export function ArticleCard({
  article,
  readLabel,
  onOpen,
  variant = "default",
  badge,
  headingLevel: Heading = "h3",
  sizes = "(min-width: 1280px) 400px, (min-width: 640px) 46vw, 92vw",
}: ArticleCardProps) {
  const featured = variant === "featured";
  return (
    <article className={cn(styles.card, featured && styles.featured, "group")}>
      <span className="glass-sheen" aria-hidden="true" />
      <div className={styles.media}>
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes={featured ? "(min-width: 1024px) 700px, 92vw" : sizes}
          className={styles.image}
          style={{ objectPosition: article.image.objectPosition }}
        />
        <span className={styles.mediaTint} aria-hidden="true" />
        <CategoryChip className={styles.category}>{article.category}</CategoryChip>
      </div>

      <div className={styles.body}>
        {featured && badge ? <span className={styles.badge}>{badge}</span> : null}
        <ArticleMeta article={article} />
        <Heading className={cn(featured ? styles.featuredTitle : "type-h3", styles.title)}>
          <button type="button" className={styles.open} onClick={onOpen} aria-haspopup="dialog">
            {article.title}
          </button>
        </Heading>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <span className={styles.read} aria-hidden="true">
          {readLabel}
          <span className={styles.readIcon}>
            <ArrowLeft size={16} strokeWidth={2.2} />
          </span>
        </span>
      </div>
    </article>
  );
}
