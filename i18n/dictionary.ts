import type { NavKey } from "@/config/routes";
import type { PluralForms } from "@/i18n/format";
import type { ContactErrorCode } from "@/lib/contact-form";
import type { SocialPlatform } from "@/types/content";

/**
 * Interface strings shared across pages (navigation, buttons, labels,
 * accessible names, validation messages). Page content lives in data/{ar,en}.
 * Both dictionaries must implement every key, so a missing translation is a
 * type error. Values must stay plain strings (they are sent to the browser).
 */
export interface Dictionary {
  skipToContent: string;
  nav: Record<NavKey, string>;
  header: {
    mainNavLabel: string;
    drawerTitle: string;
    drawerNavLabel: string;
    book: string;
    menu: string;
    closeMenu: string;
    callUs: string;
    whatsapp: string;
  };
  language: { label: string };
  common: {
    /** Appended to accessible names of links that open a new tab. */
    newTab: string;
    socialAccounts: string;
    breadcrumb: string;
    careHighlights: string;
    close: string;
  };
  socials: Record<SocialPlatform, string>;
  footer: {
    about: string;
    quickLinks: string;
    contactTitle: string;
    whatsapp: string;
    disclaimerTitle: string;
    disclaimer: string;
    rights: string;
    backToTop: string;
  };
  cards: {
    learnMore: string;
    viewDetails: string;
    symptoms: string;
    serviceKind: string;
    conditionKind: string;
  };
  video: {
    /** "{title}" is the video title. */
    play: string;
    unsupported: string;
    error: string;
    featuredList: string;
    allList: string;
    swipeHint: string;
    /** "{current}" / "{total}". */
    position: string;
    duration: string;
    previous: string;
    next: string;
    book: string;
  };
  timeline: { step: string; milestone: string };
  reviews: {
    /** "{rating}" / "{max}". */
    rating: string;
    list: string;
    section: string;
  };
  articles: { readingTime: PluralForms };
  about: { qualificationKind: string; certificationKind: string; valuesLabel: string };
  contact: {
    /** "{label}" is the map label. */
    mapTitle: string;
  };
  form: { errors: Record<ContactErrorCode, string> };
  notFound: {
    metaTitle: string;
    eyebrow: string;
    titleStart: string;
    titleAccent: string;
    text: string;
    home: string;
    contact: string;
  };
}
