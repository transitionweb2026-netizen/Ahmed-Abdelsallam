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

/**
 * The site-wide default Open Graph image, deliberately a static file rather
 * than the CMS's Global Settings image — not read from and not affected by
 * that setting. A page's own CMS-set OG image (`seo.ogImage` below) still
 * takes priority over this when one is set.
 */
export const DEFAULT_OG_IMAGE: Record<Locale, { src: string; width: number; height: number }> = {
  ar: { src: "/images/og/og-default.jpg", width: 1200, height: 630 },
  en: { src: "/images/og/og-default-en.jpg", width: 1200, height: 630 },
};

/**
 * The admin dashboard's own Vercel deployment (admin.<domain>) renders the
 * exact same public-look-alike routes as the real site (there is no server
 * to run `output: 'export'` on, so nothing strips them there) — none of
 * those are the real public pages, so they must never be indexable no
 * matter what the CMS's own index toggle says. `follow: false` too: a
 * crawler should not chase links across this mirror either.
 */
export function resolvePageRobots(indexable: boolean): NonNullable<Metadata["robots"]> {
  if (process.env.DEPLOYMENT_TARGET === "admin") return { index: false, follow: false };
  return indexable ? { index: true, follow: true } : { index: false, follow: true };
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
  const og = seo.ogImage ?? DEFAULT_OG_IMAGE[locale];
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
    robots: resolvePageRobots(indexable),
  };
}
