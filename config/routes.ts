/**
 * Single source of truth for every internal URL.
 *
 * Pages other than "/" are not built yet; links point at their final
 * addresses so nothing needs re-wiring once they exist. `implemented`
 * drives the sitemap so unbuilt routes are never advertised.
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
  { label: "عن د. أحمد عبد السلام", href: routes.about, implemented: false },
  { label: "الخدمات", href: routes.services, implemented: false },
  { label: "الفيديوهات", href: routes.videos, implemented: false },
  // "Reviews & FAQs" — one page for patient reviews and frequently asked questions.
  { label: "الآراء والأسئلة الشائعة", href: routes.reviews, implemented: false },
  { label: "المقالات", href: routes.articles, implemented: false },
  { label: "تواصل معنا", href: routes.contact, implemented: false },
];

const implementedPaths = new Set(mainNav.filter((item) => item.implemented).map((item) => item.href));

/** Whether the page behind an internal href exists yet (ignores #hash and ?query). */
export function isImplementedRoute(href: string): boolean {
  const path = href.split(/[?#]/)[0] || "/";
  return implementedPaths.has(path);
}
