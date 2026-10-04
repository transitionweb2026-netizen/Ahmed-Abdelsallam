import { localeSettings, type Locale } from "@/i18n/config";

/** Fills "{name}" placeholders: interpolate("Video {current} of {total}", {...}). */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Plural variants keyed by CLDR category ("one", "two", "few", "many", "other"). */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** Picks the right plural form for `count` and fills "{count}". */
export function plural(locale: Locale, count: number, forms: PluralForms): string {
  const category = new Intl.PluralRules(locale).select(count);
  return interpolate(forms[category] ?? forms.other, { count });
}

const dateFormatters = new Map<Locale, Intl.DateTimeFormat>();

/** "2026-09-18" → "18 سبتمبر 2026" / "September 18, 2026". */
export function formatDate(locale: Locale, isoDate: string): string {
  let formatter = dateFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(localeSettings[locale].dateLocale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      // Dates are stored as calendar days; UTC keeps server and browser output
      // identical whatever their time zones (no hydration mismatch).
      timeZone: "UTC",
    });
    dateFormatters.set(locale, formatter);
  }
  return formatter.format(new Date(`${isoDate}T00:00:00Z`));
}
