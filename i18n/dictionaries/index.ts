import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { ar } from "./ar";
import { en } from "./en";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

/** Interface strings for a locale. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
