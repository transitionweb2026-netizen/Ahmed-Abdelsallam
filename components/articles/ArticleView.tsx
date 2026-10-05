import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { ArticleMeta, CategoryChip } from "@/components/articles/ArticleMeta";
import { useSite } from "@/components/i18n/LocaleProvider";
import { GlassButton } from "@/components/ui/GlassButton";
import type { ArticleBlock, ArticleWithMeta } from "@/types/content";
import styles from "./ArticleView.module.css";

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className={styles.paragraph}>{block.text}</p>;
    case "heading":
      return <h3 className={styles.heading}>{block.text}</h3>;
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={block.ordered ? styles.ordered : styles.bullets}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </List>
      );
    }
    case "callout": {
      const CalloutIcon = block.tone === "warning" ? TriangleAlert : Lightbulb;
      return (
        <aside className={styles.callout} data-tone={block.tone} aria-label={block.title}>
          <span className={styles.calloutIcon} aria-hidden="true">
            <CalloutIcon size={20} strokeWidth={2} />
          </span>
          <div>
            <p className={styles.calloutTitle}>{block.title}</p>
            <p className={styles.calloutText}>{block.text}</p>
          </div>
        </aside>
      );
    }
  }
}

interface ArticleViewProps {
  article: ArticleWithMeta;
  /** id of the title; the dialog is labelled by it. */
  titleId: string;
  disclaimer: string;
  ctaLabel: string;
}

/**
 * The complete article, rendered inside the shared Modal: cover, category,
 * date and reading time, then every body block in full — never truncated.
 */
export function ArticleView({ article, titleId, disclaimer, ctaLabel }: ArticleViewProps) {
  const { bookingHref } = useSite();
  return (
    <article className={styles.view}>
      <header>
        <div className={styles.media}>
          <Image
            src={article.image.src}
            alt={article.image.alt}
            fill
            sizes="(min-width: 640px) 880px, 100vw"
            className={styles.image}
            style={{ objectPosition: article.image.objectPosition }}
          />
          <span className={styles.mediaTint} aria-hidden="true" />
        </div>
        <div className={styles.head}>
          <CategoryChip>{article.category}</CategoryChip>
          <h2 id={titleId} className={styles.title}>
            {article.title}
          </h2>
          <ArticleMeta article={article} />
          <p className={styles.excerpt}>{article.excerpt}</p>
        </div>
      </header>

      <div className={styles.content}>
        {article.body.map((block, index) => (
          <Block key={`${block.type}-${index}`} block={block} />
        ))}
      </div>

      <footer className={styles.footer}>
        <p className={styles.disclaimer}>
          <Info size={16} aria-hidden="true" />
          {disclaimer}
        </p>
        <GlassButton href={bookingHref}>{ctaLabel}</GlassButton>
      </footer>
    </article>
  );
}
