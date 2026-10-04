import { routes } from "@/config/routes";
import { heroImage } from "@/data/shared/hero-image";
import type { ArticlesPageContent } from "@/types/content";

/**
 * /articles copy — English. The articles themselves live in
 * data/{ar,en}/articles.ts.
 *
 * PLACEHOLDER CONTENT — draft wording.
 */
export const articlesPage: ArticlesPageContent = {
  seo: {
    title: "Medical Articles",
    description:
      "Easy-to-read medical articles about bone, joint and spine health and sports injuries, to help you understand your condition and look after yourself.",
  },

  hero: {
    eyebrow: "Articles",
    title: [
      { text: "Read and understand", breakAfter: true },
      { text: "your bone health", accent: true },
    ],
    description:
      "Easy-to-read articles that explain common bone and joint problems, with practical tips for prevention and everyday care.",
    primaryCta: { label: "Start reading", href: "#articles" },
    secondaryCta: { label: "Book a consultation", href: routes.contact },
    image: heroImage("articles", "Medical books, a stethoscope and a pencil on a desk", {
      desktop: "25% center",
      mobile: "center top",
    }),
    floatingCards: [
      { icon: "bookOpen", title: "Easy to read", text: "In clear, simple language" },
      { icon: "shieldPlus", title: "Prevention and care", text: "Tips for everyday life" },
    ],
    scrollCueLabel: "Read now",
  },

  heading: {
    eyebrow: "Medical library",
    title: [{ text: "Latest" }, { text: "articles", accent: true }],
    description: "Choose any article to read it in full without leaving the page.",
  },
  featuredLabel: "Featured article",
  moreTitle: "More articles",
  readLabel: "Read article",

  dialog: {
    disclaimer: "This article is for general awareness and does not replace medical advice. Consult your doctor before making any treatment decision.",
    ctaLabel: "Book a consultation",
  },
};
