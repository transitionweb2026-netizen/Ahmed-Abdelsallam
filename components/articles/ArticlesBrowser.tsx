"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleView } from "@/components/articles/ArticleView";
import { Modal } from "@/components/modal/Modal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { useHashDialog } from "@/hooks/useHashDialog";
import type { ArticlesPageContent, ArticleWithMeta } from "@/types/content";
import styles from "./ArticlesBrowser.module.css";

interface ArticlesBrowserProps {
  featured: ArticleWithMeta;
  articles: ArticleWithMeta[];
  copy: Pick<ArticlesPageContent, "featuredLabel" | "moreTitle" | "readLabel" | "dialog">;
}

const anchor = (article: ArticleWithMeta) => `article-${article.slug}`;

/**
 * Featured article + article grid. Any card opens the full article in the
 * shared dialog; `/articles#article-<slug>` deep-links into it.
 */
export function ArticlesBrowser({ featured, articles, copy }: ArticlesBrowserProps) {
  const all = useMemo(() => [featured, ...articles], [featured, articles]);
  const ids = useMemo(() => all.map(anchor), [all]);
  const { activeId, open, close } = useHashDialog(ids);
  const active = all.find((article) => anchor(article) === activeId);

  // Keep the last article rendered while the dialog animates out.
  const [shown, setShown] = useState(active);
  if (active && active !== shown) setShown(active);

  return (
    <>
      <Reveal variant="up" amount={0.2} id={anchor(featured)} className={styles.featured}>
        <ArticleCard
          article={featured}
          variant="featured"
          badge={copy.featuredLabel}
          headingLevel="h3"
          readLabel={copy.readLabel}
          onOpen={() => open(anchor(featured))}
        />
      </Reveal>

      <h3 className={styles.moreTitle}>
        <span>{copy.moreTitle}</span>
      </h3>

      <RevealGroup as="ul" className={styles.grid} stagger={0.1}>
        {articles.map((article) => (
          <RevealItem as="li" key={article.slug} id={anchor(article)} variant="up">
            <ArticleCard
              article={article}
              headingLevel="h4"
              readLabel={copy.readLabel}
              onOpen={() => open(anchor(article))}
            />
          </RevealItem>
        ))}
      </RevealGroup>

      <Modal
        open={Boolean(active)}
        onClose={close}
        labelledBy="article-dialog-title"
        contentKey={shown?.slug}
        returnFocus={() => (shown ? document.getElementById(anchor(shown))?.querySelector("button") : null)}
      >
        {shown ? (
          <ArticleView
            article={shown}
            titleId="article-dialog-title"
            disclaimer={copy.dialog.disclaimer}
            ctaLabel={copy.dialog.ctaLabel}
          />
        ) : null}
      </Modal>
    </>
  );
}
