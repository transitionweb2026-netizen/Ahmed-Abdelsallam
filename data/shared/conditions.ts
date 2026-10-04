import type { ConditionBase } from "@/types/content";

/**
 * Conditions — language-neutral fields. Text lives in
 * data/{ar,en}/conditions.ts, keyed by slug. The first four are `featured`
 * on the homepage; all of them appear on /services.
 *
 * Images: /images/conditions/<slug>.jpg, 4:3 at 1200×900 (placeholder stock
 * photos, credits in README.md).
 */
export const conditionBase = [
  { slug: "joint-pain", icon: "bone", featured: true, order: 1 },
  { slug: "back-pain", icon: "spine", featured: true, order: 2 },
  { slug: "sports-injuries", icon: "activity", featured: true, order: 3 },
  { slug: "stiffness-osteoarthritis", icon: "personStanding", featured: true, order: 4 },
  { slug: "herniated-disc", icon: "spine", order: 5 },
  { slug: "frozen-shoulder", icon: "shoulder", order: 6 },
  { slug: "carpal-tunnel", icon: "hand", order: 7 },
  { slug: "osteoporosis", icon: "bone", order: 8 },
] as const satisfies readonly ConditionBase[];

export type ConditionSlug = (typeof conditionBase)[number]["slug"];
