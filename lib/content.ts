/**
 * Content access layer.
 *
 * Pages and sections only ever read content through these async functions.
 * Today they return the static data in `data/`; to move to Supabase or a
 * headless CMS, re-implement these functions (keeping the return types) and
 * no component needs to change.
 */
import { conditions } from "@/data/conditions";
import { faqs } from "@/data/faqs";
import { homeContent } from "@/data/home";
import { reviews } from "@/data/reviews";
import { services } from "@/data/services";
import { videos } from "@/data/videos";
import type { Condition, Faq, HomeContent, Review, Service, Video } from "@/types/content";

interface ListOptions {
  featured?: boolean;
  limit?: number;
}

function select<T extends { featured?: boolean }>(items: T[], { featured, limit }: ListOptions = {}): T[] {
  const filtered = featured ? items.filter((item) => item.featured) : items;
  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getHomeContent(): Promise<HomeContent> {
  return homeContent;
}

export async function getServices(options?: ListOptions): Promise<Service[]> {
  return select([...services].sort(byOrder), options);
}

export async function getConditions(options?: ListOptions): Promise<Condition[]> {
  return select([...conditions].sort(byOrder), options);
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
