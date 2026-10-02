/**
 * Content access layer.
 *
 * Pages and sections only ever read content through these async functions.
 * Today they return the static data in `data/`; to move to Supabase or a
 * headless CMS, re-implement these functions (keeping the return types) and
 * no component needs to change.
 */
import { articles } from "@/data/articles";
import { conditions } from "@/data/conditions";
import { contactInfo } from "@/data/contact";
import { siteCta } from "@/data/cta";
import { faqs } from "@/data/faqs";
import { homeContent } from "@/data/home";
import { aboutPage } from "@/data/pages/about";
import { articlesPage } from "@/data/pages/articles";
import { contactPage } from "@/data/pages/contact";
import { reviewsPage } from "@/data/pages/reviews";
import { servicesPage } from "@/data/pages/services";
import { videosPage } from "@/data/pages/videos";
import { qualifications } from "@/data/qualifications";
import { reviews } from "@/data/reviews";
import { services } from "@/data/services";
import { specialties } from "@/data/specialties";
import { videos } from "@/data/videos";
import type {
  AboutPageContent,
  Article,
  ArticlesPageContent,
  ArticleWithMeta,
  Condition,
  ContactInfo,
  ContactPageContent,
  Faq,
  HomeContent,
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

interface ListOptions {
  featured?: boolean;
  limit?: number;
}

function select<T extends { featured?: boolean }>(items: T[], { featured, limit }: ListOptions = {}): T[] {
  const filtered = featured ? items.filter((item) => item.featured) : items;
  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/* ---- Page copy ----------------------------------------------------------- */

export async function getHomeContent(): Promise<HomeContent> {
  return homeContent;
}

export async function getAboutPage(): Promise<AboutPageContent> {
  return aboutPage;
}

export async function getServicesPage(): Promise<ServicesPageContent> {
  return servicesPage;
}

export async function getVideosPage(): Promise<VideosPageContent> {
  return videosPage;
}

export async function getReviewsPage(): Promise<ReviewsPageContent> {
  return reviewsPage;
}

export async function getArticlesPage(): Promise<ArticlesPageContent> {
  return articlesPage;
}

export async function getContactPage(): Promise<ContactPageContent> {
  return contactPage;
}

/** The global call-to-action band shown at the end of every page. */
export async function getSiteCta(): Promise<SiteCtaContent> {
  return siteCta;
}

/* ---- Collections ------------------------------------------------------------ */

export async function getServices(options?: ListOptions): Promise<Service[]> {
  return select([...services].sort(byOrder), options);
}

export async function getConditions(options?: ListOptions): Promise<Condition[]> {
  return select([...conditions].sort(byOrder), options);
}

export async function getSpecialties(): Promise<Specialty[]> {
  return [...specialties].sort(byOrder);
}

export async function getQualifications(): Promise<Qualification[]> {
  return [...qualifications].sort(byOrder);
}

export async function getVideos(options?: ListOptions): Promise<Video[]> {
  return select([...videos].sort(byOrder), options);
}

export async function getReviews(options?: ListOptions): Promise<Review[]> {
  return select(reviews, options);
}

export async function getFaqs(options?: ListOptions): Promise<Faq[]> {
  return select(faqs, options);
}

export async function getContactInfo(): Promise<ContactInfo> {
  return contactInfo;
}

/* ---- Articles --------------------------------------------------------------- */

// Arabic prose averages roughly 180 words per minute for general readers.
const WORDS_PER_MINUTE = 180;

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

/** Articles with derived reading time, newest `order` first. */
export async function getArticles(options?: ListOptions): Promise<ArticleWithMeta[]> {
  const withMeta = [...articles].sort(byOrder).map((article) => ({
    ...article,
    readingMinutes: Math.max(2, Math.ceil(countWords(article) / WORDS_PER_MINUTE)),
  }));
  return select(withMeta, options);
}
