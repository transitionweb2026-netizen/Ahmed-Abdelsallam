import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";
import type { Faq } from "@/types/content";

/**
 * JSON-LD builders. Only facts that are already configured are emitted —
 * placeholder contact details are left out so search engines never index
 * them.
 */
export function physicianJsonLd() {
  const { contact, socials } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": absoluteUrl("/#physician"),
    name: siteConfig.name,
    alternateName: siteConfig.nameLatin,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    image: absoluteUrl(siteConfig.ogImage.src),
    medicalSpecialty: "https://schema.org/Musculoskeletal",
    inLanguage: siteConfig.language,
    ...(contact.isPlaceholder ? {} : { telephone: `+${contact.phoneDigits}` }),
    ...(siteConfig.socialsArePlaceholder ? {} : { sameAs: socials.map((s) => s.href) }),
  };
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Serialises JSON-LD safely for inline <script> tags. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
