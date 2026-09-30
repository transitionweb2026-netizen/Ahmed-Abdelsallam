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
  | "dumbbell";

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
}

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
}

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
  secondaryCta: Cta;
  image: ArtDirectedImage;
  /** Small glass cards floating over the image (desktop only). */
  floatingCards: { icon: IconName; title: string; text: string }[];
  scrollCueLabel: string;
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

export interface FinalCtaContent {
  eyebrow: string;
  title: TitlePart[];
  description: string;
  whatsappLabel: string;
  whatsappMessage: string;
  contactCta: Cta;
  image: MediaImage;
}

export interface HomeContent {
  hero: HeroContent;
  intro: IntroContent;
  stats: StatsContent;
  services: CollectionSectionContent;
  about: AboutContent;
  conditions: CollectionSectionContent;
  journey: { heading: SectionHeading; steps: JourneyStep[] };
  videos: CollectionSectionContent;
  reviewsFaq: ReviewsFaqContent;
  finalCta: FinalCtaContent;
}
