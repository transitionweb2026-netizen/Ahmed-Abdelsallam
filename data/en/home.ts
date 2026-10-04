import { routes } from "@/config/routes";
import { siteIdentity } from "@/config/site";
import type { HomeCopy } from "@/types/content";

const { name, role } = siteIdentity.en;

/**
 * Homepage copy — English. The intro video and the CTA band are joined in by
 * lib/content.ts.
 *
 * PLACEHOLDER CONTENT — all wording below is draft copy written to avoid
 * factual claims (no years of experience, credentials, hospitals, patient
 * counts or success rates). Replace with approved copy from the doctor.
 */
export const homeCopy: HomeCopy = {
  hero: {
    eyebrow: `${name} · ${role}`,
    title: [
      { text: "Healthy bones and joints", breakAfter: true },
      { text: "start with an accurate diagnosis", accent: true },
    ],
    description:
      "Specialized care for bone, joint and spine problems — starting with careful listening and a thorough examination, and ending with a clear treatment plan that fits your condition and your lifestyle.",
    primaryCta: { label: "Explore services", href: routes.services },
    secondaryCta: { label: "Book a consultation", href: routes.contact },
    // PLACEHOLDER stock photo (Unsplash License, credit in README.md). The
    // English version uses the photo's original orientation, which keeps the
    // subject on the right, away from the left-aligned text.
    image: {
      desktop: {
        src: "/images/hero/hero-cover-en.jpg",
        alt: "A doctor fitting a supportive splint on a patient's wrist",
        width: 3200,
        height: 1800,
        objectPosition: "70% center",
      },
      mobile: {
        src: "/images/hero/hero-cover-en-mobile.jpg",
        alt: "A doctor fitting a supportive splint on a patient's wrist",
        width: 1200,
        height: 1667,
        objectPosition: "center top",
      },
    },
    floatingCards: [
      { icon: "scan", title: "Accurate diagnosis", text: "A careful clinical examination" },
      { icon: "clipboardCheck", title: "A clear plan", text: "Built around your condition and lifestyle" },
    ],
    scrollCueLabel: "Discover more",
  },

  intro: {
    heading: {
      eyebrow: "Meet the doctor",
      title: [{ text: "Meet" }, { text: "Dr. Ahmed Abdelsalam", accent: true }],
      description:
        "In this short video, Dr. Ahmed Abdelsalam explains how he cares for patients with bone and joint problems, and what your journey with us looks like — from the first consultation through follow-up.",
    },
    highlights: [
      { icon: "stethoscope", label: "A careful clinical examination" },
      { icon: "clipboardCheck", label: "A clear treatment plan" },
      { icon: "repeat", label: "Ongoing follow-up" },
    ],
    link: { label: "Watch more videos", href: routes.videos },
  },

  stats: {
    heading: {
      eyebrow: "By the numbers",
      title: [{ text: "Organized care" }, { text: "at every step", accent: true }],
      description: "A few numbers that sum up how we work: clear steps, ongoing patient education and a treatment plan for every patient.",
    },
    // PLACEHOLDER statistics: intentionally avoid invented credentials
    // (years of experience, patient counts, success rates). Swap in verified
    // figures when provided — the counter animates any value.
    stats: [
      { id: "tailored-plans", value: 100, suffix: "%", label: "A personalized treatment plan for every patient", icon: "clipboardCheck" },
      { id: "services", value: 8, label: "Specialized areas of care", icon: "stethoscope" },
      { id: "videos", value: 9, label: "Educational videos", icon: "play" },
      { id: "journey-steps", value: 5, label: "Clear steps from booking to follow-up", icon: "route" },
    ],
    doctorImage: {
      src: "/images/doctor/doctor-portrait-01.jpg",
      alt: "Portrait of Dr. Ahmed Abdelsalam (placeholder image)",
      width: 1200,
      height: 1500,
    },
    doctorName: name,
    doctorRole: role,
  },

  services: {
    heading: {
      eyebrow: "Services",
      title: [{ text: "Our main" }, { text: "services", accent: true }],
      description: "Complete care for bone and joint problems, from diagnosis through follow-up.",
    },
    cta: { label: "View all services", href: routes.services },
  },

  about: {
    heading: {
      eyebrow: "About the doctor",
      title: [{ text: "Dr. Ahmed" }, { text: "Abdelsalam", accent: true }],
      description:
        "An orthopedic doctor who believes good treatment starts with understanding the patient before reading the scans, and who makes sure every patient leaves knowing their condition and treatment plan clearly.",
    },
    points: [
      {
        icon: "searchCheck",
        title: "A diagnosis that starts with listening",
        text: "Time to understand your complaint and medical history before any treatment decision.",
      },
      {
        icon: "heartHandshake",
        title: "You at the center of care",
        text: "A clear explanation of your condition and options, with you involved in every decision.",
      },
      {
        icon: "clipboard",
        title: "A personalized treatment plan",
        text: "A plan that suits your condition, your daily activity and your goals.",
      },
      {
        icon: "repeat",
        title: "Follow-up until you recover",
        text: "Regular follow-up to review progress and adjust the plan when needed.",
      },
    ],
    image: {
      src: "/images/doctor/doctor-portrait-02.jpg",
      alt: "Dr. Ahmed Abdelsalam at the clinic (placeholder image)",
      width: 1200,
      height: 1500,
    },
    badge: { icon: "heartHandshake", label: "Patient-centered care" },
    cta: { label: "Meet the doctor", href: routes.about },
  },

  conditions: {
    heading: {
      eyebrow: "Conditions and symptoms",
      title: [{ text: "Symptoms that" }, { text: "deserve a check-up", accent: true }],
      description: "Some warning signs shouldn't be ignored — an early examination helps uncover what is causing them.",
    },
    cta: { label: "View all conditions", href: routes.conditions },
  },

  journey: {
    heading: {
      eyebrow: "Patient journey",
      title: [{ text: "Your" }, { text: "patient journey", accent: true }],
      description: "Clear, organized steps from the moment you book until follow-up, so you always know what comes next.",
    },
    steps: [
      {
        id: "book",
        title: "Book your appointment",
        description: "Choose a time that suits you, by phone or on WhatsApp.",
        icon: "calendar",
      },
      {
        id: "consult",
        title: "Consultation and assessment",
        description: "We listen to your concerns, review your medical history and examine you.",
        icon: "stethoscope",
      },
      {
        id: "diagnose",
        title: "Diagnosis",
        description: "Finding the cause of the problem, with tests or scans requested when needed.",
        icon: "scan",
      },
      {
        id: "plan",
        title: "Treatment plan",
        description: "A clear plan suited to your condition, with each step and goal explained.",
        icon: "clipboardCheck",
      },
      {
        id: "follow-up",
        title: "Follow-up",
        description: "Tracking your progress and adjusting the plan step by step.",
        icon: "repeat",
      },
    ],
  },

  videos: {
    heading: {
      eyebrow: "Patient education",
      title: [{ text: "Featured" }, { text: "videos", accent: true }],
      description: "Short clips that help you understand your condition and care for your bones and joints in everyday life.",
    },
    cta: { label: "View all videos", href: routes.videos },
  },

  reviewsFaq: {
    reviews: {
      heading: {
        eyebrow: "Patient reviews",
        title: [{ text: "Patient" }, { text: "experiences", accent: true }],
        description: "What patients say about their consultation and follow-up.",
      },
      cta: { label: "View all reviews", href: routes.reviews },
    },
    faq: {
      heading: {
        eyebrow: "FAQs",
        title: [{ text: "Answers to" }, { text: "your questions", accent: true }],
        description: "Short answers to the questions we hear most often before and after a visit.",
      },
      cta: { label: "View all questions", href: routes.faq },
    },
    cta: { label: "View all reviews and FAQs", href: routes.reviews },
  },
};
