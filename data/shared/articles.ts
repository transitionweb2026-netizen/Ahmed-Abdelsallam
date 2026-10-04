import type { ArticleBase } from "@/types/content";

/**
 * Articles — language-neutral fields. Titles, categories and bodies live in
 * data/{ar,en}/articles.ts, keyed by slug.
 *
 * Covers: /images/articles/<slug>.jpg, 16:10 at 1600×1000 (placeholder stock
 * photos, credits in README.md). PLACEHOLDER dates.
 */
export const articleBase = [
  { slug: "knee-osteoarthritis", publishedAt: "2026-09-18", featured: true, order: 1 },
  { slug: "lower-back-pain", publishedAt: "2026-09-04", order: 2 },
  { slug: "sports-first-aid", publishedAt: "2026-08-21", order: 3 },
  { slug: "bone-health", publishedAt: "2026-08-07", order: 4 },
  { slug: "sitting-posture", publishedAt: "2026-07-24", order: 5 },
  { slug: "physiotherapy-recovery", publishedAt: "2026-07-10", order: 6 },
  { slug: "mri-guide", publishedAt: "2026-06-26", order: 7 },
] as const satisfies readonly ArticleBase[];

export type ArticleSlug = (typeof articleBase)[number]["slug"];
