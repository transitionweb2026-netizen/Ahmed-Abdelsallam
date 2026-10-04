import { routes } from "@/config/routes";
import { siteConfig, siteIdentity } from "@/config/site";
import { localizeHref, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { absoluteUrl } from "@/lib/utils";
import type { Faq } from "@/types/content";

/**
 * JSON-LD builders, in the page's language. Only facts that are already
 * configured are emitted — placeholder contact details are left out so
 * search engines never index them.
 */
export function physicianJsonLd(locale: Locale) {
  const { contact, socials } = siteConfig;
  const identity = siteIdentity[locale];
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    // One entity across both languages.
    "@id": absoluteUrl("/#physician"),
    name: identity.name,
    alternateName: locales.filter((other) => other !== locale).map((other) => siteIdentity[other].name),
    description: identity.description,
    url: absoluteUrl(localizeHref(routes.home, locale)),
    image: absoluteUrl(identity.ogImage.src),
    medicalSpecialty: "https://schema.org/Musculoskeletal",
    inLanguage: locale,
    ...(contact.isPlaceholder ? {} : { telephone: `+${contact.phoneDigits}` }),
    ...(siteConfig.socialsArePlaceholder ? {} : { sameAs: socials.map((s) => s.href) }),
  };
}

export function faqJsonLd(items: Faq[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * Breadcrumb trail for an inner page: Home › `name`. Matches the visible
 * trail the hero renders in its eyebrow.
 */
export function breadcrumbJsonLd(locale: Locale, name: string, path: string) {
  const items = [
    { name: getDictionary(locale).nav.home, path: routes.home },
    { name, path },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizeHref(item.path, locale)),
    })),
  };
}

/** Serialises JSON-LD safely for inline <script> tags. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
