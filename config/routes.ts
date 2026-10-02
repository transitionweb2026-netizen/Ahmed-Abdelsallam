/**
 * Single source of truth for every internal URL.
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
  label: string;
  href: string;
  implemented: boolean;
}

/** Main navigation — shown in the header, the mobile drawer and the footer. */
export const mainNav: NavItem[] = [
  { label: "الرئيسية", href: routes.home, implemented: true },
  { label: "عن د. أحمد عبد السلام", href: routes.about, implemented: true },
  { label: "الخدمات", href: routes.services, implemented: true },
  { label: "الفيديوهات", href: routes.videos, implemented: true },
  // "Reviews & FAQs" — one page for patient reviews and frequently asked questions.
  { label: "الآراء والأسئلة الشائعة", href: routes.reviews, implemented: true },
  { label: "المقالات", href: routes.articles, implemented: true },
  { label: "تواصل معنا", href: routes.contact, implemented: true },
];

const implementedPaths = new Set(mainNav.filter((item) => item.implemented).map((item) => item.href));

/** Whether the page behind an internal href exists yet (ignores #hash and ?query). */
export function isImplementedRoute(href: string): boolean {
  const path = href.split(/[?#]/)[0] || "/";
  return implementedPaths.has(path);
}
