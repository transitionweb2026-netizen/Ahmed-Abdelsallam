import type { CareerStepBase } from "@/types/content";

/**
 * Career journey on the About page — language-neutral fields. Text lives in
 * data/{ar,en}/career.ts, keyed by id.
 *
 * PLACEHOLDER CONTENT — generic stages only; years, institutions and
 * positions are intentionally left blank.
 */
export const careerBase = [
  { id: "education", icon: "graduationCap" },
  { id: "training", icon: "stethoscope" },
  { id: "specialization", icon: "bone" },
  { id: "development", icon: "award" },
  { id: "practice", icon: "heartHandshake" },
] as const satisfies readonly CareerStepBase[];

export type CareerStepId = (typeof careerBase)[number]["id"];
