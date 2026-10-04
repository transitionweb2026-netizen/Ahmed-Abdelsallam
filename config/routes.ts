import { splitLocale } from "@/i18n/config";

/**
 * Single source of truth for every internal URL, written without the
 * language prefix. `AppLink` adds the current locale ("/about" → "/en/about"),
 * so content and components never hard-code a language. proxy.ts answers
 * any path that is not listed here with a 404, so add each new page here.
 *
 * `implemented` drives the sitemap and link prefetching, so a route that is
 * planned but not built yet is never advertised or prefetched.
 */
export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  conditions: "/services#conditions",
  videos: "/videos",
  reviews: "/reviews",
  faq: "/reviews#faq",
  articles: "/articles",
  contact: "/contact",
} as const;

export type RouteKey = keyof typeof routes;

export interface NavItem {
  /** Key of the label in the interface dictionary (`t.nav[key]`). */
  key: string;
  href: string;
  implemented: boolean;
}

/** Main navigation — shown in the header, the mobile drawer and the footer. */
export const mainNav = [
  { key: "home", href: routes.home, implemented: true },
  { key: "about", href: routes.about, implemented: true },
  { key: "services", href: routes.services, implemented: true },
  { key: "videos", href: routes.videos, implemented: true },
  // "Reviews & FAQs" — one page for patient reviews and frequently asked questions.
  { key: "reviews", href: routes.reviews, implemented: true },
  { key: "articles", href: routes.articles, implemented: true },
  { key: "contact", href: routes.contact, implemented: true },
] as const satisfies readonly NavItem[];

export type NavKey = (typeof mainNav)[number]["key"];

const implementedPaths = new Set<string>(mainNav.filter((item) => item.implemented).map((item) => item.href));

const pagePaths = new Set<string>(Object.values(routes).map((href) => href.split(/[?#]/)[0] || "/"));

/** Whether a path without the language prefix ("/about") is one of the site's pages. */
export function isPagePath(path: string): boolean {
  return pagePaths.has(path);
}

/** Whether the page behind an internal href exists (ignores the locale, #hash and ?query). */
export function isImplementedRoute(href: string): boolean {
  const path = href.split(/[?#]/)[0] || "/";
  return implementedPaths.has(splitLocale(path).path);
}
