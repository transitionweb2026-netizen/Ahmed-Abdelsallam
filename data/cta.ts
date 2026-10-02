import { routes } from "@/config/routes";
import type { SiteCtaContent } from "@/types/content";

/**
 * The site-wide call-to-action band shown at the end of every page. Pages
 * can override any field (the contact page swaps the actions so it never
 * repeats the contact options already on the page).
 *
 * PLACEHOLDER CONTENT — draft wording; the image is placeholder art.
 */
export const siteCta: SiteCtaContent = {
  eyebrow: "ابدأ الآن",
  title: [{ text: "خطوتك الأولى نحو" }, { text: "حركة أكثر راحة", accent: true }],
  description:
    "تواصل معنا لحجز موعد الاستشارة، وسنساعدك في اختيار الوقت المناسب والإجابة عن استفساراتك قبل الزيارة.",
  primaryAction: {
    kind: "whatsapp",
    label: "تواصل عبر واتساب",
    message: "مرحبًا، أرغب في حجز موعد استشارة مع د. أحمد عبد السلام.",
  },
  secondaryAction: { kind: "link", label: "تواصل معنا", href: routes.contact },
  image: {
    src: "/images/doctor/doctor-cutout.png",
    alt: "د. أحمد عبد السلام (صورة مؤقتة)",
    width: 1000,
    height: 1250,
  },
};
