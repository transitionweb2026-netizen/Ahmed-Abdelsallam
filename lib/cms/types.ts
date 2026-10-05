/**
 * Row shapes of the CMS tables (supabase/migrations) and the public
 * snapshot returned by `public.cms_snapshot()`. The website renders only
 * from a `CmsSnapshot`; it comes from Supabase, or — before the CMS is
 * connected — from the content bundled in `data/` (lib/cms/bundled.ts).
 */
import type { ArticleBlock, ItemDetails, TitlePart } from "@/types/content";

export type Locale = "ar" | "en";
export type Status = "draft" | "published";

/** A value per language: `{ ar: "…", en: "…" }`. */
export type L<T = string> = { ar: T; en: T };

export interface MediaRow {
  id: string;
  kind: "image" | "video";
  /** Storage bucket, or null for a file shipped with the site (`path` = "/images/…"). */
  bucket: string | null;
  path: string;
  mime_type: string;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  title: string;
  alt_ar: string;
  alt_en: string;
  legacy_path: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HoursRow {
  days: string;
  time: string;
}

export interface SettingsRow {
  id: 1;
  doctor_name_ar: string;
  doctor_name_en: string;
  doctor_role_ar: string;
  doctor_role_en: string;
  default_title_ar: string;
  default_title_en: string;
  default_description_ar: string;
  default_description_en: string;
  og_image_ar_id: string | null;
  og_image_en_id: string | null;
  logo_id: string | null;
  favicon_id: string | null;
  phone_digits: string;
  whatsapp_digits: string;
  email: string;
  address_lines_ar: string[];
  address_lines_en: string[];
  address_is_placeholder: boolean;
  hours_ar: HoursRow[];
  hours_en: HoursRow[];
  hours_are_placeholder: boolean;
  map_lat: number | null;
  map_lng: number | null;
  map_zoom: number;
  map_label_ar: string;
  map_label_en: string;
  map_is_placeholder: boolean;
  booking_href: string;
  form_store_submissions: boolean;
  robots_index: boolean;
  updated_at?: string;
}

export interface SocialRow {
  id: string;
  platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin";
  url: string;
  sort_order: number;
  visible: boolean;
}

export interface NavRow {
  id: string;
  key: string;
  href: string;
  label_ar: string;
  label_en: string;
  sort_order: number;
  visible: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
}

export interface PageRow {
  key: string;
  path: string | null;
  seo_title_ar: string;
  seo_title_en: string;
  seo_description_ar: string;
  seo_description_en: string;
  og_image_ar_id: string | null;
  og_image_en_id: string | null;
  robots_index: boolean;
  updated_at?: string;
}

export interface SectionRow {
  id: string;
  page_key: string;
  key: string;
  type: string;
  sort_order: number;
  visible: boolean;
  content: Record<string, unknown>;
  video_id: string | null;
  updated_at?: string;
}

export interface SectionMediaRow {
  section_id: string;
  slot: string;
  media_id: string;
  object_position: string | null;
  /** Alt text for this use only (null = the media's own alt text). */
  alt_ar: string | null;
  alt_en: string | null;
}

interface Publishable {
  id: string;
  sort_order: number;
  status: Status;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceRow extends Publishable {
  slug: string;
  icon: string;
  image_id: string | null;
  featured: boolean;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  details_ar: ItemDetails;
  details_en: ItemDetails;
}

export interface ConditionRow extends Publishable {
  slug: string;
  icon: string;
  image_id: string | null;
  featured: boolean;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  symptoms_ar: string[];
  symptoms_en: string[];
  details_ar: ItemDetails;
  details_en: ItemDetails;
}

export interface SpecialtyRow extends Publishable {
  slug: string;
  icon: string;
  service_id: string | null;
  image_id: string | null;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
}

export interface QualificationRow extends Publishable {
  key: string;
  kind: "qualification" | "certification";
  year: string;
  image_id: string | null;
  title_ar: string;
  title_en: string;
  institution_ar: string;
  institution_en: string;
  description_ar: string;
  description_en: string;
}

export type TimelineGroup = "journey" | "diagnosis" | "career";

export interface TimelineStepRow extends Publishable {
  group_key: TimelineGroup;
  key: string;
  icon: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  meta_ar: string;
  meta_en: string;
}

export type StatGroup = "home" | "about";
export type StatCountOf = "services" | "conditions" | "videos" | "articles";

export interface StatRow extends Publishable {
  group_key: StatGroup;
  key: string;
  icon: string;
  value: number | null;
  count_of: StatCountOf | null;
  prefix: string;
  suffix: string;
  label_ar: string;
  label_en: string;
}

export interface VideoRow extends Publishable {
  slug: string;
  orientation: "portrait" | "landscape";
  duration: string | null;
  youtube_id: string | null;
  poster_id: string | null;
  file_ar_id: string | null;
  file_en_id: string | null;
  listed: boolean;
  featured: boolean;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
}

export interface ReviewRow extends Publishable {
  key: string;
  rating: number;
  avatar_id: string | null;
  featured: boolean;
  is_placeholder: boolean;
  name_ar: string;
  name_en: string;
  text_ar: string;
  text_en: string;
  context_ar: string;
  context_en: string;
}

export interface FaqRow extends Publishable {
  key: string;
  featured: boolean;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
}

export interface ArticleCategoryRow {
  id: string;
  key: string;
  sort_order: number;
  name_ar: string;
  name_en: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleRow extends Publishable {
  slug: string;
  published_at: string;
  category_id: string | null;
  cover_id: string | null;
  featured: boolean;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  body_ar: ArticleBlock[];
  body_en: ArticleBlock[];
}

export interface UiStringRow {
  key: string;
  value_ar: string;
  value_en: string;
  updated_at?: string;
}

/** Everything the public website renders from (published / visible rows only). */
export interface CmsSnapshot {
  settings: SettingsRow | null;
  socials: SocialRow[];
  navigation: NavRow[];
  pages: PageRow[];
  sections: SectionRow[];
  sectionMedia: SectionMediaRow[];
  media: MediaRow[];
  services: ServiceRow[];
  conditions: ConditionRow[];
  specialties: SpecialtyRow[];
  qualifications: QualificationRow[];
  timelineSteps: TimelineStepRow[];
  stats: StatRow[];
  videos: VideoRow[];
  reviews: ReviewRow[];
  faqs: FaqRow[];
  articleCategories: ArticleCategoryRow[];
  articles: ArticleRow[];
  uiStrings: UiStringRow[];
}

/* ---- Section content (page_sections.content) --------------------------- */

/** A button or link: label per language, one destination. */
export interface CtaDoc {
  label: L;
  href: string;
  external?: boolean;
  /** Accessible name when the visible label is not descriptive enough. */
  ariaLabel?: L;
  icon?: "arrow" | "whatsapp" | "phone";
}

/** Link or WhatsApp chat (global call-to-action band). */
export type ActionDoc = { kind: "link"; label: L; href: string } | { kind: "whatsapp"; label: L; message: L };

export interface HeadingDoc {
  eyebrow: L;
  title: L<TitlePart[]>;
  description: L;
}

export interface IconTextDoc {
  icon: string;
  title: L;
  text: L;
}

export interface IconLabelDoc {
  icon: string;
  label: L;
}
