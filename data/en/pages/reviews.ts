import { heroImage } from "@/data/shared/hero-image";
import type { ReviewsPageContent } from "@/types/content";

/**
 * /reviews ("Reviews & FAQs") copy — English. Reviews and questions come
 * from their collections.
 *
 * PLACEHOLDER CONTENT — draft wording. The reviews themselves are fictional
 * layout placeholders; see data/shared/reviews.ts.
 */
export const reviewsPage: ReviewsPageContent = {
  seo: {
    title: "Reviews & FAQs",
    description:
      "Patient reviews and answers to common questions about booking, the first visit and follow-up at Dr. Ahmed Abdelsalam's clinic.",
  },

  hero: {
    eyebrow: "Reviews & FAQs",
    title: [
      { text: "Patient experiences", breakAfter: true },
      { text: "and answers to your questions", accent: true },
    ],
    description:
      "Read what patients say about their consultation and follow-up, and find answers to the questions we hear most before and after a visit.",
    primaryCta: { label: "Patient reviews", href: "#reviews" },
    secondaryCta: { label: "FAQs", href: "#faq" },
    image: heroImage("reviews", "Hands reviewing a patient file on a tablet at the clinic", {
      desktop: "40% center",
      mobile: "center top",
    }),
    floatingCards: [
      { icon: "messages", title: "Patient experiences", text: "Impressions of care and follow-up" },
      { icon: "info", title: "Clear answers", text: "Before and after your visit" },
    ],
    scrollCueLabel: "Read the reviews",
  },

  reviews: {
    heading: {
      eyebrow: "Patient reviews",
      title: [{ text: "Patient" }, { text: "experiences", accent: true }],
      description: "What patients say about their consultation, diagnosis and follow-up.",
    },
  },

  faq: {
    heading: {
      eyebrow: "FAQs",
      title: [{ text: "Answers to" }, { text: "your questions", accent: true }],
      description: "Everything you need to know about booking, your first visit and follow-up.",
    },
    help: {
      title: "Didn't find your answer?",
      text: "Send us your question on WhatsApp or give us a call, and we'll get back to you as soon as possible.",
      whatsappLabel: "Ask on WhatsApp",
      whatsappMessage: "Hello, I have a question before booking an appointment:",
      callLabel: "Call us",
    },
  },
};
