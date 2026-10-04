import type { QualificationBase } from "@/types/content";

/**
 * Qualifications & certifications on the About page — language-neutral
 * fields. Text lives in data/{ar,en}/qualifications.ts, keyed by id.
 *
 * PLACEHOLDER CONTENT — deliberately generic slots. Nothing here describes
 * a real degree, institution, year or certificate of the doctor. Replace
 * every field (and the artwork in /public/images/certificates) with the
 * verified details, then remove the page notes in data/{ar,en}/pages/about.ts.
 */
export const qualificationBase = [
  { id: "qualification-1", kind: "qualification", year: "20XX", certificate: 1, order: 1 },
  { id: "qualification-2", kind: "qualification", year: "20XX", certificate: 2, order: 2 },
  { id: "qualification-3", kind: "qualification", year: "20XX", certificate: 3, order: 3 },
  { id: "certification-1", kind: "certification", year: "20XX", certificate: 4, order: 4 },
  { id: "certification-2", kind: "certification", year: "20XX", certificate: 5, order: 5 },
  { id: "certification-3", kind: "certification", year: "20XX", certificate: 6, order: 6 },
] as const satisfies readonly QualificationBase[];

export type QualificationId = (typeof qualificationBase)[number]["id"];
