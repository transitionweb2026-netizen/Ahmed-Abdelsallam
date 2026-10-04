import type { Locale } from "@/i18n/config";
import type { SocialPlatform } from "@/types/content";

/**
 * Site-wide configuration. Contact details are read from environment
 * variables (see `.env.example`); the fallbacks below are deliberately
 * non-working placeholders — replace them before launch.
 */

// Placeholder only: not a real number. Keep digits-only, international format.
const PLACEHOLDER_PHONE = "200000000000";

// `||` (not `??`) so empty values copied from .env.example fall back too.
const phoneDigits = (process.env.NEXT_PUBLIC_PHONE_NUMBER || PLACEHOLDER_PHONE).replace(/\D/g, "");
const whatsappDigits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || phoneDigits).replace(/\D/g, "");

/** Language-neutral settings. */
export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  /** Western digits in both languages; use "ar-EG" for Arabic-Indic digits. */
  numberLocale: "en-US",
  contact: {
    phoneDigits,
    whatsappDigits,
    isPlaceholder: phoneDigits === PLACEHOLDER_PHONE,
    /** Shown instead of the digits while the placeholder is in use. */
    placeholderDisplay: "+20 1XX XXX XXXX",
  },
  // Placeholder profile URLs — replace with the doctor's real accounts,
  // then set `socialsArePlaceholder` to false so they reach structured data.
  // Visible labels come from the interface dictionary (`t.socials`).
  socialsArePlaceholder: true,
  socials: [
    { platform: "facebook", href: "https://www.facebook.com/" },
    { platform: "instagram", href: "https://www.instagram.com/" },
    { platform: "youtube", href: "https://www.youtube.com/" },
  ] satisfies { platform: SocialPlatform; href: string }[],
} as const;

export interface SiteIdentity {
  name: string;
  role: string;
  /** Default <title> and fallback description for pages without their own. */
  title: string;
  description: string;
  /** Social share image (contains text, so one per language). */
  ogImage: { src: string; width: number; height: number };
}

/**
 * The doctor's name, role and site description in each language.
 * "Orthopedic Doctor" mirrors the Arabic «طبيب العظام»; change both if the
 * doctor prefers a different title (for example "Orthopedic Surgeon").
 */
export const siteIdentity: Record<Locale, SiteIdentity> = {
  ar: {
    name: "د. أحمد عبد السلام",
    role: "طبيب العظام",
    title: "د. أحمد عبد السلام | طبيب العظام",
    description:
      "الموقع الرسمي لـ د. أحمد عبد السلام، طبيب العظام. تعرّف على الخدمات، والحالات التي تستدعي الفحص، ورحلة المريض، واحجز استشارتك بسهولة.",
    ogImage: { src: "/images/og/og-default.jpg", width: 1200, height: 630 },
  },
  en: {
    name: "Dr. Ahmed Abdelsalam",
    role: "Orthopedic Doctor",
    title: "Dr. Ahmed Abdelsalam | Orthopedic Doctor",
    description:
      "The official website of Dr. Ahmed Abdelsalam, orthopedic doctor. Explore his services, the conditions that warrant a check-up and the patient journey, and book your consultation with ease.",
    ogImage: { src: "/images/og/og-default-en.jpg", width: 1200, height: 630 },
  },
};
