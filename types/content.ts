/**
 * Content model for the whole site.
 *
 * Every section component receives these shapes as props, so the static
 * data in `data/` can later be swapped for Supabase / CMS rows without
 * touching presentation code. Keep these types serialisable (no React
 * nodes, no functions) so they can cross the Server → Client boundary.
 */

/** Icon keys resolved to Lucide components in `components/ui/Icon.tsx`. */
export type IconName =
  | "bone"
  | "boneFracture"
  | "spine"
  | "activity"
  | "footprints"
  | "hand"
  | "shoulder"
  | "personStanding"
  | "stethoscope"
  | "scan"
  | "calendar"
  | "clipboard"
  | "clipboardCheck"
  | "route"
  | "searchCheck"
  | "repeat"
  | "heartHandshake"
  | "shieldPlus"
  | "sparkles"
  | "play"
  | "users"
  | "messages"
  | "clock"
  | "phone"
  | "mapPin"
  | "dumbbell"
  | "graduationCap"
  | "award"
  | "bookOpen"
  | "heartPulse"
  | "mail"
  | "target"
  | "microscope"
  | "pill"
  | "syringe"
  | "listChecks"
  | "info"
  | "lightbulb"
  | "alertCircle"
  | "timer";

export interface MediaImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional tiny base64 preview used with `placeholder="blur"`. */
  blurDataURL?: string;
  /** CSS object-position, e.g. "30% center". */
  objectPosition?: string;
}

/** Hero-style image with an optional portrait crop for small screens. */
export interface ArtDirectedImage {
  desktop: MediaImage;
  mobile?: MediaImage;
}

export interface Cta {
  label: string;
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
  /** Accessible name when the visible label is not descriptive enough. */
  ariaLabel?: string;
  /** Trailing glyph inside the button bubble (defaults to an arrow). */
  icon?: "arrow" | "whatsapp" | "phone";
}

/**
 * A call-to-action that is either a normal link or a WhatsApp chat. The
 * WhatsApp URL is built from the configured number at render time, so the
 * content stays valid when the number changes.
 */
export type CtaAction =
  | { kind: "link"; label: string; href: string }
  | { kind: "whatsapp"; label: string; message: string };

/**
 * Headings are stored as parts so a CMS editor can mark which words take
 * the accent colour without writing markup.
 */
export interface TitlePart {
  text: string;
  accent?: boolean;
  /** Force a line break after this part on wide screens. */
  breakAfter?: boolean;
}

export type RichTitle = string | TitlePart[];

export interface SectionHeading {
  eyebrow: string;
  title: RichTitle;
  description?: string;
}

/**
 * Long-form detail shown in the /services detail dialog. Stored as plain
 * sections (paragraphs and/or bullet items) so a CMS can edit it without
 * rich-text markup.
 */
export interface DetailSection {
  title: string;
  icon?: IconName;
  paragraphs?: string[];
  items?: string[];
}

export interface ItemDetails {
  /** Opening paragraph under the title. */
  lead: string;
  sections: DetailSection[];
}

export interface Service {
  slug: string;
  title: string;
  description: string;
  /** Card image — 4:3 recommended (e.g. 1200×900). */
  image: MediaImage;
  /** Link target; defaults to the service's section on /services. */
  href?: string;
  /** Small accent icon shown over the image. */
  icon: IconName;
  /** Shown on the homepage "Important Services" grid. */
  featured?: boolean;
  order: number;
  /** Full description, indications and recovery for the detail dialog. */
  details?: ItemDetails;
}

/** The fields a service-style glass card needs (services, specialties). */
export type ServiceCardItem = Pick<Service, "slug" | "title" | "description" | "image" | "icon" | "href">;

export interface Condition {
  slug: string;
  title: string;
  excerpt: string;
  /** Card image — 4:3 recommended (e.g. 1200×900). */
  image: MediaImage;
  /** Link target; defaults to the condition's section on /services. */
  href?: string;
  symptoms: string[];
  icon: IconName;
  featured?: boolean;
  order: number;
  /** Causes, warning signs and treatment approach for the detail dialog. */
  details?: ItemDetails;
}

/** Area of focus shown on the About page (links to the matching service). */
export interface Specialty extends ServiceCardItem {
  order: number;
}

export interface Stat {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon: IconName;
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  /** Small label on the card, e.g. a year or a phase. */
  meta?: string;
}

/** Degree or certificate tile on the About page. */
export interface Qualification {
  id: string;
  kind: "qualification" | "certification";
  title: string;
  institution: string;
  /** Free text so ranges ("2015 – 2018") and placeholders both fit. */
  year: string;
  description: string;
  image: MediaImage;
  order: number;
}

export interface VideoFile {
  src: string;
  type: "video/mp4" | "video/webm";
}

export interface VideoCaptionTrack {
  src: string;
  srcLang: string;
  label: string;
}

export interface Video {
  slug: string;
  title: string;
  description?: string;
  poster: MediaImage;
  /** Self-hosted sources, listed in order of preference. */
  sources?: VideoFile[];
  /** Alternatively, a YouTube video id (used when `sources` is empty). */
  youtubeId?: string;
  captions?: VideoCaptionTrack[];
  /** Display duration, e.g. "1:20". */
  duration?: string;
  orientation: "portrait" | "landscape";
  featured?: boolean;
  order: number;
}

export interface Review {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Short context shown under the name, e.g. the visit type. */
  context?: string;
  avatar?: MediaImage;
  featured?: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  featured?: boolean;
}

/**
 * Article body as typed blocks (a minimal, CMS-friendly rich-text model).
 * Maps directly to a Supabase JSON column or a headless-CMS block field.
 */
export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; tone: "tip" | "warning"; title: string; text: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  /** Cover image — 16:10 recommended (e.g. 1600×1000). */
  image: MediaImage;
  body: ArticleBlock[];
  featured?: boolean;
  order: number;
}

/** Article plus fields derived by the content layer. */
export interface ArticleWithMeta extends Article {
  readingMinutes: number;
}

export interface ContactInfo {
  /** Clinic address; `isPlaceholder` shows a "to be confirmed" note. */
  address: { lines: string[]; isPlaceholder: boolean };
  hours: { days: string; time: string }[];
  hoursArePlaceholder: boolean;
  email?: string;
  map: {
    lat: number;
    lng: number;
    /** OpenStreetMap zoom level for the embedded map. */
    zoom: number;
    label: string;
    /** While true the map shows a notice and the directions link is hidden. */
    isPlaceholder: boolean;
  };
}

export type SocialPlatform = "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin";

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
}

/* ------------------------------------------------------------------ */
/* Homepage section content                                            */
/* ------------------------------------------------------------------ */

export interface HeroContent {
  eyebrow: string;
  title: TitlePart[];
  description: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  image: ArtDirectedImage;
  /** Small glass cards floating over the image (desktop only). */
  floatingCards?: { icon: IconName; title: string; text: string }[];
  /** Label of the "scroll down" cue (full-height heroes only). */
  scrollCueLabel?: string;
}

export interface IntroContent {
  heading: SectionHeading;
  highlights: { icon: IconName; label: string }[];
  link: Cta;
  video: Video;
}

export interface StatsContent {
  heading: SectionHeading;
  stats: Stat[];
  doctorImage: MediaImage;
  doctorName: string;
  doctorRole: string;
}

export interface AboutContent {
  heading: SectionHeading;
  points: { icon: IconName; title: string; text: string }[];
  image: MediaImage;
  badge: { icon: IconName; label: string };
  cta: Cta;
}

export interface CollectionSectionContent {
  heading: SectionHeading;
  cta: Cta;
}

export interface ReviewsFaqContent {
  reviews: CollectionSectionContent;
  faq: CollectionSectionContent;
  cta: Cta;
}

/** The site-wide call-to-action band (doctor cut-out on navy glass). */
export interface SiteCtaContent {
  eyebrow: string;
  title: TitlePart[];
  description: string;
  /** White glass button. */
  primaryAction: CtaAction;
  /** Lavender glass button. */
  secondaryAction: CtaAction;
  image: MediaImage;
}

export interface JourneyContent {
  heading: SectionHeading;
  steps: JourneyStep[];
}

export interface HomeContent {
  hero: HeroContent;
  intro: IntroContent;
  stats: StatsContent;
  services: CollectionSectionContent;
  about: AboutContent;
  conditions: CollectionSectionContent;
  journey: JourneyContent;
  videos: CollectionSectionContent;
  reviewsFaq: ReviewsFaqContent;
  finalCta: SiteCtaContent;
}

/* ------------------------------------------------------------------ */
/* Inner pages                                                         */
/* ------------------------------------------------------------------ */

/** Per-page SEO copy; the canonical path comes from config/routes.ts. */
export interface PageSeo {
  title: string;
  description: string;
}

export interface AboutPageContent {
  seo: PageSeo;
  hero: HeroContent;
  video: { heading: SectionHeading; video: Video };
  introduction: {
    eyebrow: string;
    title: RichTitle;
    paragraphs: string[];
    bullets: string[];
    image: MediaImage;
    caption: { icon: IconName; title: string; subtitle?: string };
    cta: Cta;
  };
  qualifications: { heading: SectionHeading; note: string };
  specialties: CollectionSectionContent;
  /**
   * Counters derived from the site's own collections (never invented
   * claims). `countOf` names the collection whose size is shown.
   */
  stats: {
    heading: SectionHeading;
    items: { id: string; label: string; icon: IconName; countOf: "services" | "conditions" | "videos" | "articles" }[];
  };
  philosophy: {
    eyebrow: string;
    title: RichTitle;
    quote: string;
    attribution: { name: string; role: string };
    values: { icon: IconName; label: string }[];
    image: MediaImage;
  };
  career: JourneyContent;
}

export interface ServicesPageContent {
  seo: PageSeo;
  hero: HeroContent;
  procedures: { heading: SectionHeading };
  conditions: { heading: SectionHeading };
  diagnosis: JourneyContent;
  /** Copy used inside the detail dialog. */
  dialog: {
    bookLabel: string;
    whatsappLabel: string;
    /** "{title}" is replaced with the service or condition name. */
    whatsappMessage: string;
    disclaimer: string;
  };
}

export interface VideosPageContent {
  seo: PageSeo;
  hero: HeroContent;
  gallery: { heading: SectionHeading };
}

export interface ReviewsPageContent {
  seo: PageSeo;
  hero: HeroContent;
  reviews: { heading: SectionHeading };
  faq: {
    heading: SectionHeading;
    help: { title: string; text: string; whatsappLabel: string; whatsappMessage: string; callLabel: string };
  };
}

export interface ArticlesPageContent {
  seo: PageSeo;
  hero: HeroContent;
  heading: SectionHeading;
  featuredLabel: string;
  moreTitle: string;
  readLabel: string;
  dialog: { disclaimer: string; ctaLabel: string };
}

export interface ContactFormCopy {
  labels: { name: string; phone: string; email: string; subject: string; message: string };
  placeholders: { name: string; phone: string; email: string; subject: string; message: string };
  subjects: string[];
  optional: string;
  submit: string;
  sending: string;
  errorSummary: string;
  success: { title: string; text: string };
  /** Shown when no form endpoint is configured yet (see .env.example). */
  notConfigured: { title: string; text: string; whatsappLabel: string };
  failure: { title: string; text: string };
}

export interface ContactPageContent {
  seo: PageSeo;
  hero: HeroContent;
  form: {
    heading: SectionHeading;
    copy: ContactFormCopy;
    whatsappLabel: string;
    whatsappMessage: string;
    callLabel: string;
  };
  location: {
    heading: SectionHeading;
    labels: { address: string; hours: string; phone: string; email: string; directions: string; placeholderNote: string };
  };
  cta: SiteCtaContent;
}
