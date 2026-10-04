import type { MetadataRoute } from "next";
import { mainNav } from "@/config/routes";
import { localizeHref, locales } from "@/i18n/config";
import { languageAlternates } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

/**
 * Every implemented page in both languages; each entry lists its
 * equivalents (hreflang ar / en / x-default). Flip `implemented` in
 * config/routes.ts as pages ship.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return mainNav
    .filter((item) => item.implemented)
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
