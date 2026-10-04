import type { ServiceBase } from "@/types/content";

/**
 * Services — language-neutral fields. Titles, descriptions, image alt text
 * and dialog details live in data/{ar,en}/services.ts, keyed by slug.
 * Entries flagged `featured` appear on the homepage (in `order`).
 *
 * Images: /images/services/<slug>.jpg, 4:3 at 1200×900 (placeholder stock
 * photos, credits in README.md).
 */
export const serviceBase = [
  { slug: "knee-joint-pain", icon: "bone", featured: true, order: 1 },
  { slug: "spine-back-pain", icon: "spine", featured: true, order: 2 },
  { slug: "sports-injuries", icon: "activity", featured: true, order: 3 },
  { slug: "fractures", icon: "boneFracture", featured: true, order: 4 },
  { slug: "shoulder-pain", icon: "shoulder", order: 5 },
  { slug: "osteoarthritis", icon: "personStanding", order: 6 },
  { slug: "hand-wrist", icon: "hand", order: 7 },
  { slug: "foot-ankle", icon: "footprints", order: 8 },
] as const satisfies readonly ServiceBase[];

export type ServiceSlug = (typeof serviceBase)[number]["slug"];
