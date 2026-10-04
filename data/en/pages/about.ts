import { routes } from "@/config/routes";
import { siteIdentity } from "@/config/site";
import { heroImage } from "@/data/shared/hero-image";
import type { AboutPageCopy } from "@/types/content";

const { name, role } = siteIdentity.en;

/**
 * /about copy — English. The intro video and career steps are joined in by
 * lib/content.ts.
 *
 * PLACEHOLDER CONTENT — draft wording that avoids factual claims. The
 * philosophy quote is written in the doctor's voice and MUST be approved
 * (or rewritten) by him before launch. Portraits are placeholder art.
 */
export const aboutPage: AboutPageCopy = {
  seo: {
    title: "About Dr. Ahmed Abdelsalam",
    description:
      "Get to know Dr. Ahmed Abdelsalam, orthopedic doctor: his approach to care, his areas of focus, his treatment philosophy and the milestones of his career.",
  },

  hero: {
    eyebrow: "About the doctor",
    title: [
      { text: "Meet", breakAfter: true },
      { text: name, accent: true },
    ],
    description:
      "An orthopedic doctor who believes good care starts with listening and understanding, and ends with a clear treatment plan you are part of at every step.",
    primaryCta: { label: "Book a consultation", href: routes.contact },
    secondaryCta: { label: "Watch the introduction", href: "#about-video" },
    image: heroImage("about", "A doctor taking notes on a chart during a consultation with a patient", {
      desktop: "40% center",
      mobile: "center top",
    }),
    floatingCards: [
      { icon: "heartHandshake", title: "Compassionate care", text: "You at the heart of every decision" },
      { icon: "searchCheck", title: "A careful diagnosis", text: "Understanding before treating" },
    ],
    scrollCueLabel: "Learn more",
  },

  video: {
    heading: {
      eyebrow: "Introduction",
      title: [{ text: "A message" }, { text: "from the doctor", accent: true }],
      description:
        "In just a few minutes, Dr. Ahmed Abdelsalam explains his approach to care and what you can expect, from your first visit through follow-up.",
    },
  },

  introduction: {
    eyebrow: "Meet the doctor",
    title: [{ text: "Dr. Ahmed" }, { text: "Abdelsalam", accent: true }],
    paragraphs: [
      "Dr. Ahmed Abdelsalam is an orthopedic doctor focused on diagnosing and treating problems of the bones, joints and spine, as well as sports injuries — and on explaining each condition clearly to the patient before any treatment decision.",
      "He believes every patient has a different story. That's why he always starts by listening carefully and examining thoroughly, then builds a realistic treatment plan with each patient that suits their condition, goals and way of life.",
    ],
    bullets: [
      "A clear explanation of the diagnosis and options",
      "A treatment plan with defined steps",
      "Regular follow-up until recovery",
      "Easy communication for your questions",
    ],
    image: {
      src: "/images/doctor/doctor-portrait-01.jpg",
      alt: "Portrait of Dr. Ahmed Abdelsalam (placeholder image)",
      width: 1200,
      height: 1500,
    },
    caption: { icon: "stethoscope", title: name, subtitle: role },
    cta: { label: "Book a consultation", href: routes.contact },
  },

  qualifications: {
    heading: {
      eyebrow: "Qualifications",
      title: [{ text: "Qualifications" }, { text: "and certificates", accent: true }],
      description: "The academic qualifications and professional certificates behind the doctor's practice.",
    },
    // Remove once data/{ar,en}/qualifications.ts hold the verified details.
    note: "Illustrative placeholder details — to be replaced with the doctor's verified qualifications and certificates.",
  },

  specialties: {
    heading: {
      eyebrow: "Areas of focus",
      title: [{ text: "Key" }, { text: "specialties", accent: true }],
      description: "The areas the doctor focuses on in diagnosis, treatment and follow-up.",
    },
    cta: { label: "View all services", href: routes.services },
  },

  stats: {
    heading: {
      eyebrow: "By the numbers",
      title: [{ text: "Care and knowledge" }, { text: "within reach", accent: true }],
      description: "A quick overview of the areas of care and the educational content available on this website.",
    },
    // Values are counted from the collections, so they stay true as content grows.
    items: [
      { id: "services", label: "Specialized areas of care", icon: "stethoscope", countOf: "services" },
      { id: "conditions", label: "Common conditions explained in detail", icon: "clipboardCheck", countOf: "conditions" },
      { id: "videos", label: "Short educational videos", icon: "play", countOf: "videos" },
      { id: "articles", label: "Easy-to-read medical articles", icon: "bookOpen", countOf: "articles" },
    ],
  },

  philosophy: {
    eyebrow: "The doctor's philosophy",
    title: [{ text: "Treatment starts" }, { text: "with understanding", accent: true }],
    quote:
      "The best treatment plan is one the patient understands and believes in. That's why I make sure every patient leaves the clinic knowing their condition well — and knowing their next step clearly.",
    attribution: { name, role },
    values: [
      { icon: "searchCheck", label: "Listening first" },
      { icon: "clipboardCheck", label: "Clarity at every step" },
      { icon: "heartHandshake", label: "Shared decisions" },
    ],
    image: {
      src: "/images/doctor/doctor-portrait-02.jpg",
      alt: "Dr. Ahmed Abdelsalam at the clinic (placeholder image)",
      width: 1200,
      height: 1500,
    },
  },

  career: {
    heading: {
      eyebrow: "Career",
      title: [{ text: "Career" }, { text: "milestones", accent: true }],
      description: "Key milestones in the doctor's academic and professional journey.",
    },
  },
};
