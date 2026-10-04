/**
 * Content access layer.
 *
 * Pages and sections only ever read content through these async functions,
 * always for an explicit locale. Today they join the language-neutral data
 * in `data/shared` with the per-language text in `data/ar` / `data/en`; to
 * move to Supabase or a headless CMS, re-implement these functions (keeping
 * the return types) — typically a table per collection plus a translations
 * table keyed by (id, locale) — and no component needs to change.
 */
import { routes } from "@/config/routes";
import { articlesText as arArticles } from "@/data/ar/articles";
import { careerText as arCareer } from "@/data/ar/career";
import { conditionsText as arConditions } from "@/data/ar/conditions";
import { contactText as arContact } from "@/data/ar/contact";
import { siteCta as arCta } from "@/data/ar/cta";
import { faqsText as arFaqs } from "@/data/ar/faqs";
import { homeCopy as arHome } from "@/data/ar/home";
import { aboutPage as arAboutPage } from "@/data/ar/pages/about";
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
import { aboutPage as enAboutPage } from "@/data/en/pages/about";
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
import { articleBase, type ArticleSlug } from "@/data/shared/articles";
import { careerBase, type CareerStepId } from "@/data/shared/career";
import { conditionBase, type ConditionSlug } from "@/data/shared/conditions";
import { contactBase } from "@/data/shared/contact";
import { faqBase, type FaqId } from "@/data/shared/faqs";
import { qualificationBase, type QualificationId } from "@/data/shared/qualifications";
import { reviewBase, type ReviewId } from "@/data/shared/reviews";
import { serviceBase, type ServiceSlug } from "@/data/shared/services";
import { specialtyBase, type SpecialtySlug } from "@/data/shared/specialties";
import { introVideoBase, videoBase, type VideoSlug } from "@/data/shared/videos";
import type { Locale } from "@/i18n/config";
import type {
  AboutPageContent,
  AboutPageCopy,
  Article,
  ArticlesPageContent,
  ArticleText,
  ArticleWithMeta,
  CareerStepText,
  Condition,
  ConditionText,
  ContactInfo,
  ContactPageContent,
  ContactText,
  Faq,
  FaqText,
  HomeContent,
  HomeCopy,
  JourneyStep,
  MediaImage,
  Qualification,
  QualificationText,
  Review,
  ReviewsPageContent,
  ReviewText,
  Service,
  ServicesPageContent,
  ServiceText,
  SiteCtaContent,
  Specialty,
  SpecialtyText,
  Video,
  VideoBase,
  VideosPageContent,
  VideoText,
} from "@/types/content";

/** Everything one language provides. Both locales must match this shape. */
interface LocaleContent {
  home: HomeCopy;
  cta: SiteCtaContent;
  pages: {
    about: AboutPageCopy;
    services: ServicesPageContent;
    videos: VideosPageContent;
    reviews: ReviewsPageContent;
    articles: ArticlesPageContent;
    contact: ContactPageContent;
  };
  services: Record<ServiceSlug, ServiceText>;
  conditions: Record<ConditionSlug, ConditionText>;
  specialties: Record<SpecialtySlug, SpecialtyText>;
  qualifications: Record<QualificationId, QualificationText>;
  career: Record<CareerStepId, CareerStepText>;
  videos: Record<VideoSlug, VideoText>;
  introVideo: VideoText;
  reviews: Record<ReviewId, ReviewText>;
  faqs: Record<FaqId, FaqText>;
  articles: Record<ArticleSlug, ArticleText>;
  contact: ContactText;
}

const content: Record<Locale, LocaleContent> = {
  ar: {
    home: arHome,
    cta: arCta,
    pages: {
      about: arAboutPage,
      services: arServicesPage,
      videos: arVideosPage,
      reviews: arReviewsPage,
      articles: arArticlesPage,
      contact: arContactPage,
    },
    services: arServices,
    conditions: arConditions,
    specialties: arSpecialties,
    qualifications: arQualifications,
    career: arCareer,
    videos: arVideos,
    introVideo: arIntroVideo,
    reviews: arReviews,
    faqs: arFaqs,
    articles: arArticles,
    contact: arContact,
  },
  en: {
    home: enHome,
    cta: enCta,
    pages: {
      about: enAboutPage,
      services: enServicesPage,
      videos: enVideosPage,
      reviews: enReviewsPage,
      articles: enArticlesPage,
      contact: enContactPage,
    },
    services: enServices,
    conditions: enConditions,
    specialties: enSpecialties,
    qualifications: enQualifications,
    career: enCareer,
    videos: enVideos,
    introVideo: enIntroVideo,
    reviews: enReviews,
    faqs: enFaqs,
    articles: enArticles,
    contact: enContact,
  },
};

interface ListOptions {
  featured?: boolean;
  limit?: number;
}

function select<T extends { featured?: boolean }>(items: T[], { featured, limit }: ListOptions = {}): T[] {
  const filtered = featured ? items.filter((item) => item.featured) : items;
  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/** Collection photos live at /images/<folder>/<slug>.jpg (4:3 unless stated). */
const photo = (folder: string, slug: string, alt: string, width = 1200, height = 900): MediaImage => ({
  src: `/images/${folder}/${slug}.jpg`,
  alt,
  width,
  height,
});

/* ---- Page copy ----------------------------------------------------------- */

export async function getHomeContent(locale: Locale): Promise<HomeContent> {
  const copy = content[locale].home;
  return {
    ...copy,
    intro: { ...copy.intro, video: await getIntroVideo(locale) },
    finalCta: content[locale].cta,
  };
}

export async function getAboutPage(locale: Locale): Promise<AboutPageContent> {
  const copy = content[locale].pages.about;
  return {
    ...copy,
    video: { heading: copy.video.heading, video: await getIntroVideo(locale) },
    career: { heading: copy.career.heading, steps: await getCareerSteps(locale) },
  };
}

export async function getServicesPage(locale: Locale): Promise<ServicesPageContent> {
  return content[locale].pages.services;
}

export async function getVideosPage(locale: Locale): Promise<VideosPageContent> {
  return content[locale].pages.videos;
}

export async function getReviewsPage(locale: Locale): Promise<ReviewsPageContent> {
  return content[locale].pages.reviews;
}

export async function getArticlesPage(locale: Locale): Promise<ArticlesPageContent> {
  return content[locale].pages.articles;
}

export async function getContactPage(locale: Locale): Promise<ContactPageContent> {
  return content[locale].pages.contact;
}

/** The global call-to-action band shown at the end of every page. */
export async function getSiteCta(locale: Locale): Promise<SiteCtaContent> {
  return content[locale].cta;
}

/* ---- Collections ------------------------------------------------------------ */

export async function getServices(locale: Locale, options?: ListOptions): Promise<Service[]> {
  const text = content[locale].services;
  const items = serviceBase.map((base): Service => {
    const { imageAlt, ...rest } = text[base.slug];
    return { ...base, ...rest, image: photo("services", base.slug, imageAlt) };
  });
  return select(items.sort(byOrder), options);
}

export async function getConditions(locale: Locale, options?: ListOptions): Promise<Condition[]> {
  const text = content[locale].conditions;
  const items = conditionBase.map((base): Condition => {
    const { imageAlt, ...rest } = text[base.slug];
    return { ...base, ...rest, image: photo("conditions", base.slug, imageAlt) };
  });
  return select(items.sort(byOrder), options);
}

export async function getSpecialties(locale: Locale): Promise<Specialty[]> {
  const text = content[locale].specialties;
  return specialtyBase
    .map((base): Specialty => {
      const { imageAlt, ...rest } = text[base.slug];
      return {
        slug: base.slug,
        icon: base.icon,
        order: base.order,
        ...rest,
        image: photo("specialties", base.slug, imageAlt),
        // Opens the matching service dialog on /services.
        href: `${routes.services}#${base.service}`,
      };
    })
    .sort(byOrder);
}

export async function getQualifications(locale: Locale): Promise<Qualification[]> {
  const text = content[locale].qualifications;
  return qualificationBase
    .map((base): Qualification => {
      const { imageAlt, ...rest } = text[base.id];
      return {
        id: base.id,
        kind: base.kind,
        year: base.year,
        order: base.order,
        ...rest,
        image: photo("certificates", `certificate-0${base.certificate}`, imageAlt),
      };
    })
    .sort(byOrder);
}

export async function getCareerSteps(locale: Locale): Promise<JourneyStep[]> {
  const text = content[locale].career;
  return careerBase.map((base) => ({ ...base, ...text[base.id] }));
}

function toVideo(base: VideoBase, text: VideoText): Video {
  const { posterAlt, ...rest } = text;
  return { ...base, ...rest, poster: { ...base.poster, alt: posterAlt } };
}

export async function getVideos(locale: Locale, options?: ListOptions): Promise<Video[]> {
  const text = content[locale].videos;
  const items = videoBase.map((base) => toVideo(base, text[base.slug]));
  return select(items.sort(byOrder), options);
}

/** Landscape introduction video (homepage intro and /about). */
export async function getIntroVideo(locale: Locale): Promise<Video> {
  return toVideo(introVideoBase, content[locale].introVideo);
}

export async function getReviews(locale: Locale, options?: ListOptions): Promise<Review[]> {
  const text = content[locale].reviews;
  return select(
    reviewBase.map((base): Review => ({ ...base, ...text[base.id] })),
    options,
  );
}

export async function getFaqs(locale: Locale, options?: ListOptions): Promise<Faq[]> {
  const text = content[locale].faqs;
  return select(
    faqBase.map((base): Faq => ({ ...base, ...text[base.id] })),
    options,
  );
}

export async function getContactInfo(locale: Locale): Promise<ContactInfo> {
  const text = content[locale].contact;
  return {
    address: { lines: text.addressLines, isPlaceholder: contactBase.address.isPlaceholder },
    hours: text.hours,
    hoursArePlaceholder: contactBase.hoursArePlaceholder,
    email: contactBase.email,
    map: { ...contactBase.map, label: text.mapLabel },
  };
}

/* ---- Articles --------------------------------------------------------------- */

// Average reading speed for general readers, in words per minute.
const WORDS_PER_MINUTE: Record<Locale, number> = { ar: 180, en: 200 };

function countWords(article: Article): number {
  const text = article.body
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

/** Articles with derived reading time, in `order`. */
export async function getArticles(locale: Locale, options?: ListOptions): Promise<ArticleWithMeta[]> {
  const text = content[locale].articles;
  const items = articleBase.map((base): ArticleWithMeta => {
    const { imageAlt, ...rest } = text[base.slug];
    const article: Article = { ...base, ...rest, image: photo("articles", base.slug, imageAlt, 1600, 1000) };
    return { ...article, readingMinutes: Math.max(2, Math.ceil(countWords(article) / WORDS_PER_MINUTE[locale])) };
  });
  return select(items.sort(byOrder), options);
}
