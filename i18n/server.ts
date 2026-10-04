import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * The current request's locale — the `[lang]` root segment — readable from
 * any Server Component without passing props down. (Client Components use
 * `useLocale()` / `useDictionary()` from components/i18n/LocaleProvider.)
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

/** `{ locale, t }` for the current request, where `t` is the interface dictionary. */
export async function getI18n(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
