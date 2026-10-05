import "server-only";
import type { Metadata } from "next";
import { defaultLocale, localeSettings, localizeHref, locales, type Locale } from "@/i18n/config";
import { getPageSeo, getSite } from "@/lib/content";

interface PageMetadataInput {
  locale: Locale;
  /** CMS page key (pages table), e.g. "about". */
  page: string;
  /** Path without the language prefix, e.g. "/about" (the home page is "/"). */
  path: string;
  /** Use the title as-is instead of "title | site name". */
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
 * Page-level metadata from the CMS: title, description, self-referencing
 * canonical, reciprocal hreflang alternates (ar, en, x-default), Open Graph
 * and Twitter card in the page's language, and `noindex` when indexing is
 * switched off for the page or the whole site. Next.js replaces (does not
 * merge) nested objects such as `openGraph`, so every field is set here.
 */
export async function pageMetadata({ locale, page, path, absoluteTitle = false }: PageMetadataInput): Promise<Metadata> {
  const [site, seo] = await Promise.all([getSite(locale), getPageSeo(locale, page)]);
  const { identity } = site;
  const fullTitle = absoluteTitle ? seo.title : `${seo.title} | ${identity.name}`;
  const url = localizeHref(path, locale);
  const og = seo.ogImage ?? identity.ogImage;
  const indexable = site.robotsIndex && seo.index;
  return {
    title: absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      url,
      locale: localeSettings[locale].ogLocale,
      alternateLocale: locales.filter((other) => other !== locale).map((other) => localeSettings[other].ogLocale),
      siteName: identity.name,
      title: fullTitle,
      description: seo.description,
      images: [{ url: og.src, width: og.width, height: og.height, alt: identity.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: seo.description,
      images: [og.src],
    },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
  };
}
