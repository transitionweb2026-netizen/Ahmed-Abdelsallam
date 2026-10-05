/**
 * The pages of the site and the sections each one is built from, in their
 * default order. This is fixed in code (every section maps to an existing
 * component); the CMS stores each section's content, order and visibility.
 */
import type { SectionType } from "@/lib/cms/section-docs";
import type { TimelineGroup } from "@/lib/cms/types";

export interface SectionDef {
  key: string;
  type: SectionType;
  /** Name in the dashboard. */
  label: string;
  /** DOM id of the rendered section (scroll cue target, deep links). */
  anchor?: string;
  /** Always first: cannot be moved. */
  pinned?: boolean;
  /** Cannot be hidden (the page needs it, e.g. its heading). */
  required?: boolean;
  /** Copy used inside dialogs, not a visual block: no order or visibility. */
  copyOnly?: boolean;
  /** Timeline sections: which group of steps they show. */
  timeline?: TimelineGroup;
}

export interface PageDef {
  key: string;
  /** Path without the language prefix; null for the shared blocks. */
  path: string | null;
  label: string;
  sections: SectionDef[];
}

const hero: SectionDef = { key: "hero", type: "hero", label: "Hero", pinned: true, required: true };
const cta: SectionDef = { key: "cta", type: "pageCta", label: "Closing call-to-action", anchor: "site-cta" };

export const cmsPages: PageDef[] = [
  {
    key: "home",
    path: "/",
    label: "Home",
    sections: [
      hero,
      { key: "intro", type: "homeIntro", label: "Introduction video", anchor: "intro" },
      { key: "stats", type: "homeStats", label: "Statistics", anchor: "stats" },
      { key: "services", type: "collection", label: "Featured services", anchor: "services" },
      { key: "about", type: "homeAbout", label: "About the doctor", anchor: "about" },
      { key: "conditions", type: "collection", label: "Conditions and symptoms", anchor: "conditions" },
      { key: "journey", type: "timeline", label: "Patient journey", anchor: "journey", timeline: "journey" },
      { key: "videos", type: "collection", label: "Featured videos", anchor: "videos" },
      { key: "reviewsFaq", type: "homeReviewsFaq", label: "Reviews and FAQs", anchor: "reviews-faq" },
      cta,
    ],
  },
  {
    key: "about",
    path: "/about",
    label: "About",
    sections: [
      hero,
      { key: "video", type: "aboutVideo", label: "Introduction video", anchor: "about-video" },
      { key: "introduction", type: "aboutIntro", label: "Doctor introduction", anchor: "doctor" },
      { key: "qualifications", type: "aboutQualifications", label: "Qualifications and certificates", anchor: "qualifications" },
      { key: "specialties", type: "collection", label: "Key specialties", anchor: "specialties" },
      { key: "stats", type: "aboutStats", label: "Statistics", anchor: "about-stats" },
      { key: "philosophy", type: "aboutPhilosophy", label: "Treatment philosophy", anchor: "philosophy" },
      { key: "career", type: "timeline", label: "Career milestones", anchor: "career", timeline: "career" },
      cta,
    ],
  },
  {
    key: "services",
    path: "/services",
    label: "Services",
    sections: [
      hero,
      { key: "procedures", type: "headingOnly", label: "Services and procedures", anchor: "procedures" },
      { key: "conditions", type: "headingOnly", label: "Conditions", anchor: "conditions" },
      { key: "diagnosis", type: "timeline", label: "Diagnosis steps", anchor: "diagnosis", timeline: "diagnosis" },
      { key: "dialog", type: "servicesDialog", label: "Detail dialog text", copyOnly: true, required: true },
      cta,
    ],
  },
  {
    key: "videos",
    path: "/videos",
    label: "Videos",
    sections: [hero, { key: "gallery", type: "headingOnly", label: "Video gallery", anchor: "videos-gallery" }, cta],
  },
  {
    key: "reviews",
    path: "/reviews",
    label: "Reviews & FAQs",
    sections: [
      hero,
      { key: "reviews", type: "headingOnly", label: "Patient reviews", anchor: "reviews" },
      { key: "faq", type: "reviewsFaq", label: "Frequently asked questions", anchor: "faq" },
      cta,
    ],
  },
  {
    key: "articles",
    path: "/articles",
    label: "Articles",
    sections: [hero, { key: "articles", type: "articlesList", label: "Articles list", anchor: "articles" }, cta],
  },
  {
    key: "contact",
    path: "/contact",
    label: "Contact",
    sections: [
      hero,
      { key: "form", type: "contactForm", label: "Contact form", anchor: "contact-form" },
      { key: "location", type: "contactLocation", label: "Clinic location", anchor: "clinic-location" },
      cta,
    ],
  },
  {
    key: "global",
    path: null,
    label: "Shared blocks",
    sections: [{ key: "siteCta", type: "siteCta", label: "Call-to-action band (all pages)", copyOnly: true, required: true }],
  },
];

export type PageKey = "home" | "about" | "services" | "videos" | "reviews" | "articles" | "contact" | "global";

export function pageDef(key: string): PageDef | undefined {
  return cmsPages.find((page) => page.key === key);
}

export function sectionDef(pageKey: string, sectionKey: string): SectionDef | undefined {
  return pageDef(pageKey)?.sections.find((section) => section.key === sectionKey);
}
