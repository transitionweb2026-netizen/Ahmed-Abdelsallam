import { routes } from "@/config/routes";
import { localizeHref, type Locale } from "@/i18n/config";
import type { SiteData } from "@/lib/cms/source";
import { absoluteUrl } from "@/lib/utils";
import type { Faq } from "@/types/content";

/** A social URL that is just a platform's home page is a placeholder, not a profile. */
const isProfileUrl = (href: string) => {
  try {
    return new URL(href).pathname.replace(/\/+$/, "") !== "";
  } catch {
    return false;
  }
};

/**
 * JSON-LD builders, in the page's language. Only facts that are configured
 * are emitted — placeholder phone numbers and social links are left out so
 * search engines never index them.
 */
export function physicianJsonLd(locale: Locale, site: SiteData, otherNames: string[]) {
  const { contact, identity } = site;
  const profiles = site.socials.map((s) => s.href).filter(isProfileUrl);
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    // One entity across both languages.
    "@id": absoluteUrl("/#physician"),
    name: identity.name,
    alternateName: otherNames,
    description: identity.description,
    url: absoluteUrl(localizeHref(routes.home, locale)),
    image: identity.ogImage.src.startsWith("http") ? identity.ogImage.src : absoluteUrl(identity.ogImage.src),
    medicalSpecialty: "https://schema.org/Musculoskeletal",
    inLanguage: locale,
    ...(contact.isPlaceholder ? {} : { telephone: `+${contact.phoneDigits}` }),
    ...(profiles.length ? { sameAs: profiles } : {}),
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
export function breadcrumbJsonLd(locale: Locale, homeLabel: string, name: string, path: string) {
  const items = [
    { name: homeLabel, path: routes.home },
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

