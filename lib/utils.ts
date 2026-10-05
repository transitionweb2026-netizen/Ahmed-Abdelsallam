import { siteConfig } from "@/config/site";
import type { ContactSettings } from "@/lib/cms/content-map";

type ClassValue = string | false | null | undefined;

/** Joins truthy class names. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Western digits in both languages (see `siteConfig.numberLocale`). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(siteConfig.numberLocale).format(value);
}

/** WhatsApp chat link for the configured number (CMS settings), with an optional message. */
export function whatsappUrl(contact: ContactSettings, message?: string): string {
  const base = `https://wa.me/${contact.whatsappDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function phoneHref(contact: ContactSettings): string {
  return `tel:+${contact.phoneDigits}`;
}

/** Human-readable phone number, e.g. "+20 100 123 4567". */
export function phoneDisplay(contact: ContactSettings): string {
  const { phoneDigits, isPlaceholder, placeholderDisplay } = contact;
  if (isPlaceholder) return placeholderDisplay;
  if (phoneDigits.startsWith("20") && phoneDigits.length === 12) {
    return `+20 ${phoneDigits.slice(2, 5)} ${phoneDigits.slice(5, 8)} ${phoneDigits.slice(8)}`;
  }
  return `+${phoneDigits}`;
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}
