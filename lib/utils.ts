import { siteConfig } from "@/config/site";

type ClassValue = string | false | null | undefined;

/** Joins truthy class names. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(siteConfig.numberLocale).format(value);
}

const dateFormatter = new Intl.DateTimeFormat(siteConfig.dateLocale, {
  day: "numeric",
  month: "long",
  year: "numeric",
  // Dates are stored as calendar days; UTC keeps server and browser output
  // identical whatever their time zones (no hydration mismatch).
  timeZone: "UTC",
});

/** "2026-09-18" → "18 سبتمبر 2026". */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsappDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function phoneHref(): string {
  return `tel:+${siteConfig.contact.phoneDigits}`;
}

/** Human-readable phone number, e.g. "+20 100 123 4567". */
export function phoneDisplay(): string {
  const { phoneDigits, isPlaceholder, placeholderDisplay } = siteConfig.contact;
  if (isPlaceholder) return placeholderDisplay;
  if (phoneDigits.startsWith("20") && phoneDigits.length === 12) {
    return `+20 ${phoneDigits.slice(2, 5)} ${phoneDigits.slice(5, 8)} ${phoneDigits.slice(8)}`;
  }
  return `+${phoneDigits}`;
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}
