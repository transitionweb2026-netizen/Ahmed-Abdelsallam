import type { ReviewBase } from "@/types/content";

/**
 * Reviews — language-neutral fields. Names and texts live in
 * data/{ar,en}/reviews.ts, keyed by id.
 *
 * PLACEHOLDER CONTENT — these are NOT real patients or real reviews.
 */
export const reviewBase = [
  { id: "review-1", rating: 5, featured: true },
  { id: "review-2", rating: 5, featured: true },
  { id: "review-3", rating: 5, featured: true },
  { id: "review-4", rating: 4, featured: true },
  { id: "review-5", rating: 5 },
  { id: "review-6", rating: 5 },
  { id: "review-7", rating: 4 },
  { id: "review-8", rating: 5 },
] as const satisfies readonly ReviewBase[];

export type ReviewId = (typeof reviewBase)[number]["id"];
