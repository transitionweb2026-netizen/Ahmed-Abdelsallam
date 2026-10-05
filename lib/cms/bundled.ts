/**
 * The content bundled in data/ (and config/), expressed as CMS rows.
 *
 * Used three ways:
 *  - the website renders from it while Supabase is not configured;
 *  - the first import writes these rows into Supabase (supabase/seed/content.sql,
 *    or Dashboard → Import content);
 *  - tests check that mapping these rows reproduces the original content.
 *
 * Ids are deterministic (derived from each row's natural key), so the same
 * content always gets the same ids. Whenever the Arabic and English data
 * disagree on a shared field (a link, an icon), building fails loudly
 * instead of silently dropping one of them.
 */
import { createHash } from "node:crypto";
import { mainNav } from "@/config/routes";
import { siteConfig, siteIdentity } from "@/config/site";
import { articlesText as arArticles } from "@/data/ar/articles";
import { careerText as arCareer } from "@/data/ar/career";
import { conditionsText as arConditions } from "@/data/ar/conditions";
import { contactText as arContact } from "@/data/ar/contact";
import { siteCta as arCta } from "@/data/ar/cta";
import { faqsText as arFaqs } from "@/data/ar/faqs";
import { homeCopy as arHome } from "@/data/ar/home";
import { aboutPage as arAbout } from "@/data/ar/pages/about";
import { articlesPage as arArticlesPage } from "@/data/ar/pages/articles";
import { contactPage as arContactPage } from "@/data/ar/pages/contact";
import { reviewsPage as arReviewsPage } from "@/data/ar/pages/reviews";
import { servicesPage as arServicesPage } from "@/data/ar/pages/services";
import { videosPage as arVideosPage } from "@/data/ar/pages/videos";
import { qualificationsText as arQualifications } from "@/data/ar/qualifications";
import { reviewsText as arReviews } from "@/data/ar/reviews";
import { servicesText as arServices } from "@/data/ar/services";
import { specialtiesText as arSpecialties } from "@/data/ar/specialties";
import { introVideoText as arIntroVideo, videosText as arVideos } from "@/data/ar/videos";
import { articlesText as enArticles } from "@/data/en/articles";
import { careerText as enCareer } from "@/data/en/career";
import { conditionsText as enConditions } from "@/data/en/conditions";
import { contactText as enContact } from "@/data/en/contact";
import { siteCta as enCta } from "@/data/en/cta";
import { faqsText as enFaqs } from "@/data/en/faqs";
import { homeCopy as enHome } from "@/data/en/home";
import { aboutPage as enAbout } from "@/data/en/pages/about";
import { articlesPage as enArticlesPage } from "@/data/en/pages/articles";
import { contactPage as enContactPage } from "@/data/en/pages/contact";
import { reviewsPage as enReviewsPage } from "@/data/en/pages/reviews";
import { servicesPage as enServicesPage } from "@/data/en/pages/services";
import { videosPage as enVideosPage } from "@/data/en/pages/videos";
import { qualificationsText as enQualifications } from "@/data/en/qualifications";
import { reviewsText as enReviews } from "@/data/en/reviews";
import { servicesText as enServices } from "@/data/en/services";
import { specialtiesText as enSpecialties } from "@/data/en/specialties";
import { introVideoText as enIntroVideo, videosText as enVideos } from "@/data/en/videos";
import { articleBase } from "@/data/shared/articles";
import { careerBase } from "@/data/shared/career";
import { conditionBase } from "@/data/shared/conditions";
import { contactBase } from "@/data/shared/contact";
import { faqBase } from "@/data/shared/faqs";
import { qualificationBase } from "@/data/shared/qualifications";
import { reviewBase } from "@/data/shared/reviews";
import { serviceBase } from "@/data/shared/services";
import { specialtyBase } from "@/data/shared/specialties";
import { introVideoBase, videoBase } from "@/data/shared/videos";
import { getDictionary } from "@/i18n/dictionaries";
import type { Dictionary } from "@/i18n/dictionary";
import { cmsPages } from "@/lib/cms/pages";
import type { CtaBandDoc, HeroDoc, SectionDocs, SectionType } from "@/lib/cms/section-docs";
import { flattenDictionary } from "@/lib/cms/ui-strings";
import type {
  ActionDoc,
  ArticleCategoryRow,
  ArticleRow,
  CmsSnapshot,
  ConditionRow,
  CtaDoc,
  FaqRow,
  HeadingDoc,
  L,
  MediaRow,
  NavRow,
  PageRow,
  QualificationRow,
  ReviewRow,
  SectionMediaRow,
  SectionRow,
  ServiceRow,
  SettingsRow,
  SocialRow,
  SpecialtyRow,
  StatRow,
  TimelineStepRow,
  UiStringRow,
  VideoRow,
} from "@/lib/cms/types";
import type {
  ArtDirectedImage,
  Cta,
  CtaAction,
  HeroContent,
  JourneyStep,
  MediaImage,
  RichTitle,
  SectionHeading,
  TitlePart,
  VideoFile,
} from "@/types/content";

/* ---- Ids --------------------------------------------------------------- */

/** Deterministic UUID (version 5 layout) for a natural key, e.g. "service:fractures". */
export function stableId(name: string): string {
  const hash = createHash("sha1").update(`dr-ahmed-abdelsalam-cms:${name}`).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.subarray(0, 16).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/* ---- Small helpers ----------------------------------------------------- */

const pair = <T>(ar: T, en: T): L<T> => ({ ar, en });

/** Fails the build when a shared (language-neutral) value differs between languages. */
function same<T>(ar: T, en: T, what: string): T {
  if (JSON.stringify(ar) !== JSON.stringify(en)) {
    throw new Error(`Bundled content: "${what}" differs between Arabic and English (${JSON.stringify(ar)} / ${JSON.stringify(en)}).`);
  }
  return ar;
}

function zip<A, B>(ar: readonly A[], en: readonly B[], what: string): [A, B][] {
  if (ar.length !== en.length) throw new Error(`Bundled content: "${what}" has ${ar.length} Arabic and ${en.length} English items.`);
  return ar.map((item, index) => [item, en[index]]);
}

const toParts = (title: RichTitle): TitlePart[] => (typeof title === "string" ? [{ text: title }] : title.map((part) => ({ ...part })));

function heading(ar: SectionHeading, en: SectionHeading): HeadingDoc {
  return {
    eyebrow: pair(ar.eyebrow, en.eyebrow),
    title: pair(toParts(ar.title), toParts(en.title)),
    description: pair(ar.description ?? "", en.description ?? ""),
  };
}

function cta(ar: Cta, en: Cta, what: string): CtaDoc {
  const doc: CtaDoc = { label: pair(ar.label, en.label), href: same(ar.href, en.href, `${what}.href`) };
  const external = same(ar.external, en.external, `${what}.external`);
  if (external) doc.external = true;
  const icon = same(ar.icon, en.icon, `${what}.icon`);
  if (icon) doc.icon = icon;
  if (ar.ariaLabel || en.ariaLabel) doc.ariaLabel = pair(ar.ariaLabel ?? "", en.ariaLabel ?? "");
  return doc;
}

function action(ar: CtaAction, en: CtaAction, what: string): ActionDoc {
  if (ar.kind === "whatsapp" && en.kind === "whatsapp") {
    return { kind: "whatsapp", label: pair(ar.label, en.label), message: pair(ar.message, en.message) };
  }
  if (ar.kind === "link" && en.kind === "link") {
    return { kind: "link", label: pair(ar.label, en.label), href: same(ar.href, en.href, `${what}.href`) };
  }
  throw new Error(`Bundled content: "${what}" is a different kind of action in Arabic and English.`);
}

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  webm: "video/webm",
  mp4: "video/mp4",
};

/* ---- Builder ------------------------------------------------------------ */

/** The identity strings that bundled copy derives from config/site.ts, as tokens. */
const TOKENS = { name: "{doctorName}", role: "{doctorRole}" } as const;

class Builder {
  media = new Map<string, MediaRow>();
  sections: SectionRow[] = [];
  sectionMedia: SectionMediaRow[] = [];
  steps: TimelineStepRow[] = [];
  stats: StatRow[] = [];

  /** Registers a file shipped in /public and returns its media id. */
  file(src: string, size: { width?: number; height?: number }, alt: Partial<L>): string {
    let row = this.media.get(src);
    if (!row) {
      const ext = src.split(".").pop()?.toLowerCase() ?? "";
      const mime = MIME[ext];
      if (!mime) throw new Error(`Bundled content: unknown file type for ${src}.`);
      row = {
        id: stableId(`media:${src}`),
        kind: mime.startsWith("video/") ? "video" : "image",
        bucket: null,
        path: src,
        mime_type: mime,
        size_bytes: null,
        width: size.width ?? null,
        height: size.height ?? null,
        duration_seconds: null,
        title: src.split("/").pop() ?? src,
        alt_ar: "",
        alt_en: "",
        legacy_path: src,
      };
      this.media.set(src, row);
    }
    if (alt.ar && !row.alt_ar) row.alt_ar = alt.ar;
    if (alt.en && !row.alt_en) row.alt_en = alt.en;
    return row.id;
  }

  image(ar: MediaImage, en: MediaImage, what: string): string {
    same(ar.src, en.src, `${what}.src`);
    return this.file(ar.src, ar, { ar: ar.alt, en: en.alt });
  }

  section<T extends SectionType>(page: string, key: string, content: SectionDocs[T], extra?: { videoId?: string }): string {
    const def = cmsPages.find((p) => p.key === page)?.sections.find((s) => s.key === key);
    if (!def) throw new Error(`No section ${page}.${key} in lib/cms/pages.ts`);
    const index = cmsPages.find((p) => p.key === page)!.sections.indexOf(def);
    const id = stableId(`section:${page}.${key}`);
    this.sections.push({
      id,
      page_key: page,
      key,
      type: def.type,
      sort_order: (index + 1) * 10,
      visible: true,
      content: content as unknown as Record<string, unknown>,
      video_id: extra?.videoId ?? null,
    });
    return id;
  }

  /** Attaches an image to a section slot; alt text differing from the file's own becomes an override. */
  slot(sectionId: string, slot: string, mediaId: string, objectPosition?: string, alt: Partial<L> = {}) {
    const media = [...this.media.values()].find((row) => row.id === mediaId);
    const override = (value: string | undefined, own: string | undefined) => (value && value !== own ? value : null);
    this.sectionMedia.push({
      section_id: sectionId,
      slot,
      media_id: mediaId,
      object_position: objectPosition ?? null,
      alt_ar: override(alt.ar, media?.alt_ar),
      alt_en: override(alt.en, media?.alt_en),
    });
  }

  imageSlot(sectionId: string, slot: string, ar: MediaImage, en: MediaImage, what: string) {
    this.slot(sectionId, slot, this.image(ar, en, what), undefined, { ar: ar.alt, en: en.alt });
  }

  /** Hero content + its image slots (English slots only where the English image differs). */
  hero(page: string, ar: HeroContent, en: HeroContent, tokens?: (doc: HeroDoc) => HeroDoc) {
    let doc: HeroDoc = {
      eyebrow: pair(ar.eyebrow, en.eyebrow),
      title: pair(toParts(ar.title), toParts(en.title)),
      description: pair(ar.description, en.description),
      primaryCta: cta(ar.primaryCta, en.primaryCta, `${page}.hero.primaryCta`),
      secondaryCta: ar.secondaryCta && en.secondaryCta ? cta(ar.secondaryCta, en.secondaryCta, `${page}.hero.secondaryCta`) : null,
      floatingCards: zip(ar.floatingCards ?? [], en.floatingCards ?? [], `${page}.hero.floatingCards`).map(([a, e], i) => ({
        icon: same(a.icon, e.icon, `${page}.hero.floatingCards.${i}.icon`),
        title: pair(a.title, e.title),
        text: pair(a.text, e.text),
      })),
      scrollCueLabel: pair(ar.scrollCueLabel ?? "", en.scrollCueLabel ?? ""),
    };
    if (tokens) doc = tokens(doc);
    const id = this.section(page, "hero", doc);
    this.heroSlots(id, ar.image, en.image);
  }

  heroSlots(sectionId: string, ar: ArtDirectedImage, en: ArtDirectedImage) {
    for (const crop of ["desktop", "mobile"] as const) {
      const a = ar[crop];
      const e = en[crop];
      if (!a || !e) continue;
      if (a.src === e.src && a.objectPosition === e.objectPosition) {
        this.slot(sectionId, crop, this.file(a.src, a, { ar: a.alt, en: e.alt }), a.objectPosition, { ar: a.alt, en: e.alt });
      } else {
        this.slot(sectionId, crop, this.file(a.src, a, { ar: a.alt }), a.objectPosition, { ar: a.alt });
        this.slot(sectionId, `${crop}En`, this.file(e.src, e, { en: e.alt }), e.objectPosition, { en: e.alt });
      }
    }
  }

  timeline(group: TimelineStepRow["group_key"], ar: readonly JourneyStep[], en: readonly JourneyStep[]) {
    zip(ar, en, `timeline.${group}`).forEach(([a, e], index) => {
      const key = same(a.id, e.id, `timeline.${group}.id`);
      this.steps.push({
        id: stableId(`timeline:${group}.${key}`),
        group_key: group,
        key,
        icon: same(a.icon, e.icon, `timeline.${group}.${key}.icon`),
        sort_order: (index + 1) * 10,
        status: "published",
        title_ar: a.title,
        title_en: e.title,
        description_ar: a.description,
        description_en: e.description,
        meta_ar: a.meta ?? "",
        meta_en: e.meta ?? "",
      });
    });
  }
}

function band(ar: CtaBandShape, en: CtaBandShape, what: string): CtaBandDoc {
  return {
    eyebrow: pair(ar.eyebrow, en.eyebrow),
    title: pair(toParts(ar.title), toParts(en.title)),
    description: pair(ar.description, en.description),
    primaryAction: action(ar.primaryAction, en.primaryAction, `${what}.primaryAction`),
    secondaryAction: action(ar.secondaryAction, en.secondaryAction, `${what}.secondaryAction`),
  };
}

type CtaBandShape = { eyebrow: string; title: TitlePart[]; description: string; primaryAction: CtaAction; secondaryAction: CtaAction };

/** Replaces the identity name/role where the bundled copy derived them from config/site.ts. */
function tokenize(text: string, locale: "ar" | "en"): string {
  const { name, role } = siteIdentity[locale];
  return text.replace(`${name} · ${role}`, `${TOKENS.name} · ${TOKENS.role}`);
}

function videoSources(sources: readonly VideoFile[] | undefined, b: Builder): string | null {
  const first = sources?.[0];
  return first ? b.file(first.src, {}, {}) : null;
}

/** Builds the full snapshot from the bundled content. */
export function buildBundledSnapshot(): CmsSnapshot {
  const b = new Builder();

  /* -- Videos (sections reference the introduction video) -- */
  const videos: VideoRow[] = [];
  const addVideo = (
    base: (typeof videoBase)[number] | typeof introVideoBase,
    ar: { title: string; description?: string; posterAlt: string; sources?: readonly VideoFile[] },
    en: { title: string; description?: string; posterAlt: string; sources?: readonly VideoFile[] },
    listed: boolean,
  ): string => {
    const id = stableId(`video:${base.slug}`);
    videos.push({
      id,
      slug: base.slug,
      orientation: base.orientation,
      duration: base.duration ?? null,
      youtube_id: "youtubeId" in base && typeof base.youtubeId === "string" ? base.youtubeId : null,
      poster_id: b.file(base.poster.src, base.poster, { ar: ar.posterAlt, en: en.posterAlt }),
      file_ar_id: videoSources(ar.sources, b),
      file_en_id: videoSources(en.sources, b),
      listed,
      featured: "featured" in base && base.featured === true,
      sort_order: base.order,
      status: "published",
      title_ar: ar.title,
      title_en: en.title,
      description_ar: ar.description ?? "",
      description_en: en.description ?? "",
    });
    return id;
  };
  const introVideoId = addVideo(introVideoBase, arIntroVideo, enIntroVideo, false);
  for (const base of videoBase) addVideo(base, arVideos[base.slug], enVideos[base.slug], true);

  /* -- Home -- */
  b.hero("home", arHome.hero, enHome.hero, (doc) => ({
    ...doc,
    eyebrow: { ar: tokenize(doc.eyebrow.ar, "ar"), en: tokenize(doc.eyebrow.en, "en") },
  }));
  b.section(
    "home",
    "intro",
    {
      heading: heading(arHome.intro.heading, enHome.intro.heading),
      highlights: zip(arHome.intro.highlights, enHome.intro.highlights, "home.intro.highlights").map(([a, e], i) => ({
        icon: same(a.icon, e.icon, `home.intro.highlights.${i}.icon`),
        label: pair(a.label, e.label),
      })),
      link: cta(arHome.intro.link, enHome.intro.link, "home.intro.link"),
    },
    { videoId: introVideoId },
  );
  const statsSection = b.section("home", "stats", { heading: heading(arHome.stats.heading, enHome.stats.heading) });
  b.imageSlot(statsSection, "doctorImage", arHome.stats.doctorImage, enHome.stats.doctorImage, "home.stats.doctorImage");
  zip(arHome.stats.stats, enHome.stats.stats, "home.stats.stats").forEach(([a, e], index) => {
    const key = same(a.id, e.id, "home.stats.id");
    b.stats.push({
      id: stableId(`stat:home.${key}`),
      group_key: "home",
      key,
      icon: same(a.icon, e.icon, `home.stats.${key}.icon`),
      value: same(a.value, e.value, `home.stats.${key}.value`),
      count_of: null,
      prefix: same(a.prefix ?? "", e.prefix ?? "", `home.stats.${key}.prefix`),
      suffix: same(a.suffix ?? "", e.suffix ?? "", `home.stats.${key}.suffix`),
      sort_order: (index + 1) * 10,
      status: "published",
      label_ar: a.label,
      label_en: e.label,
    });
  });
  b.section("home", "services", {
    heading: heading(arHome.services.heading, enHome.services.heading),
    cta: cta(arHome.services.cta, enHome.services.cta, "home.services.cta"),
  });
  const aboutSection = b.section("home", "about", {
    heading: heading(arHome.about.heading, enHome.about.heading),
    points: zip(arHome.about.points, enHome.about.points, "home.about.points").map(([a, e], i) => ({
      icon: same(a.icon, e.icon, `home.about.points.${i}.icon`),
      title: pair(a.title, e.title),
      text: pair(a.text, e.text),
    })),
    badge: { icon: same(arHome.about.badge.icon, enHome.about.badge.icon, "home.about.badge.icon"), label: pair(arHome.about.badge.label, enHome.about.badge.label) },
    cta: cta(arHome.about.cta, enHome.about.cta, "home.about.cta"),
  });
  b.imageSlot(aboutSection, "image", arHome.about.image, enHome.about.image, "home.about.image");
  b.section("home", "conditions", {
    heading: heading(arHome.conditions.heading, enHome.conditions.heading),
    cta: cta(arHome.conditions.cta, enHome.conditions.cta, "home.conditions.cta"),
  });
  b.section("home", "journey", { heading: heading(arHome.journey.heading, enHome.journey.heading) });
  b.timeline("journey", arHome.journey.steps, enHome.journey.steps);
  b.section("home", "videos", {
    heading: heading(arHome.videos.heading, enHome.videos.heading),
    cta: cta(arHome.videos.cta, enHome.videos.cta, "home.videos.cta"),
  });
  b.section("home", "reviewsFaq", {
    reviews: {
      heading: heading(arHome.reviewsFaq.reviews.heading, enHome.reviewsFaq.reviews.heading),
      cta: cta(arHome.reviewsFaq.reviews.cta, enHome.reviewsFaq.reviews.cta, "home.reviewsFaq.reviews.cta"),
    },
    faq: {
      heading: heading(arHome.reviewsFaq.faq.heading, enHome.reviewsFaq.faq.heading),
      cta: cta(arHome.reviewsFaq.faq.cta, enHome.reviewsFaq.faq.cta, "home.reviewsFaq.faq.cta"),
    },
    cta: cta(arHome.reviewsFaq.cta, enHome.reviewsFaq.cta, "home.reviewsFaq.cta"),
  });
  b.section("home", "cta", { mode: "shared" });

  /* -- Shared call-to-action band -- */
  const bandId = b.section("global", "siteCta", band(arCta, enCta, "siteCta"));
  b.imageSlot(bandId, "image", arCta.image, enCta.image, "siteCta.image");

  /* -- About -- */
  b.hero("about", arAbout.hero, enAbout.hero, (doc) => ({
    ...doc,
    // The hero's name part comes from the settings.
    title: {
      ar: doc.title.ar.map((part) => (part.text === siteIdentity.ar.name ? { ...part, text: TOKENS.name } : part)),
      en: doc.title.en.map((part) => (part.text === siteIdentity.en.name ? { ...part, text: TOKENS.name } : part)),
    },
  }));
  b.section("about", "video", { heading: heading(arAbout.video.heading, enAbout.video.heading) }, { videoId: introVideoId });
  const intro = arAbout.introduction;
  const introEn = enAbout.introduction;
  const introSection = b.section("about", "introduction", {
    eyebrow: pair(intro.eyebrow, introEn.eyebrow),
    title: pair(toParts(intro.title), toParts(introEn.title)),
    paragraphs: pair([...intro.paragraphs], [...introEn.paragraphs]),
    bullets: pair([...intro.bullets], [...introEn.bullets]),
    captionIcon: same(intro.caption.icon, introEn.caption.icon, "about.introduction.caption.icon"),
    cta: cta(intro.cta, introEn.cta, "about.introduction.cta"),
  });
  b.imageSlot(introSection, "image", intro.image, introEn.image, "about.introduction.image");
  b.section("about", "qualifications", {
    heading: heading(arAbout.qualifications.heading, enAbout.qualifications.heading),
    note: pair(arAbout.qualifications.note, enAbout.qualifications.note),
  });
  b.section("about", "specialties", {
    heading: heading(arAbout.specialties.heading, enAbout.specialties.heading),
    cta: cta(arAbout.specialties.cta, enAbout.specialties.cta, "about.specialties.cta"),
  });
  b.section("about", "stats", { heading: heading(arAbout.stats.heading, enAbout.stats.heading) });
  zip(arAbout.stats.items, enAbout.stats.items, "about.stats.items").forEach(([a, e], index) => {
    const key = same(a.id, e.id, "about.stats.id");
    b.stats.push({
      id: stableId(`stat:about.${key}`),
      group_key: "about",
      key,
      icon: same(a.icon, e.icon, `about.stats.${key}.icon`),
      value: null,
      count_of: same(a.countOf, e.countOf, `about.stats.${key}.countOf`),
      prefix: "",
      suffix: "",
      sort_order: (index + 1) * 10,
      status: "published",
      label_ar: a.label,
      label_en: e.label,
    });
  });
  const philosophy = arAbout.philosophy;
  const philosophyEn = enAbout.philosophy;
  const philosophySection = b.section("about", "philosophy", {
    eyebrow: pair(philosophy.eyebrow, philosophyEn.eyebrow),
    title: pair(toParts(philosophy.title), toParts(philosophyEn.title)),
    quote: pair(philosophy.quote, philosophyEn.quote),
    values: zip(philosophy.values, philosophyEn.values, "about.philosophy.values").map(([a, e], i) => ({
      icon: same(a.icon, e.icon, `about.philosophy.values.${i}.icon`),
      label: pair(a.label, e.label),
    })),
  });
  b.imageSlot(philosophySection, "image", philosophy.image, philosophyEn.image, "about.philosophy.image");
  b.section("about", "career", { heading: heading(arAbout.career.heading, enAbout.career.heading) });
  b.timeline(
    "career",
    careerBase.map((base) => ({ ...base, ...arCareer[base.id] })),
    careerBase.map((base) => ({ ...base, ...enCareer[base.id] })),
  );
  b.section("about", "cta", { mode: "shared" });

  /* -- Services -- */
  b.hero("services", arServicesPage.hero, enServicesPage.hero);
  b.section("services", "procedures", { heading: heading(arServicesPage.procedures.heading, enServicesPage.procedures.heading) });
  b.section("services", "conditions", { heading: heading(arServicesPage.conditions.heading, enServicesPage.conditions.heading) });
  b.section("services", "diagnosis", { heading: heading(arServicesPage.diagnosis.heading, enServicesPage.diagnosis.heading) });
  b.timeline("diagnosis", arServicesPage.diagnosis.steps, enServicesPage.diagnosis.steps);
  const dialog = arServicesPage.dialog;
  const dialogEn = enServicesPage.dialog;
  b.section("services", "dialog", {
    bookLabel: pair(dialog.bookLabel, dialogEn.bookLabel),
    whatsappLabel: pair(dialog.whatsappLabel, dialogEn.whatsappLabel),
    whatsappMessage: pair(dialog.whatsappMessage, dialogEn.whatsappMessage),
    disclaimer: pair(dialog.disclaimer, dialogEn.disclaimer),
  });
  b.section("services", "cta", { mode: "shared" });

  /* -- Videos -- */
  b.hero("videos", arVideosPage.hero, enVideosPage.hero);
  b.section("videos", "gallery", { heading: heading(arVideosPage.gallery.heading, enVideosPage.gallery.heading) });
  b.section("videos", "cta", { mode: "shared" });

  /* -- Reviews & FAQs -- */
  b.hero("reviews", arReviewsPage.hero, enReviewsPage.hero);
  b.section("reviews", "reviews", { heading: heading(arReviewsPage.reviews.heading, enReviewsPage.reviews.heading) });
  const help = arReviewsPage.faq.help;
  const helpEn = enReviewsPage.faq.help;
  b.section("reviews", "faq", {
    heading: heading(arReviewsPage.faq.heading, enReviewsPage.faq.heading),
    help: {
      title: pair(help.title, helpEn.title),
      text: pair(help.text, helpEn.text),
      whatsappLabel: pair(help.whatsappLabel, helpEn.whatsappLabel),
      whatsappMessage: pair(help.whatsappMessage, helpEn.whatsappMessage),
      callLabel: pair(help.callLabel, helpEn.callLabel),
    },
  });
  b.section("reviews", "cta", { mode: "shared" });

  /* -- Articles -- */
  b.hero("articles", arArticlesPage.hero, enArticlesPage.hero);
  b.section("articles", "articles", {
    heading: heading(arArticlesPage.heading, enArticlesPage.heading),
    featuredLabel: pair(arArticlesPage.featuredLabel, enArticlesPage.featuredLabel),
    moreTitle: pair(arArticlesPage.moreTitle, enArticlesPage.moreTitle),
    readLabel: pair(arArticlesPage.readLabel, enArticlesPage.readLabel),
    dialog: {
      disclaimer: pair(arArticlesPage.dialog.disclaimer, enArticlesPage.dialog.disclaimer),
      ctaLabel: pair(arArticlesPage.dialog.ctaLabel, enArticlesPage.dialog.ctaLabel),
    },
  });
  b.section("articles", "cta", { mode: "shared" });

  /* -- Contact -- */
  b.hero("contact", arContactPage.hero, enContactPage.hero);
  const form = arContactPage.form;
  const formEn = enContactPage.form;
  const formFields = ["name", "phone", "email", "subject", "message"] as const;
  const perField = (pick: (copy: typeof form.copy) => Record<(typeof formFields)[number], string>) =>
    Object.fromEntries(formFields.map((field) => [field, pair(pick(form.copy)[field], pick(formEn.copy)[field])])) as Record<
      (typeof formFields)[number],
      L
    >;
  b.section("contact", "form", {
    heading: heading(form.heading, formEn.heading),
    copy: {
      labels: perField((c) => c.labels),
      placeholders: perField((c) => c.placeholders),
      subjects: pair([...form.copy.subjects], [...formEn.copy.subjects]),
      optional: pair(form.copy.optional, formEn.copy.optional),
      submit: pair(form.copy.submit, formEn.copy.submit),
      sending: pair(form.copy.sending, formEn.copy.sending),
      errorSummary: pair(form.copy.errorSummary, formEn.copy.errorSummary),
      success: { title: pair(form.copy.success.title, formEn.copy.success.title), text: pair(form.copy.success.text, formEn.copy.success.text) },
      notConfigured: {
        title: pair(form.copy.notConfigured.title, formEn.copy.notConfigured.title),
        text: pair(form.copy.notConfigured.text, formEn.copy.notConfigured.text),
        whatsappLabel: pair(form.copy.notConfigured.whatsappLabel, formEn.copy.notConfigured.whatsappLabel),
      },
      failure: { title: pair(form.copy.failure.title, formEn.copy.failure.title), text: pair(form.copy.failure.text, formEn.copy.failure.text) },
    },
    whatsappLabel: pair(form.whatsappLabel, formEn.whatsappLabel),
    whatsappMessage: pair(form.whatsappMessage, formEn.whatsappMessage),
    callLabel: pair(form.callLabel, formEn.callLabel),
  });
  const labels = arContactPage.location.labels;
  const labelsEn = enContactPage.location.labels;
  b.section("contact", "location", {
    heading: heading(arContactPage.location.heading, enContactPage.location.heading),
    labels: {
      address: pair(labels.address, labelsEn.address),
      hours: pair(labels.hours, labelsEn.hours),
      phone: pair(labels.phone, labelsEn.phone),
      email: pair(labels.email, labelsEn.email),
      directions: pair(labels.directions, labelsEn.directions),
      placeholderNote: pair(labels.placeholderNote, labelsEn.placeholderNote),
    },
  });
  same(arContactPage.cta.image.src, arCta.image.src, "contact.cta.image");
  b.section("contact", "cta", { mode: "custom", ...band(arContactPage.cta, enContactPage.cta, "contact.cta") });

  /* -- Collections -- */
  const photo = (folder: string, slug: string, width = 1200, height = 900) => ({ src: `/images/${folder}/${slug}.jpg`, width, height });

  const services: ServiceRow[] = serviceBase.map((base) => {
    const ar = arServices[base.slug];
    const en = enServices[base.slug];
    return {
      id: stableId(`service:${base.slug}`),
      slug: base.slug,
      icon: base.icon,
      image_id: b.file(photo("services", base.slug).src, photo("services", base.slug), { ar: ar.imageAlt, en: en.imageAlt }),
      featured: "featured" in base && base.featured === true,
      sort_order: base.order,
      status: "published",
      title_ar: ar.title,
      title_en: en.title,
      description_ar: ar.description,
      description_en: en.description,
      details_ar: ar.details,
      details_en: en.details,
    };
  });

  const conditions: ConditionRow[] = conditionBase.map((base) => {
    const ar = arConditions[base.slug];
    const en = enConditions[base.slug];
    return {
      id: stableId(`condition:${base.slug}`),
      slug: base.slug,
      icon: base.icon,
      image_id: b.file(photo("conditions", base.slug).src, photo("conditions", base.slug), { ar: ar.imageAlt, en: en.imageAlt }),
      featured: "featured" in base && base.featured === true,
      sort_order: base.order,
      status: "published",
      title_ar: ar.title,
      title_en: en.title,
      excerpt_ar: ar.excerpt,
      excerpt_en: en.excerpt,
      symptoms_ar: [...ar.symptoms],
      symptoms_en: [...en.symptoms],
      details_ar: ar.details,
      details_en: en.details,
    };
  });

  const specialties: SpecialtyRow[] = specialtyBase.map((base) => {
    const ar = arSpecialties[base.slug];
    const en = enSpecialties[base.slug];
    return {
      id: stableId(`specialty:${base.slug}`),
      slug: base.slug,
      icon: base.icon,
      service_id: stableId(`service:${base.service}`),
      image_id: b.file(photo("specialties", base.slug).src, photo("specialties", base.slug), { ar: ar.imageAlt, en: en.imageAlt }),
      sort_order: base.order,
      status: "published",
      title_ar: ar.title,
      title_en: en.title,
      description_ar: ar.description,
      description_en: en.description,
    };
  });

  const qualifications: QualificationRow[] = qualificationBase.map((base) => {
    const ar = arQualifications[base.id];
    const en = enQualifications[base.id];
    const image = photo("certificates", `certificate-0${base.certificate}`);
    return {
      id: stableId(`qualification:${base.id}`),
      key: base.id,
      kind: base.kind,
      year: base.year,
      image_id: b.file(image.src, image, { ar: ar.imageAlt, en: en.imageAlt }),
      sort_order: base.order,
      status: "published",
      title_ar: ar.title,
      title_en: en.title,
      institution_ar: ar.institution,
      institution_en: en.institution,
      description_ar: ar.description,
      description_en: en.description,
    };
  });

  const reviews: ReviewRow[] = reviewBase.map((base, index) => {
    const ar = arReviews[base.id];
    const en = enReviews[base.id];
    return {
      id: stableId(`review:${base.id}`),
      key: base.id,
      rating: base.rating,
      avatar_id: null,
      featured: "featured" in base && base.featured === true,
      // Every bundled review is a layout placeholder (data/shared/reviews.ts).
      is_placeholder: true,
      sort_order: (index + 1) * 10,
      status: "published",
      name_ar: ar.name,
      name_en: en.name,
      text_ar: ar.text,
      text_en: en.text,
      context_ar: ar.context ?? "",
      context_en: en.context ?? "",
    };
  });

  const faqs: FaqRow[] = faqBase.map((base, index) => {
    const ar = arFaqs[base.id];
    const en = enFaqs[base.id];
    return {
      id: stableId(`faq:${base.id}`),
      key: base.id,
      featured: "featured" in base && base.featured === true,
      sort_order: (index + 1) * 10,
      status: "published",
      question_ar: ar.question,
      question_en: en.question,
      answer_ar: ar.answer,
      answer_en: en.answer,
    };
  });

  const categories = new Map<string, ArticleCategoryRow>();
  const articles: ArticleRow[] = articleBase.map((base) => {
    const ar = arArticles[base.slug];
    const en = enArticles[base.slug];
    const categoryKey = en.category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    let category = categories.get(categoryKey);
    if (!category) {
      category = { id: stableId(`category:${categoryKey}`), key: categoryKey, sort_order: (categories.size + 1) * 10, name_ar: ar.category, name_en: en.category };
      categories.set(categoryKey, category);
    }
    same(category.name_ar, ar.category, `category ${categoryKey} (Arabic name)`);
    const cover = photo("articles", base.slug, 1600, 1000);
    return {
      id: stableId(`article:${base.slug}`),
      slug: base.slug,
      published_at: base.publishedAt,
      category_id: category.id,
      cover_id: b.file(cover.src, cover, { ar: ar.imageAlt, en: en.imageAlt }),
      featured: "featured" in base && base.featured === true,
      sort_order: base.order,
      status: "published",
      title_ar: ar.title,
      title_en: en.title,
      excerpt_ar: ar.excerpt,
      excerpt_en: en.excerpt,
      body_ar: ar.body,
      body_en: en.body,
    };
  });

  /* -- Settings, navigation, socials, pages, strings -- */
  const og = (locale: "ar" | "en") => {
    const image = siteIdentity[locale].ogImage;
    return b.file(image.src, image, { [locale]: siteIdentity[locale].name });
  };
  const settings: SettingsRow = {
    id: 1,
    doctor_name_ar: siteIdentity.ar.name,
    doctor_name_en: siteIdentity.en.name,
    doctor_role_ar: siteIdentity.ar.role,
    doctor_role_en: siteIdentity.en.role,
    default_title_ar: siteIdentity.ar.title,
    default_title_en: siteIdentity.en.title,
    default_description_ar: siteIdentity.ar.description,
    default_description_en: siteIdentity.en.description,
    og_image_ar_id: og("ar"),
    og_image_en_id: og("en"),
    logo_id: null,
    favicon_id: null,
    phone_digits: siteConfig.contact.isPlaceholder ? "" : siteConfig.contact.phoneDigits,
    whatsapp_digits: siteConfig.contact.whatsappDigits === siteConfig.contact.phoneDigits ? "" : siteConfig.contact.whatsappDigits,
    email: contactBase.email ?? "",
    address_lines_ar: [...arContact.addressLines],
    address_lines_en: [...enContact.addressLines],
    address_is_placeholder: contactBase.address.isPlaceholder,
    hours_ar: arContact.hours.map((h) => ({ ...h })),
    hours_en: enContact.hours.map((h) => ({ ...h })),
    hours_are_placeholder: contactBase.hoursArePlaceholder,
    map_lat: contactBase.map.lat,
    map_lng: contactBase.map.lng,
    map_zoom: contactBase.map.zoom,
    map_label_ar: arContact.mapLabel,
    map_label_en: enContact.mapLabel,
    map_is_placeholder: contactBase.map.isPlaceholder,
    booking_href: "/contact",
    form_store_submissions: true,
    robots_index: true,
  };

  const dictionaries = { ar: getDictionary("ar"), en: getDictionary("en") };
  const navigation: NavRow[] = mainNav.map((item, index) => ({
    id: stableId(`nav:${item.key}`),
    key: item.key,
    href: item.href,
    label_ar: dictionaries.ar.nav[item.key],
    label_en: dictionaries.en.nav[item.key],
    sort_order: (index + 1) * 10,
    visible: item.implemented,
    show_in_header: true,
    show_in_footer: true,
  }));

  const socials: SocialRow[] = siteConfig.socials.map((social, index) => ({
    id: stableId(`social:${social.platform}`),
    platform: social.platform,
    url: social.href,
    sort_order: (index + 1) * 10,
    visible: true,
  }));

  const seo = (ar: { title: string; description: string }, en: { title: string; description: string }) => ({
    seo_title_ar: ar.title,
    seo_title_en: en.title,
    seo_description_ar: ar.description,
    seo_description_en: en.description,
  });
  const page = (key: string, path: string | null, copy: ReturnType<typeof seo>): PageRow => ({
    key,
    path,
    ...copy,
    og_image_ar_id: null,
    og_image_en_id: null,
    robots_index: true,
  });
  const pages: PageRow[] = [
    page("home", "/", seo(siteIdentity.ar, siteIdentity.en)),
    page("about", "/about", seo(arAbout.seo, enAbout.seo)),
    page("services", "/services", seo(arServicesPage.seo, enServicesPage.seo)),
    page("videos", "/videos", seo(arVideosPage.seo, enVideosPage.seo)),
    page("reviews", "/reviews", seo(arReviewsPage.seo, enReviewsPage.seo)),
    page("articles", "/articles", seo(arArticlesPage.seo, enArticlesPage.seo)),
    page("contact", "/contact", seo(arContactPage.seo, enContactPage.seo)),
    page("global", null, seo({ title: "", description: "" }, { title: "", description: "" })),
  ];

  const uiStrings: UiStringRow[] = mergeStrings(dictionaries.ar, dictionaries.en);

  return {
    settings,
    socials,
    navigation,
    pages,
    sections: b.sections,
    sectionMedia: b.sectionMedia,
    media: [...b.media.values()],
    services,
    conditions,
    specialties,
    qualifications,
    timelineSteps: b.steps,
    stats: b.stats,
    videos,
    reviews,
    faqs,
    articleCategories: [...categories.values()],
    articles,
    uiStrings,
  };
}

/** One row per interface string (navigation labels live in navigation_items). */
function mergeStrings(ar: Dictionary, en: Dictionary): UiStringRow[] {
  const arFlat = flattenDictionary(ar);
  const enFlat = flattenDictionary(en);
  const keys = [...new Set([...Object.keys(arFlat), ...Object.keys(enFlat)])].sort();
  return keys.map((key) => ({ key, value_ar: arFlat[key] ?? "", value_en: enFlat[key] ?? "" }));
}
