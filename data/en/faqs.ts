import type { FaqId } from "@/data/shared/faqs";
import type { FaqText } from "@/types/content";

/**
 * FAQs — English text, keyed by id (order and flags in data/shared/faqs.ts).
 *
 * PLACEHOLDER CONTENT — generic answers pending the clinic's confirmed
 * policies (booking, durations, documents). Replace before launch.
 */
export const faqsText: Record<FaqId, FaqText> = {
  "faq-booking": {
    question: "How can I book an appointment?",
    answer:
      "You can book by phone or on WhatsApp. We'll confirm a time that suits you and let you know about any instructions before your visit.",
  },
  "faq-first-visit": {
    question: "What should I bring to my first visit?",
    answer:
      "Please bring any previous X-rays or test results, a list of the medicines you take, and any medical reports related to your current complaint.",
  },
  "faq-duration": {
    question: "How long does a consultation take?",
    answer:
      "It depends on your condition. The aim is always to give you enough time to explain your complaint and understand your treatment plan.",
  },
  "faq-imaging": {
    question: "Do I need an X-ray before my visit?",
    answer: "Not necessarily. After examining you, the doctor will decide whether you need X-rays or any other tests.",
  },
  "faq-follow-up": {
    question: "How does follow-up work once treatment starts?",
    answer: "Follow-up visits are scheduled according to your treatment plan, to review your progress and adjust the plan when needed.",
  },
  "faq-whatsapp": {
    question: "Can I contact you on WhatsApp?",
    answer: "Yes. You can send your question or booking request on WhatsApp, and we'll reply as soon as possible.",
  },
  "faq-reschedule": {
    question: "Can I change or cancel my appointment?",
    answer: "Yes. Please let us know in advance by phone or WhatsApp so we can rebook your appointment at a time that suits you.",
  },
  "faq-physiotherapy": {
    question: "Will I need physiotherapy?",
    answer:
      "The doctor decides whether you need physiotherapy based on your condition. It is often an important part of recovery after injuries and for back and joint pain.",
  },
  "faq-sport-pain": {
    question: "Should I stop exercising if I feel pain?",
    answer:
      "It's best to ease off the activity that causes the pain rather than push through it, and to get assessed if the pain persists or comes with swelling or a feeling that the joint is unstable.",
  },
  "faq-remote": {
    question: "Can my condition be followed up without visiting the clinic?",
    answer:
      "You can ask on WhatsApp, and the doctor will decide whether your condition can be followed up remotely or needs an in-person visit and examination.",
  },
};
