import type { FaqBase } from "@/types/content";

/**
 * FAQs — language-neutral fields. Questions and answers live in
 * data/{ar,en}/faqs.ts, keyed by id. `featured` entries show on the homepage.
 */
export const faqBase = [
  { id: "faq-booking", featured: true },
  { id: "faq-first-visit", featured: true },
  { id: "faq-duration", featured: true },
  { id: "faq-imaging", featured: true },
  { id: "faq-follow-up", featured: true },
  { id: "faq-whatsapp", featured: true },
  { id: "faq-reschedule" },
  { id: "faq-physiotherapy" },
  { id: "faq-sport-pain" },
  { id: "faq-remote" },
] as const satisfies readonly FaqBase[];

export type FaqId = (typeof faqBase)[number]["id"];
