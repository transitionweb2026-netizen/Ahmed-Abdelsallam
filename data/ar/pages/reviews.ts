import { heroImage } from "@/data/shared/hero-image";
import type { ReviewsPageContent } from "@/types/content";

/**
 * /reviews ("Reviews & FAQs") copy. Reviews and questions come from
 * data/reviews.ts and data/faqs.ts.
 *
 * PLACEHOLDER CONTENT — draft wording. The reviews themselves are fictional
 * layout placeholders; see data/reviews.ts.
 */
export const reviewsPage: ReviewsPageContent = {
  seo: {
    title: "الآراء والأسئلة الشائعة",
    description:
      "آراء المرضى وإجابات الأسئلة الشائعة حول الحجز والزيارة الأولى والمتابعة في عيادة د. أحمد عبد السلام.",
  },

  hero: {
    eyebrow: "الآراء والأسئلة الشائعة",
    title: [
      { text: "تجارب المرضى", breakAfter: true },
      { text: "وإجابات أسئلتك", accent: true },
    ],
    description:
      "اقرأ انطباعات المرضى عن تجربة الاستشارة والمتابعة، وتعرّف على إجابات أكثر الأسئلة تكرارًا قبل الزيارة وبعدها.",
    primaryCta: { label: "آراء المرضى", href: "#reviews" },
    secondaryCta: { label: "الأسئلة الشائعة", href: "#faq" },
    image: heroImage("reviews", "أيدٍ تستعرض ملفًا على جهاز لوحي داخل العيادة", {
      desktop: "40% center",
      mobile: "center top",
    }),
    floatingCards: [
      { icon: "messages", title: "تجارب المرضى", text: "انطباعات عن الرعاية والمتابعة" },
      { icon: "info", title: "إجابات واضحة", text: "قبل الزيارة وبعدها" },
    ],
    scrollCueLabel: "اقرأ الآراء",
  },

  reviews: {
    heading: {
      eyebrow: "آراء المرضى",
      title: [{ text: "تجارب" }, { text: "المرضى", accent: true }],
      description: "انطباعات المرضى عن تجربة الاستشارة والتشخيص والمتابعة.",
    },
  },

  faq: {
    heading: {
      eyebrow: "الأسئلة الشائعة",
      title: [{ text: "إجابات" }, { text: "أسئلتك", accent: true }],
      description: "كل ما تحتاج معرفته عن الحجز والزيارة الأولى والمتابعة.",
    },
    help: {
      title: "لم تجد إجابة سؤالك؟",
      text: "أرسل سؤالك عبر واتساب أو اتصل بنا، وسنرد عليك في أقرب وقت ممكن.",
      whatsappLabel: "اسأل عبر واتساب",
      whatsappMessage: "مرحبًا، لدي سؤال قبل حجز الموعد:",
      callLabel: "اتصل بنا",
    },
  },
};
