import type { MetadataRoute } from "next";
import { mainNav } from "@/config/routes";
import { localizeHref, locales } from "@/i18n/config";
import { getSnapshot } from "@/lib/content";
import { languageAlternates } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

/**
 * Every implemented page in both languages; each entry lists its
 * equivalents (hreflang ar / en / x-default). Pages switched to "noindex"
 * in the CMS (or the whole site, in Global settings) are left out.
 * Articles open in a dialog on /articles, so they have no URLs of their own.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const snapshot = await getSnapshot();
  if (snapshot.settings && !snapshot.settings.robots_index) return [];
  const noindex = new Set(snapshot.pages.filter((page) => !page.robots_index && page.path).map((page) => page.path));
  return mainNav
    .filter((item) => item.implemented && !noindex.has(item.href))
    .flatMap((item) => {
      const languages = Object.fromEntries(
        Object.entries(languageAlternates(item.href)).map(([lang, href]) => [lang, absoluteUrl(href)]),
      );
      return locales.map((locale) => ({
        url: absoluteUrl(localizeHref(item.href, locale)),
        changeFrequency: "monthly" as const,
        priority: item.href === "/" ? 1 : 0.7,
        alternates: { languages },
      }));
    });
}
