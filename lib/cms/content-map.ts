/**
 * Turns a CMS snapshot into the typed content the components render
 * (types/content.ts), for one language. Pure: no I/O, so the same code runs
 * for Supabase content, bundled content and tests.
 */
import { routes } from "@/config/routes";
import type { Dictionary } from "@/i18n/dictionary";
import { cmsPages } from "@/lib/cms/pages";
import type {
  AboutIntroDoc,
  AboutPhilosophyDoc,
  AboutQualificationsDoc,
  ArticlesListDoc,
  CollectionDoc,
  ContactFormDoc,
  ContactLocationDoc,
  CtaBandDoc,
  HeadingOnlyDoc,
  HeroDoc,
  HomeAboutDoc,
  HomeIntroDoc,
  HomeReviewsFaqDoc,
  PageCtaDoc,
  ReviewsFaqDoc,
  ServicesDialogDoc,
} from "@/lib/cms/section-docs";
import type { ActionDoc, CmsSnapshot, CtaDoc, HeadingDoc, L, Locale, MediaRow, SectionRow, VideoRow } from "@/lib/cms/types";
import { buildDictionary } from "@/lib/cms/ui-strings";
import type {
  AboutPageContent,
  ArticleBlock,
  ArticlesPageContent,
  ArticleWithMeta,
  ArtDirectedImage,
  Condition,
  ContactInfo,
  ContactPageContent,
  Cta,
  CtaAction,
  Faq,
  HeroContent,
  HomeContent,
  JourneyStep,
  MediaImage,
  Qualification,
  Review,
  ReviewsPageContent,
  SectionHeading,
  Service,
  ServicesPageContent,
  SiteCtaContent,
  SocialPlatform,
  Specialty,
  Stat,
  TitlePart,
  Video,
  VideosPageContent,
} from "@/types/content";

/** Placeholder number used in links while no phone number is configured (not a real number). */
export const PLACEHOLDER_PHONE = "200000000000";
export const PLACEHOLDER_PHONE_DISPLAY = "+20 1XX XXX XXXX";

/** 1×1 transparent GIF, shown if a required image was removed. */
const MISSING_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export interface SiteIdentityContent {
  name: string;
  role: string;
  title: string;
  description: string;
  ogImage: { src: string; width: number; height: number };
}

export interface ContactSettings {
  phoneDigits: string;
  whatsappDigits: string;
  isPlaceholder: boolean;
  placeholderDisplay: string;
}

export interface NavItemContent {
  key: string;
  href: string;
  label: string;
  showInHeader: boolean;
  showInFooter: boolean;
}

export interface SocialLinkContent {
  platform: SocialPlatform;
  href: string;
}

export interface ListOptions {
  featured?: boolean;
  limit?: number;
}

const WORDS_PER_MINUTE: Record<Locale, number> = { ar: 180, en: 200 };

function select<T extends { featured?: boolean }>(items: T[], { featured, limit }: ListOptions = {}): T[] {
  const filtered = featured ? items.filter((item) => item.featured) : items;
  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}

const byOrder = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

/** Reads the content of one language out of a snapshot. */
export class ContentReader {
  private readonly media: Map<string, MediaRow>;
  private readonly sectionsByKey: Map<string, SectionRow>;

  constructor(
    readonly snapshot: CmsSnapshot,
    readonly locale: Locale,
    /** Public Storage URL prefix, e.g. https://x.supabase.co/storage/v1/object/public */
    private readonly storageBaseUrl: string | null,
    /** Bundled dictionary: defaults for interface strings the CMS leaves empty. */
    private readonly fallbackDictionary: Dictionary,
  ) {
    this.media = new Map(snapshot.media.map((row) => [row.id, row]));
    this.sectionsByKey = new Map(snapshot.sections.map((row) => [`${row.page_key}.${row.key}`, row]));
  }

  /* ---- primitives ---- */

  private get settings() {
    return this.snapshot.settings;
  }

  /** Text in this language with the identity tokens filled in. */
  text(value: L | undefined): string {
    return this.fill(value?.[this.locale] ?? "");
  }

  private fill(text: string): string {
    if (!text.includes("{")) return text;
    return text.replaceAll("{doctorName}", this.identity().name).replaceAll("{doctorRole}", this.identity().role);
  }

  private optional(value: L | undefined): string | undefined {
    return this.text(value) || undefined;
  }

  private parts(value: L<TitlePart[]> | undefined): TitlePart[] {
    return (value?.[this.locale] ?? []).map((part) => {
      const out: TitlePart = { text: this.fill(part.text) };
      if (part.accent) out.accent = true;
      if (part.breakAfter) out.breakAfter = true;
      return out;
    });
  }

  private list(value: L<string[]> | undefined): string[] {
    return (value?.[this.locale] ?? []).map((item) => this.fill(item));
  }

  heading(doc: HeadingDoc | undefined): SectionHeading {
    const out: SectionHeading = { eyebrow: this.text(doc?.eyebrow), title: this.parts(doc?.title) };
    const description = this.optional(doc?.description);
    if (description) out.description = description;
    return out;
  }

  cta(doc: CtaDoc | undefined): Cta {
    const out: Cta = { label: this.text(doc?.label), href: doc?.href ?? routes.home };
    if (doc?.external) out.external = true;
    const ariaLabel = this.optional(doc?.ariaLabel);
    if (ariaLabel) out.ariaLabel = ariaLabel;
    if (doc?.icon) out.icon = doc.icon;
    return out;
  }

  private action(doc: ActionDoc | undefined): CtaAction {
    if (doc?.kind === "whatsapp") return { kind: "whatsapp", label: this.text(doc.label), message: this.text(doc.message) };
    return { kind: "link", label: this.text(doc?.label), href: doc?.href ?? routes.contact };
  }

  /* ---- media ---- */

  mediaUrl(row: MediaRow): string {
    if (!row.bucket) return row.path;
    const path = row.path.split("/").map(encodeURIComponent).join("/");
    return `${this.storageBaseUrl ?? ""}/${row.bucket}/${path}`;
  }

  /** An image by media id, with this language's alt text. */
  image(mediaId: string | null | undefined, objectPosition?: string | null): MediaImage {
    const row = mediaId ? this.media.get(mediaId) : undefined;
    if (!row) return { src: MISSING_IMAGE, alt: "", width: 1, height: 1 };
    const out: MediaImage = {
      src: this.mediaUrl(row),
      alt: this.fill(this.locale === "ar" ? row.alt_ar : row.alt_en),
      width: row.width ?? 1200,
      height: row.height ?? 900,
    };
    if (objectPosition) out.objectPosition = objectPosition;
    return out;
  }

  /** A section's image slot; English uses `<slot>En` when the English image differs. */
  slot(section: SectionRow | undefined, slot: string): MediaImage | undefined {
    if (!section) return undefined;
    const rows = this.snapshot.sectionMedia.filter((row) => row.section_id === section.id);
    const pick = (this.locale === "en" && rows.find((row) => row.slot === `${slot}En`)) || rows.find((row) => row.slot === slot);
    if (!pick) return undefined;
    const image = this.image(pick.media_id, pick.object_position);
    const alt = this.locale === "ar" ? pick.alt_ar : pick.alt_en;
    return alt ? { ...image, alt: this.fill(alt) } : image;
  }

  private requiredSlot(section: SectionRow | undefined, slot: string): MediaImage {
    return this.slot(section, slot) ?? this.image(null);
  }

  /* ---- sections ---- */

  section(page: string, key: string): SectionRow | undefined {
    return this.sectionsByKey.get(`${page}.${key}`);
  }

  private doc<T>(page: string, key: string): Partial<T> {
    return (this.section(page, key)?.content ?? {}) as Partial<T>;
  }

  /** Keys of the visible sections of a page, in display order (dialog copy excluded). */
  sectionOrder(page: string): string[] {
    const def = cmsPages.find((p) => p.key === page);
    const visual = new Set(def?.sections.filter((s) => !s.copyOnly).map((s) => s.key));
    return this.snapshot.sections
      .filter((row) => row.page_key === page && visual.has(row.key))
      .sort(byOrder)
      .map((row) => row.key);
  }

  hero(page: string): HeroContent {
    const row = this.section(page, "hero");
    const doc = (row?.content ?? {}) as Partial<HeroDoc>;
    const image: ArtDirectedImage = { desktop: this.requiredSlot(row, "desktop") };
    const mobile = this.slot(row, "mobile");
    if (mobile) image.mobile = mobile;
    const out: HeroContent = {
      eyebrow: this.text(doc.eyebrow),
      title: this.parts(doc.title),
      description: this.text(doc.description),
      primaryCta: this.cta(doc.primaryCta),
      image,
    };
    if (doc.secondaryCta) out.secondaryCta = this.cta(doc.secondaryCta);
    const cards = (doc.floatingCards ?? []).map((card) => ({ icon: card.icon as never, title: this.text(card.title), text: this.text(card.text) }));
    if (cards.length) out.floatingCards = cards;
    const cue = this.optional(doc.scrollCueLabel);
    if (cue) out.scrollCueLabel = cue;
    return out;
  }

  private band(doc: Partial<CtaBandDoc>, imageSection: SectionRow | undefined): SiteCtaContent {
    return {
      eyebrow: this.text(doc.eyebrow),
      title: this.parts(doc.title),
      description: this.text(doc.description),
      primaryAction: this.action(doc.primaryAction),
      secondaryAction: this.action(doc.secondaryAction),
      image: this.requiredSlot(imageSection, "image"),
    };
  }

  /** The shared call-to-action band. */
  siteCta(): SiteCtaContent {
    return this.band(this.doc<CtaBandDoc>("global", "siteCta"), this.section("global", "siteCta"));
  }

  /** A page's closing band: the shared one or its own text (with the shared image). */
  pageCta(page: string): SiteCtaContent {
    const doc = this.doc<PageCtaDoc>(page, "cta") as Partial<CtaBandDoc> & { mode?: string };
    return doc.mode === "custom" ? this.band(doc, this.section("global", "siteCta")) : this.siteCta();
  }

  pageSeo(page: string): { title: string; description: string } {
    const row = this.snapshot.pages.find((p) => p.key === page);
    const title = (this.locale === "ar" ? row?.seo_title_ar : row?.seo_title_en) || this.identity().title;
    const description = (this.locale === "ar" ? row?.seo_description_ar : row?.seo_description_en) || this.identity().description;
    return { title: this.fill(title), description: this.fill(description) };
  }

  /* ---- settings ---- */

  private identityMemo?: SiteIdentityContent;
  private dictionaryMemo?: Dictionary;

  identity(): SiteIdentityContent {
    if (this.identityMemo) return this.identityMemo;
    const s = this.settings;
    const ar = this.locale === "ar";
    const ogId = ar ? s?.og_image_ar_id : (s?.og_image_en_id ?? s?.og_image_ar_id);
    // Built from the media row directly: image() fills identity tokens, which would recurse.
    const ogRow = ogId ? this.media.get(ogId) : undefined;
    const og = ogRow ? { src: this.mediaUrl(ogRow), width: ogRow.width ?? 1200, height: ogRow.height ?? 630 } : { src: MISSING_IMAGE, width: 1, height: 1 };
    return (this.identityMemo = {
      name: (ar ? s?.doctor_name_ar : s?.doctor_name_en) ?? "",
      role: (ar ? s?.doctor_role_ar : s?.doctor_role_en) ?? "",
      title: (ar ? s?.default_title_ar : s?.default_title_en) ?? "",
      description: (ar ? s?.default_description_ar : s?.default_description_en) ?? "",
      ogImage: { src: og.src, width: og.width, height: og.height },
    });
  }

  contactSettings(): ContactSettings {
    const phone = this.settings?.phone_digits ?? "";
    return {
      phoneDigits: phone || PLACEHOLDER_PHONE,
      whatsappDigits: this.settings?.whatsapp_digits || phone || PLACEHOLDER_PHONE,
      isPlaceholder: !phone,
      placeholderDisplay: PLACEHOLDER_PHONE_DISPLAY,
    };
  }

  bookingHref(): string {
    return this.settings?.booking_href || routes.contact;
  }

  navigation(): NavItemContent[] {
    return [...this.snapshot.navigation].sort(byOrder).map((row) => ({
      key: row.key,
      href: row.href,
      label: this.locale === "ar" ? row.label_ar : row.label_en,
      showInHeader: row.show_in_header,
      showInFooter: row.show_in_footer,
    }));
  }

  socials(): SocialLinkContent[] {
    return [...this.snapshot.socials].sort(byOrder).map((row) => ({ platform: row.platform, href: row.url }));
  }

  dictionary(): Dictionary {
    if (this.dictionaryMemo) return this.dictionaryMemo;
    const navLabels = Object.fromEntries(this.snapshot.navigation.map((row) => [row.key, this.locale === "ar" ? row.label_ar : row.label_en]));
    return (this.dictionaryMemo = buildDictionary(this.locale, this.snapshot.uiStrings, navLabels, this.fallbackDictionary));
  }

  /* ---- collections ---- */

  services(options?: ListOptions): Service[] {
    const items = [...this.snapshot.services].sort(byOrder).map((row): Service => {
      const out: Service = {
        slug: row.slug,
        icon: row.icon as Service["icon"],
        order: row.sort_order,
        title: this.locale === "ar" ? row.title_ar : row.title_en,
        description: this.locale === "ar" ? row.description_ar : row.description_en,
        details: this.locale === "ar" ? row.details_ar : row.details_en,
        image: this.image(row.image_id),
      };
      if (row.featured) out.featured = true;
      return out;
    });
    return select(items, options);
  }

  conditions(options?: ListOptions): Condition[] {
    const items = [...this.snapshot.conditions].sort(byOrder).map((row): Condition => {
      const ar = this.locale === "ar";
      const out: Condition = {
        slug: row.slug,
        icon: row.icon as Condition["icon"],
        order: row.sort_order,
        title: ar ? row.title_ar : row.title_en,
        excerpt: ar ? row.excerpt_ar : row.excerpt_en,
        symptoms: ar ? row.symptoms_ar : row.symptoms_en,
        details: ar ? row.details_ar : row.details_en,
        image: this.image(row.image_id),
      };
      if (row.featured) out.featured = true;
      return out;
    });
    return select(items, options);
  }

  specialties(): Specialty[] {
    const services = new Map(this.snapshot.services.map((row) => [row.id, row.slug]));
    return [...this.snapshot.specialties].sort(byOrder).map((row) => {
      const service = row.service_id ? services.get(row.service_id) : undefined;
      return {
        slug: row.slug,
        icon: row.icon as Specialty["icon"],
        order: row.sort_order,
        title: this.locale === "ar" ? row.title_ar : row.title_en,
        description: this.locale === "ar" ? row.description_ar : row.description_en,
        image: this.image(row.image_id),
        // Opens the matching service dialog on /services.
        href: service ? `${routes.services}#${service}` : routes.services,
      };
    });
  }

  qualifications(): Qualification[] {
    return [...this.snapshot.qualifications].sort(byOrder).map((row) => {
      const ar = this.locale === "ar";
      return {
        id: row.key,
        kind: row.kind,
        year: row.year,
        order: row.sort_order,
        title: ar ? row.title_ar : row.title_en,
        institution: ar ? row.institution_ar : row.institution_en,
        description: ar ? row.description_ar : row.description_en,
        image: this.image(row.image_id),
      };
    });
  }

  steps(group: "journey" | "diagnosis" | "career"): JourneyStep[] {
    return this.snapshot.timelineSteps
      .filter((row) => row.group_key === group)
      .sort(byOrder)
      .map((row) => {
        const ar = this.locale === "ar";
        const out: JourneyStep = {
          id: row.key,
          icon: row.icon as JourneyStep["icon"],
          title: ar ? row.title_ar : row.title_en,
          description: ar ? row.description_ar : row.description_en,
        };
        const meta = ar ? row.meta_ar : row.meta_en;
        if (meta) out.meta = meta;
        return out;
      });
  }

  homeStats(): Stat[] {
    return this.snapshot.stats
      .filter((row) => row.group_key === "home" && row.value !== null)
      .sort(byOrder)
      .map((row) => {
        const out: Stat = {
          id: row.key,
          value: Number(row.value),
          label: this.locale === "ar" ? row.label_ar : row.label_en,
          icon: row.icon as Stat["icon"],
        };
        if (row.prefix) out.prefix = row.prefix;
        if (row.suffix) out.suffix = row.suffix;
        return out;
      });
  }

  aboutStatItems(): AboutPageContent["stats"]["items"] {
    return this.snapshot.stats
      .filter((row) => row.group_key === "about" && row.count_of)
      .sort(byOrder)
      .map((row) => ({
        id: row.key,
        label: this.locale === "ar" ? row.label_ar : row.label_en,
        icon: row.icon as Stat["icon"],
        countOf: row.count_of!,
      }));
  }

  private video(row: VideoRow): Video {
    const ar = this.locale === "ar";
    const poster = this.image(row.poster_id);
    const out: Video = {
      slug: row.slug,
      poster,
      orientation: row.orientation,
      order: row.sort_order,
      title: ar ? row.title_ar : row.title_en,
    };
    const description = ar ? row.description_ar : row.description_en;
    if (description) out.description = description;
    if (row.duration) out.duration = row.duration;
    if (row.youtube_id) out.youtubeId = row.youtube_id;
    if (row.featured) out.featured = true;
    const fileId = ar ? row.file_ar_id : (row.file_en_id ?? row.file_ar_id);
    const file = fileId ? this.media.get(fileId) : undefined;
    if (file) out.sources = [{ src: this.mediaUrl(file), type: file.mime_type === "video/webm" ? "video/webm" : "video/mp4" }];
    return out;
  }

  videos(options?: ListOptions): Video[] {
    return select([...this.snapshot.videos].filter((row) => row.listed).sort(byOrder).map((row) => this.video(row)), options);
  }

  /** The video of a section (home intro, about video). */
  sectionVideo(page: string, key: string): Video {
    const id = this.section(page, key)?.video_id;
    const row = this.snapshot.videos.find((video) => video.id === id);
    if (row) return this.video(row);
    return { slug: "missing-video", poster: this.image(null), orientation: "landscape", order: 0, title: "" };
  }

  reviews(options?: ListOptions): Review[] {
    const items = [...this.snapshot.reviews].sort(byOrder).map((row): Review => {
      const ar = this.locale === "ar";
      const out: Review = {
        id: row.key,
        rating: Math.min(5, Math.max(1, row.rating)) as Review["rating"],
        name: ar ? row.name_ar : row.name_en,
        text: ar ? row.text_ar : row.text_en,
      };
      const context = ar ? row.context_ar : row.context_en;
      if (context) out.context = context;
      if (row.featured) out.featured = true;
      if (row.avatar_id) out.avatar = this.image(row.avatar_id);
      return out;
    });
    return select(items, options);
  }

  faqs(options?: ListOptions): Faq[] {
    const items = [...this.snapshot.faqs].sort(byOrder).map((row): Faq => {
      const ar = this.locale === "ar";
      const out: Faq = { id: row.key, question: ar ? row.question_ar : row.question_en, answer: ar ? row.answer_ar : row.answer_en };
      if (row.featured) out.featured = true;
      return out;
    });
    return select(items, options);
  }

  articles(options?: ListOptions): ArticleWithMeta[] {
    const categories = new Map(this.snapshot.articleCategories.map((row) => [row.id, row]));
    const items = [...this.snapshot.articles].sort(byOrder).map((row): ArticleWithMeta => {
      const ar = this.locale === "ar";
      const category = row.category_id ? categories.get(row.category_id) : undefined;
      const body = (ar ? row.body_ar : row.body_en) ?? [];
      const out: ArticleWithMeta = {
        slug: row.slug,
        publishedAt: row.published_at,
        order: row.sort_order,
        title: ar ? row.title_ar : row.title_en,
        excerpt: ar ? row.excerpt_ar : row.excerpt_en,
        category: category ? (ar ? category.name_ar : category.name_en) : "",
        image: this.image(row.cover_id),
        body,
        readingMinutes: Math.max(2, Math.ceil(countWords(body) / WORDS_PER_MINUTE[this.locale])),
      };
      if (row.featured) out.featured = true;
      return out;
    });
    return select(items, options);
  }

  contactInfo(): ContactInfo {
    const s = this.settings;
    const ar = this.locale === "ar";
    const info: ContactInfo = {
      address: { lines: (ar ? s?.address_lines_ar : s?.address_lines_en) ?? [], isPlaceholder: s?.address_is_placeholder ?? true },
      hours: ((ar ? s?.hours_ar : s?.hours_en) ?? []).map((h) => ({ days: h.days, time: h.time })),
      hoursArePlaceholder: s?.hours_are_placeholder ?? true,
      map: {
        lat: Number(s?.map_lat ?? 0),
        lng: Number(s?.map_lng ?? 0),
        zoom: s?.map_zoom ?? 15,
        label: (ar ? s?.map_label_ar : s?.map_label_en) ?? "",
        isPlaceholder: s?.map_is_placeholder ?? true,
      },
    };
    if (s?.email) info.email = s.email;
    return info;
  }

  /* ---- pages ---- */

  home(): HomeContent {
    const intro = this.doc<HomeIntroDoc>("home", "intro");
    const stats = this.section("home", "stats");
    const services = this.doc<CollectionDoc>("home", "services");
    const aboutRow = this.section("home", "about");
    const about = (aboutRow?.content ?? {}) as Partial<HomeAboutDoc>;
    const conditions = this.doc<CollectionDoc>("home", "conditions");
    const journey = this.doc<HeadingOnlyDoc>("home", "journey");
    const videos = this.doc<CollectionDoc>("home", "videos");
    const rf = this.doc<HomeReviewsFaqDoc>("home", "reviewsFaq");
    const identity = this.identity();
    return {
      hero: this.hero("home"),
      intro: {
        heading: this.heading(intro.heading),
        highlights: (intro.highlights ?? []).map((item) => ({ icon: item.icon as never, label: this.text(item.label) })),
        link: this.cta(intro.link),
        video: this.sectionVideo("home", "intro"),
      },
      stats: {
        heading: this.heading((stats?.content as Partial<HeadingOnlyDoc> | undefined)?.heading),
        stats: this.homeStats(),
        doctorImage: this.requiredSlot(stats, "doctorImage"),
        doctorName: identity.name,
        doctorRole: identity.role,
      },
      services: { heading: this.heading(services.heading), cta: this.cta(services.cta) },
      about: {
        heading: this.heading(about.heading),
        points: (about.points ?? []).map((p) => ({ icon: p.icon as never, title: this.text(p.title), text: this.text(p.text) })),
        image: this.requiredSlot(aboutRow, "image"),
        badge: { icon: (about.badge?.icon ?? "heartHandshake") as never, label: this.text(about.badge?.label) },
        cta: this.cta(about.cta),
      },
      conditions: { heading: this.heading(conditions.heading), cta: this.cta(conditions.cta) },
      journey: { heading: this.heading(journey.heading), steps: this.steps("journey") },
      videos: { heading: this.heading(videos.heading), cta: this.cta(videos.cta) },
      reviewsFaq: {
        reviews: { heading: this.heading(rf.reviews?.heading), cta: this.cta(rf.reviews?.cta) },
        faq: { heading: this.heading(rf.faq?.heading), cta: this.cta(rf.faq?.cta) },
        cta: this.cta(rf.cta),
      },
      finalCta: this.pageCta("home"),
    };
  }

  about(): AboutPageContent {
    const identity = this.identity();
    const introRow = this.section("about", "introduction");
    const intro = (introRow?.content ?? {}) as Partial<AboutIntroDoc>;
    const quals = this.doc<AboutQualificationsDoc>("about", "qualifications");
    const specialties = this.doc<CollectionDoc>("about", "specialties");
    const philosophyRow = this.section("about", "philosophy");
    const philosophy = (philosophyRow?.content ?? {}) as Partial<AboutPhilosophyDoc>;
    return {
      seo: this.pageSeo("about"),
      hero: this.hero("about"),
      video: { heading: this.heading(this.doc<HeadingOnlyDoc>("about", "video").heading), video: this.sectionVideo("about", "video") },
      introduction: {
        eyebrow: this.text(intro.eyebrow),
        title: this.parts(intro.title),
        paragraphs: this.list(intro.paragraphs),
        bullets: this.list(intro.bullets),
        image: this.requiredSlot(introRow, "image"),
        caption: { icon: (intro.captionIcon ?? "stethoscope") as never, title: identity.name, subtitle: identity.role },
        cta: this.cta(intro.cta),
      },
      qualifications: { heading: this.heading(quals.heading), note: this.text(quals.note) },
      specialties: { heading: this.heading(specialties.heading), cta: this.cta(specialties.cta) },
      stats: { heading: this.heading(this.doc<HeadingOnlyDoc>("about", "stats").heading), items: this.aboutStatItems() },
      philosophy: {
        eyebrow: this.text(philosophy.eyebrow),
        title: this.parts(philosophy.title),
        quote: this.text(philosophy.quote),
        attribution: { name: identity.name, role: identity.role },
        values: (philosophy.values ?? []).map((v) => ({ icon: v.icon as never, label: this.text(v.label) })),
        image: this.requiredSlot(philosophyRow, "image"),
      },
      career: { heading: this.heading(this.doc<HeadingOnlyDoc>("about", "career").heading), steps: this.steps("career") },
    };
  }

  servicesPage(): ServicesPageContent {
    const dialog = this.doc<ServicesDialogDoc>("services", "dialog");
    return {
      seo: this.pageSeo("services"),
      hero: this.hero("services"),
      procedures: { heading: this.heading(this.doc<HeadingOnlyDoc>("services", "procedures").heading) },
      conditions: { heading: this.heading(this.doc<HeadingOnlyDoc>("services", "conditions").heading) },
      diagnosis: { heading: this.heading(this.doc<HeadingOnlyDoc>("services", "diagnosis").heading), steps: this.steps("diagnosis") },
      dialog: {
        bookLabel: this.text(dialog.bookLabel),
        whatsappLabel: this.text(dialog.whatsappLabel),
        whatsappMessage: this.text(dialog.whatsappMessage),
        disclaimer: this.text(dialog.disclaimer),
      },
    };
  }

  videosPage(): VideosPageContent {
    return {
      seo: this.pageSeo("videos"),
      hero: this.hero("videos"),
      gallery: { heading: this.heading(this.doc<HeadingOnlyDoc>("videos", "gallery").heading) },
    };
  }

  reviewsPage(): ReviewsPageContent {
    const faq = this.doc<ReviewsFaqDoc>("reviews", "faq");
    return {
      seo: this.pageSeo("reviews"),
      hero: this.hero("reviews"),
      reviews: { heading: this.heading(this.doc<HeadingOnlyDoc>("reviews", "reviews").heading) },
      faq: {
        heading: this.heading(faq.heading),
        help: {
          title: this.text(faq.help?.title),
          text: this.text(faq.help?.text),
          whatsappLabel: this.text(faq.help?.whatsappLabel),
          whatsappMessage: this.text(faq.help?.whatsappMessage),
          callLabel: this.text(faq.help?.callLabel),
        },
      },
    };
  }

  articlesPage(): ArticlesPageContent {
    const list = this.doc<ArticlesListDoc>("articles", "articles");
    return {
      seo: this.pageSeo("articles"),
      hero: this.hero("articles"),
      heading: this.heading(list.heading),
      featuredLabel: this.text(list.featuredLabel),
      moreTitle: this.text(list.moreTitle),
      readLabel: this.text(list.readLabel),
      dialog: { disclaimer: this.text(list.dialog?.disclaimer), ctaLabel: this.text(list.dialog?.ctaLabel) },
    };
  }

  contactPage(): ContactPageContent {
    const form = this.doc<ContactFormDoc>("contact", "form");
    const location = this.doc<ContactLocationDoc>("contact", "location");
    const c = form.copy;
    const fields = ["name", "phone", "email", "subject", "message"] as const;
    const perField = (values: Partial<Record<(typeof fields)[number], L>> | undefined) =>
      Object.fromEntries(fields.map((field) => [field, this.text(values?.[field])])) as Record<(typeof fields)[number], string>;
    const l = location.labels;
    return {
      seo: this.pageSeo("contact"),
      hero: this.hero("contact"),
      form: {
        heading: this.heading(form.heading),
        copy: {
          labels: perField(c?.labels),
          placeholders: perField(c?.placeholders),
          subjects: this.list(c?.subjects),
          optional: this.text(c?.optional),
          submit: this.text(c?.submit),
          sending: this.text(c?.sending),
          errorSummary: this.text(c?.errorSummary),
          success: { title: this.text(c?.success?.title), text: this.text(c?.success?.text) },
          notConfigured: {
            title: this.text(c?.notConfigured?.title),
            text: this.text(c?.notConfigured?.text),
            whatsappLabel: this.text(c?.notConfigured?.whatsappLabel),
          },
          failure: { title: this.text(c?.failure?.title), text: this.text(c?.failure?.text) },
        },
        whatsappLabel: this.text(form.whatsappLabel),
        whatsappMessage: this.text(form.whatsappMessage),
        callLabel: this.text(form.callLabel),
      },
      location: {
        heading: this.heading(location.heading),
        labels: {
          address: this.text(l?.address),
          hours: this.text(l?.hours),
          phone: this.text(l?.phone),
          email: this.text(l?.email),
          directions: this.text(l?.directions),
          placeholderNote: this.text(l?.placeholderNote),
        },
      },
      cta: this.pageCta("contact"),
    };
  }
}

function countWords(body: ArticleBlock[]): number {
  const text = body
    .map((block) => {
      switch (block.type) {
        case "paragraph":
        case "heading":
          return block.text;
        case "list":
          return block.items.join(" ");
        case "callout":
          return `${block.title} ${block.text}`;
      }
    })
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
