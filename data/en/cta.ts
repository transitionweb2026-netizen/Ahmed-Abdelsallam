import { routes } from "@/config/routes";
import type { SiteCtaContent } from "@/types/content";

/**
 * The site-wide call-to-action band shown at the end of every page —
 * English. Pages can override any field (the contact page swaps the actions
 * so it never repeats the contact options already on the page).
 *
 * PLACEHOLDER CONTENT — draft wording; the image is placeholder art.
 */
export const siteCta: SiteCtaContent = {
  eyebrow: "Get started",
  title: [{ text: "Your first step toward" }, { text: "easier movement", accent: true }],
  description:
    "Get in touch to book a consultation — we'll help you find a convenient time and answer your questions before your visit.",
  primaryAction: {
    kind: "whatsapp",
    label: "Chat on WhatsApp",
    message: "Hello, I'd like to book a consultation with Dr. Ahmed Abdelsalam.",
  },
  secondaryAction: { kind: "link", label: "Contact us", href: routes.contact },
  image: {
    src: "/images/doctor/doctor-cutout.png",
    alt: "Dr. Ahmed Abdelsalam (placeholder image)",
    width: 1000,
    height: 1250,
  },
};
