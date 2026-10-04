import { routes } from "@/config/routes";
import { heroImage } from "@/data/shared/hero-image";
import type { ArticlesPageContent } from "@/types/content";

/**
 * /articles copy. The articles themselves live in data/articles.ts.
 *
 * PLACEHOLDER CONTENT — draft wording.
 */
export const articlesPage: ArticlesPageContent = {
  seo: {
    title: "المقالات الطبية",
    description:
      "مقالات طبية مبسّطة عن صحة العظام والمفاصل والعمود الفقري والإصابات الرياضية، تساعدك على فهم حالتك والعناية بنفسك.",
  },

  hero: {
    eyebrow: "المقالات",
    title: [
      { text: "اقرأ وافهم", breakAfter: true },
      { text: "صحة عظامك", accent: true },
    ],
    description:
      "مقالات مبسّطة تشرح المشكلات الشائعة في العظام والمفاصل، وتقدّم نصائح عملية للوقاية والعناية اليومية.",
    primaryCta: { label: "ابدأ القراءة", href: "#articles" },
    secondaryCta: { label: "احجز استشارتك", href: routes.contact },
    image: heroImage("articles", "كتب طبية وسماعة طبيب وقلم على مكتب", {
      desktop: "25% center",
      mobile: "center top",
    }),
    floatingCards: [
      { icon: "bookOpen", title: "محتوى مبسّط", text: "بلغة واضحة وسهلة" },
      { icon: "shieldPlus", title: "وقاية وعناية", text: "نصائح لحياتك اليومية" },
    ],
    scrollCueLabel: "اقرأ الآن",
  },

  heading: {
    eyebrow: "المكتبة الطبية",
    title: [{ text: "أحدث" }, { text: "المقالات", accent: true }],
    description: "اختر أي مقال لقراءته كاملًا دون مغادرة الصفحة.",
  },
  featuredLabel: "مقال مميز",
  moreTitle: "المزيد من المقالات",
  readLabel: "اقرأ المقال",

  dialog: {
    disclaimer: "هذا المقال للتوعية العامة ولا يغني عن الاستشارة الطبية. استشر طبيبك قبل اتخاذ أي قرار علاجي.",
    ctaLabel: "احجز استشارتك",
  },
};
