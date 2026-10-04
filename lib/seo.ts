import type { Metadata } from "next";
import { siteIdentity } from "@/config/site";
import { defaultLocale, localeSettings, localizeHref, locales, type Locale } from "@/i18n/config";

interface PageMetadataInput {
  locale: Locale;
  title: string;
  description: string;
  /** Path without the language prefix, e.g. "/about" (the home page is "/"). */
  path: string;
  /** Use `title` as-is instead of "title | site name". */
  absoluteTitle?: boolean;
}

/** Equivalent URLs of a page in every language, plus x-default (Arabic). */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, localizeHref(path, locale)])),
    "x-default": localizeHref(path, defaultLocale),
  };
}

/**
 * Page-level metadata: title, description, self-referencing canonical,
 * reciprocal hreflang alternates (ar, en, x-default), Open Graph and
 * Twitter card in the page's language. Next.js replaces (does not merge)
 * nested objects such as `openGraph`, so every field is set here.
 */
export function pageMetadata({ locale, title, description, path, absoluteTitle = false }: PageMetadataInput): Metadata {
  const identity = siteIdentity[locale];
  const fullTitle = absoluteTitle ? title : `${title} | ${identity.name}`;
  const url = localizeHref(path, locale);
  const og = identity.ogImage;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      url,
      locale: localeSettings[locale].ogLocale,
      alternateLocale: locales.filter((other) => other !== locale).map((other) => localeSettings[other].ogLocale),
      siteName: identity.name,
      title: fullTitle,
      description,
      images: [{ url: og.src, width: og.width, height: og.height, alt: identity.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [og.src],
    },
  };
}
