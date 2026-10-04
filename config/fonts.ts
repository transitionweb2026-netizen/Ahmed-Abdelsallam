import type { Locale } from "@/i18n/config";

/**
 * Font files each language preloads (the faces its first paint needs). The
 * @font-face rules live in app/fonts.css; keep both in sync when a file is
 * replaced. Other subsets (Latin digits on Arabic pages, latin-ext) load on
 * demand through unicode-range.
 */
export const fontPreloads: Record<Locale, readonly string[]> = {
  ar: [
    "/fonts/ibm-plex-sans-arabic-400-arabic.4ed189e8.woff2",
    "/fonts/ibm-plex-sans-arabic-500-arabic.bf2b68e7.woff2",
    "/fonts/ibm-plex-sans-arabic-600-arabic.0ccee444.woff2",
    "/fonts/ibm-plex-sans-arabic-700-arabic.c6e0419c.woff2",
  ],
  en: ["/fonts/ibm-plex-sans-latin.e2291e84.woff2"],
};
