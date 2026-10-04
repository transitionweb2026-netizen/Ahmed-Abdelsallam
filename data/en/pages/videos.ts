import { routes } from "@/config/routes";
import { heroImage } from "@/data/shared/hero-image";
import type { VideosPageContent } from "@/types/content";

/**
 * /videos copy — English. The videos come from the shared dataset (the same
 * nine the homepage draws its featured three from).
 *
 * PLACEHOLDER CONTENT — draft wording.
 */
export const videosPage: VideosPageContent = {
  seo: {
    title: "Educational Videos",
    description:
      "Short, simple videos about bone, joint and spine pain and sports injuries, with practical tips for everyday care and prevention.",
  },

  hero: {
    eyebrow: "Videos",
    title: [
      { text: "Medical insight", breakAfter: true },
      { text: "in a minute", accent: true },
    ],
    description:
      "Short, simple videos that answer the most common questions about bone and joint pain, how to care for your joints and how to prevent injuries.",
    primaryCta: { label: "Watch the videos", href: "#videos-gallery" },
    secondaryCta: { label: "Book a consultation", href: routes.contact },
    image: heroImage("videos", "A camera on a tripod in a filming studio", {
      desktop: "30% center",
      mobile: "center top",
    }),
    floatingCards: [
      { icon: "play", title: "Short and focused", text: "Clear insights in minutes" },
      { icon: "lightbulb", title: "Practical tips", text: "To use in your day" },
    ],
    scrollCueLabel: "Watch now",
  },

  gallery: {
    heading: {
      eyebrow: "Video library",
      title: [{ text: "Explore our" }, { text: "latest videos", accent: true }],
      description: "Choose any video to watch it in full view, and move easily from one video to the next.",
    },
  },
};
