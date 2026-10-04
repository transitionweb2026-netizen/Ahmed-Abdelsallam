import type { ServiceSlug } from "@/data/shared/services";
import type { SpecialtyBase } from "@/types/content";

/**
 * Key specialties on the About page — language-neutral fields. Each card
 * opens the dialog of `service` on /services. Text lives in
 * data/{ar,en}/specialties.ts, keyed by slug.
 *
 * Images: /images/specialties/<slug>.jpg, 4:3 at 1200×900 (placeholder stock
 * photos, credits in README.md).
 */
export const specialtyBase = [
  { slug: "knee-joints", icon: "bone", service: "knee-joint-pain", order: 1 },
  { slug: "spine", icon: "spine", service: "spine-back-pain", order: 2 },
  { slug: "sports-rehab", icon: "activity", service: "sports-injuries", order: 3 },
  { slug: "fractures-trauma", icon: "boneFracture", service: "fractures", order: 4 },
] as const satisfies readonly (SpecialtyBase & { service: ServiceSlug })[];

export type SpecialtySlug = (typeof specialtyBase)[number]["slug"];
