import { routes } from "@/config/routes";
import { siteCta } from "@/data/en/cta";
import { heroImage } from "@/data/shared/hero-image";
import type { ContactPageContent } from "@/types/content";

/**
 * /contact copy — English. Address, hours and map pin live in the contact
 * data; phone and WhatsApp come from environment variables (config/site.ts).
 *
 * PLACEHOLDER CONTENT — draft wording.
 */
export const contactPage: ContactPageContent = {
  seo: {
    title: "Contact Us",
    description:
      "Contact Dr. Ahmed Abdelsalam's clinic to book an appointment or send a question through the form, WhatsApp or phone.",
  },

  hero: {
    eyebrow: "Contact us",
    title: [
      { text: "We're here", breakAfter: true },
      { text: "to answer your questions", accent: true },
    ],
    description:
      "Book an appointment or send us your question, and we'll get in touch to find a convenient time and answer everything you need to know before your visit.",
    primaryCta: { label: "Send a message", href: "#contact-form" },
    secondaryCta: { label: "Clinic location", href: "#clinic-location" },
    // The photo's original orientation (the Arabic crop is mirrored), which
    // keeps the room's furniture on the right, away from the text.
    image: heroImage("contact-en", "An examination room with an examination couch and a large window", {
      desktop: "70% center",
      mobile: "center top",
    }),
  },

  form: {
    heading: {
      eyebrow: "Write to us",
      title: [{ text: "Send" }, { text: "your question", accent: true }],
      description: "Fill in the form and we'll get back to you as soon as possible. Fields marked * are required.",
    },
    copy: {
      labels: {
        name: "Name",
        phone: "Phone number",
        email: "Email",
        subject: "Subject",
        message: "Your message",
      },
      placeholders: {
        name: "Your full name",
        phone: "01XXXXXXXXX",
        email: "name@example.com",
        subject: "Choose a subject",
        message: "Write your question, or a time that suits you…",
      },
      subjects: ["Book an appointment", "Question about a condition", "Follow-up after a visit", "General question"],
      optional: "optional",
      submit: "Send message",
      sending: "Sending…",
      errorSummary: "Please correct the highlighted fields and send again.",
      success: {
        title: "Message received",
        text: "Thank you for getting in touch. We'll get back to you as soon as possible.",
      },
      notConfigured: {
        title: "Sending through the form isn't switched on yet",
        text: "You can send the same message on WhatsApp in one tap, or call us directly.",
        whatsappLabel: "Send on WhatsApp",
      },
      failure: {
        title: "Your message couldn't be sent",
        text: "Something went wrong. Please try again, or contact us on WhatsApp or by phone.",
      },
    },
    whatsappLabel: "Book on WhatsApp",
    whatsappMessage: "Hello, I'd like to book a consultation with Dr. Ahmed Abdelsalam.",
    callLabel: "Call us",
  },

  location: {
    heading: {
      eyebrow: "Clinic location",
      title: [{ text: "Visit us at" }, { text: "the clinic", accent: true }],
      description: "Address, opening hours and how to find us.",
    },
    labels: {
      address: "Address",
      hours: "Opening hours",
      phone: "Phone",
      email: "Email",
      directions: "Get directions",
      placeholderNote: "The location shown on the map is provisional; the clinic's actual location will be added later.",
    },
  },

  // The contact options are already on this page, so the closing band
  // points onward instead of repeating them.
  cta: {
    ...siteCta,
    eyebrow: "Discover more",
    title: [{ text: "Learn more about" }, { text: "your care before your visit", accent: true }],
    description:
      "Browse our services and common conditions, or watch short educational videos that help you understand your condition before your appointment.",
    primaryAction: { kind: "link", label: "Explore services", href: routes.services },
    secondaryAction: { kind: "link", label: "Watch the videos", href: routes.videos },
  },
};
