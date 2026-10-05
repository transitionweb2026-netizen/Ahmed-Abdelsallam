/**
 * Content of each section type, as stored in page_sections.content. Text is
 * per language (`L<…>`); links, icons and settings are shared. Images live
 * in section_media (by slot) and videos in page_sections.video_id, so the
 * database can protect them from deletion while in use.
 *
 * The admin field definitions for these shapes are in lib/cms/registry.ts.
 */
import type { ActionDoc, CtaDoc, HeadingDoc, IconLabelDoc, IconTextDoc, L } from "@/lib/cms/types";
import type { TitlePart } from "@/types/content";

export interface HeroDoc {
  eyebrow: L;
  title: L<TitlePart[]>;
  description: L;
  primaryCta: CtaDoc;
  secondaryCta: CtaDoc | null;
  floatingCards: IconTextDoc[];
  scrollCueLabel: L;
}

export interface HomeIntroDoc {
  heading: HeadingDoc;
  highlights: IconLabelDoc[];
  link: CtaDoc;
}

export interface HeadingOnlyDoc {
  heading: HeadingDoc;
}

export interface CollectionDoc {
  heading: HeadingDoc;
  cta: CtaDoc;
}

export interface HomeAboutDoc {
  heading: HeadingDoc;
  points: IconTextDoc[];
  badge: IconLabelDoc;
  cta: CtaDoc;
}

export interface HomeReviewsFaqDoc {
  reviews: CollectionDoc;
  faq: CollectionDoc;
  cta: CtaDoc;
}

export interface CtaBandDoc {
  eyebrow: L;
  title: L<TitlePart[]>;
  description: L;
  primaryAction: ActionDoc;
  secondaryAction: ActionDoc;
}

/** A page's closing band: the shared one (global/siteCta), or its own text. */
export type PageCtaDoc = { mode: "shared" } | ({ mode: "custom" } & CtaBandDoc);

export interface AboutIntroDoc {
  eyebrow: L;
  title: L<TitlePart[]>;
  paragraphs: L<string[]>;
  bullets: L<string[]>;
  /** Icon of the name caption; the name and title come from the settings. */
  captionIcon: string;
  cta: CtaDoc;
}

export interface AboutQualificationsDoc {
  heading: HeadingDoc;
  note: L;
}

export interface AboutPhilosophyDoc {
  eyebrow: L;
  title: L<TitlePart[]>;
  quote: L;
  values: IconLabelDoc[];
}

export interface ServicesDialogDoc {
  bookLabel: L;
  whatsappLabel: L;
  /** "{title}" is replaced with the service or condition name. */
  whatsappMessage: L;
  disclaimer: L;
}

export interface ReviewsFaqDoc {
  heading: HeadingDoc;
  help: { title: L; text: L; whatsappLabel: L; whatsappMessage: L; callLabel: L };
}

export interface ArticlesListDoc {
  heading: HeadingDoc;
  featuredLabel: L;
  moreTitle: L;
  readLabel: L;
  dialog: { disclaimer: L; ctaLabel: L };
}

type FormFieldNames = "name" | "phone" | "email" | "subject" | "message";

export interface ContactFormDoc {
  heading: HeadingDoc;
  copy: {
    labels: Record<FormFieldNames, L>;
    placeholders: Record<FormFieldNames, L>;
    subjects: L<string[]>;
    optional: L;
    submit: L;
    sending: L;
    errorSummary: L;
    success: { title: L; text: L };
    notConfigured: { title: L; text: L; whatsappLabel: L };
    failure: { title: L; text: L };
  };
  whatsappLabel: L;
  whatsappMessage: L;
  callLabel: L;
}

export interface ContactLocationDoc {
  heading: HeadingDoc;
  labels: { address: L; hours: L; phone: L; email: L; directions: L; placeholderNote: L };
}

/** Section type → content shape. */
export interface SectionDocs {
  hero: HeroDoc;
  homeIntro: HomeIntroDoc;
  homeStats: HeadingOnlyDoc;
  collection: CollectionDoc;
  homeAbout: HomeAboutDoc;
  timeline: HeadingOnlyDoc;
  homeReviewsFaq: HomeReviewsFaqDoc;
  siteCta: CtaBandDoc;
  pageCta: PageCtaDoc;
  aboutVideo: HeadingOnlyDoc;
  aboutIntro: AboutIntroDoc;
  aboutQualifications: AboutQualificationsDoc;
  aboutStats: HeadingOnlyDoc;
  aboutPhilosophy: AboutPhilosophyDoc;
  headingOnly: HeadingOnlyDoc;
  servicesDialog: ServicesDialogDoc;
  reviewsFaq: ReviewsFaqDoc;
  articlesList: ArticlesListDoc;
  contactForm: ContactFormDoc;
  contactLocation: ContactLocationDoc;
}

export type SectionType = keyof SectionDocs;
