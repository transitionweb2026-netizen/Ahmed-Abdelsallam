import type { SocialLink } from "@/types/content";

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

export const siteConfig = {
  name: "د. أحمد عبد السلام",
  nameLatin: "Dr. Ahmed Abdelsalam",
  role: "طبيب العظام",
  /** Default <title> and fallback description for pages without their own. */
  title: "د. أحمد عبد السلام | طبيب العظام",
  description:
    "الموقع الرسمي لـ د. أحمد عبد السلام، طبيب العظام. تعرّف على الخدمات، والحالات التي تستدعي الفحص، ورحلة المريض، واحجز استشارتك بسهولة.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "ar_EG",
  language: "ar",
  direction: "rtl" as const,
  /** Western digits read naturally on most Arabic medical sites; use "ar-EG" for Arabic-Indic digits. */
  numberLocale: "en-US",
  ogImage: { src: "/images/og/og-default.jpg", width: 1200, height: 630 },
  contact: {
    phoneDigits,
    whatsappDigits,
    isPlaceholder: phoneDigits === PLACEHOLDER_PHONE,
    /** Shown instead of the digits while the placeholder is in use. */
    placeholderDisplay: "+20 1XX XXX XXXX",
  },
  // Placeholder profile URLs — replace with the doctor's real accounts,
  // then set `socialsArePlaceholder` to false so they reach structured data.
  socialsArePlaceholder: true,
  socials: [
    { platform: "facebook", href: "https://www.facebook.com/", label: "فيسبوك" },
    { platform: "instagram", href: "https://www.instagram.com/", label: "إنستجرام" },
    { platform: "youtube", href: "https://www.youtube.com/", label: "يوتيوب" },
  ] satisfies SocialLink[],
} as const;

export type SiteConfig = typeof siteConfig;
