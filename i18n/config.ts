/**
 * Languages, URL prefixes and direction. Every page lives under
 * `/{locale}/...` (app/[lang]); proxy.ts sends unprefixed URLs to the
 * visitor's saved language, or Arabic by default.
 */
export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

/** Remembers an explicit language choice; read by proxy.ts for unprefixed URLs. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface LocaleSettings {
  dir: "rtl" | "ltr";
  /** Open Graph locale. */
  ogLocale: string;
  /** Intl locale for dates (Western digits in both languages). */
  dateLocale: string;
  /** Short label shown in the language toggle. */
  short: string;
  /** The language's own name, for screen readers and tooltips. */
  nativeName: string;
}

export const localeSettings: Record<Locale, LocaleSettings> = {
  ar: { dir: "rtl", ogLocale: "ar_EG", dateLocale: "ar-EG-u-nu-latn", short: "AR", nativeName: "العربية" },
  en: { dir: "ltr", ogLocale: "en_US", dateLocale: "en-US", short: "EN", nativeName: "English" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Splits "/en/about" into { locale: "en", path: "/about" } ("/en" → path "/"). */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) return { locale: first, path: `/${rest.join("/")}` };
  return { locale: null, path: pathname || "/" };
}

/**
 * Prefixes an internal path with a locale: ("/services#faq", "en") →
 * "/en/services#faq". Hash-only, relative, external and already-prefixed
 * hrefs are returned unchanged.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const suffix = cut === -1 ? "" : href.slice(cut);
  if (splitLocale(path).locale) return href;
  return `/${locale}${path === "/" ? "" : path}${suffix}`;
}

/** The same page in another language: ("/ar/services", "en") → "/en/services". */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizeHref(splitLocale(pathname).path, target);
}
