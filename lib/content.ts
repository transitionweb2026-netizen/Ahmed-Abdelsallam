/**
 * Content access layer.
 *
 * Pages and sections only ever read content through these async functions,
 * always for an explicit locale. They read the CMS snapshot (lib/cms/source:
 * Supabase when connected, otherwise the content bundled in data/) through
 * the pure mapper in lib/cms/content-map.ts, so components receive the same
 * typed shapes (types/content.ts) whichever source is active.
 */
import "server-only";
import type { ListOptions } from "@/lib/cms/content-map";
import { getReader } from "@/lib/cms/source";
import type { Locale } from "@/lib/cms/types";
import type {
  AboutPageContent,
  ArticlesPageContent,
  ArticleWithMeta,
  Condition,
  ContactInfo,
  ContactPageContent,
  Faq,
  HomeContent,
  JourneyStep,
  Qualification,
  Review,
  ReviewsPageContent,
  Service,
  ServicesPageContent,
  SiteCtaContent,
  Specialty,
  Video,
  VideosPageContent,
} from "@/types/content";

export { getSite, getSnapshot, type SiteData } from "@/lib/cms/source";

/* ---- Page copy ----------------------------------------------------------- */

export async function getHomeContent(locale: Locale): Promise<HomeContent> {
  return (await getReader(locale)).home();
}

export async function getAboutPage(locale: Locale): Promise<AboutPageContent> {
  return (await getReader(locale)).about();
}

export async function getServicesPage(locale: Locale): Promise<ServicesPageContent> {
  return (await getReader(locale)).servicesPage();
}

export async function getVideosPage(locale: Locale): Promise<VideosPageContent> {
  return (await getReader(locale)).videosPage();
}

export async function getReviewsPage(locale: Locale): Promise<ReviewsPageContent> {
  return (await getReader(locale)).reviewsPage();
}

export async function getArticlesPage(locale: Locale): Promise<ArticlesPageContent> {
  return (await getReader(locale)).articlesPage();
}

export async function getContactPage(locale: Locale): Promise<ContactPageContent> {
  return (await getReader(locale)).contactPage();
}

/** The shared call-to-action band. */
export async function getSiteCta(locale: Locale): Promise<SiteCtaContent> {
  return (await getReader(locale)).siteCta();
}

/** A page's closing band (the shared one unless the page has its own text). */
export async function getPageCta(locale: Locale, page: string): Promise<SiteCtaContent> {
  return (await getReader(locale)).pageCta(page);
}

/** Visible sections of a page, in the order set in the CMS. */
export async function getSectionOrder(locale: Locale, page: string): Promise<string[]> {
  return (await getReader(locale)).sectionOrder(page);
}

/** SEO title and description of a page in this language. */
export async function getPageSeo(
  locale: Locale,
  page: string,
): Promise<{ title: string; description: string; index: boolean; ogImage: { src: string; width: number; height: number } | null }> {
  const reader = await getReader(locale);
  const row = reader.snapshot.pages.find((p) => p.key === page);
  const ogId = locale === "ar" ? row?.og_image_ar_id : (row?.og_image_en_id ?? row?.og_image_ar_id);
  const og = ogId ? reader.image(ogId) : null;
  return {
    ...reader.pageSeo(page),
    index: row?.robots_index ?? true,
    ogImage: og ? { src: og.src, width: og.width, height: og.height } : null,
  };
}

/* ---- Collections ------------------------------------------------------------ */

export async function getServices(locale: Locale, options?: ListOptions): Promise<Service[]> {
  return (await getReader(locale)).services(options);
}

export async function getConditions(locale: Locale, options?: ListOptions): Promise<Condition[]> {
  return (await getReader(locale)).conditions(options);
}

export async function getSpecialties(locale: Locale): Promise<Specialty[]> {
  return (await getReader(locale)).specialties();
}

export async function getQualifications(locale: Locale): Promise<Qualification[]> {
  return (await getReader(locale)).qualifications();
}

export async function getCareerSteps(locale: Locale): Promise<JourneyStep[]> {
  return (await getReader(locale)).steps("career");
}

export async function getVideos(locale: Locale, options?: ListOptions): Promise<Video[]> {
  return (await getReader(locale)).videos(options);
}

/** Landscape introduction video (homepage intro and /about). */
export async function getIntroVideo(locale: Locale): Promise<Video> {
  return (await getReader(locale)).sectionVideo("home", "intro");
}

export async function getReviews(locale: Locale, options?: ListOptions): Promise<Review[]> {
  return (await getReader(locale)).reviews(options);
}

export async function getFaqs(locale: Locale, options?: ListOptions): Promise<Faq[]> {
  return (await getReader(locale)).faqs(options);
}

export async function getContactInfo(locale: Locale): Promise<ContactInfo> {
  return (await getReader(locale)).contactInfo();
}

/** Articles with derived reading time, in `order`. */
export async function getArticles(locale: Locale, options?: ListOptions): Promise<ArticleWithMeta[]> {
  return (await getReader(locale)).articles(options);
}
