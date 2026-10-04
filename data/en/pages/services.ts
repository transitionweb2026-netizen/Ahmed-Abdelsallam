import { routes } from "@/config/routes";
import { heroImage } from "@/data/shared/hero-image";
import type { ServicesPageContent } from "@/types/content";

/**
 * /services copy — English. The cards themselves come from the services and
 * conditions collections.
 *
 * PLACEHOLDER CONTENT — draft wording pending the doctor's approval.
 */
export const servicesPage: ServicesPageContent = {
  seo: {
    title: "Services and Treatment Procedures",
    description:
      "Treatment for bone, joint and spine problems and sports injuries, the conditions that warrant a check-up, and the steps from your first consultation to a treatment plan.",
  },

  hero: {
    eyebrow: "Services",
    title: [
      { text: "Complete care", breakAfter: true },
      { text: "for your bones and joints", accent: true },
    ],
    description:
      "From an accurate diagnosis to a treatment plan and follow-up. Explore our services and common conditions, and select any card to see its full details.",
    primaryCta: { label: "Browse services", href: "#procedures" },
    secondaryCta: { label: "Book a consultation", href: routes.contact },
    image: heroImage("services", "A surgical team operating in an operating room", {
      desktop: "35% center",
      mobile: "center top",
    }),
  },

  procedures: {
    heading: {
      eyebrow: "Services and procedures",
      title: [{ text: "Surgical and" }, { text: "therapeutic procedures", accent: true }],
      description:
        "Select any service to read what it involves, when it's needed, the treatment options and what to expect during recovery.",
    },
  },

  conditions: {
    heading: {
      eyebrow: "Conditions",
      title: [{ text: "Conditions that" }, { text: "need treatment", accent: true }],
      description: "Learn the causes and signs of each condition, when to see a doctor, and how it is diagnosed and treated.",
    },
  },

  diagnosis: {
    heading: {
      eyebrow: "How we diagnose",
      title: [{ text: "How we reach" }, { text: "the right diagnosis", accent: true }],
      description: "Organized steps that start by listening to you and end with a clear treatment plan, so you know your next step.",
    },
    steps: [
      {
        id: "consultation",
        title: "Consultation",
        description: "We listen to your concerns, your medical history and your goals for treatment.",
        icon: "messages",
      },
      {
        id: "examination",
        title: "Clinical examination",
        description: "A careful check of movement, strength, sensation and where it hurts.",
        icon: "stethoscope",
      },
      {
        id: "imaging",
        title: "Imaging and tests",
        description: "X-rays, scans or lab tests — only when they are needed.",
        icon: "scan",
      },
      {
        id: "diagnosis",
        title: "Diagnosis",
        description: "Identifying the cause of the problem and explaining it to you clearly.",
        icon: "searchCheck",
      },
      {
        id: "treatment-plan",
        title: "Treatment plan",
        description: "A plan with defined steps and clear follow-up appointments.",
        icon: "clipboardCheck",
      },
    ],
  },

  dialog: {
    bookLabel: "Book a consultation",
    whatsappLabel: "Ask on WhatsApp",
    whatsappMessage: "Hello, I'd like to ask about: {title}",
    disclaimer: "This information is for general awareness and does not replace an in-person examination or medical consultation.",
  },
};
