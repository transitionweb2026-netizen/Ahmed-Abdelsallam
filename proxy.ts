import { NextResponse, type NextRequest } from "next/server";
import { isPagePath } from "@/config/routes";
import { defaultLocale, isLocale, LOCALE_COOKIE, splitLocale } from "@/i18n/config";
import { guardAdmin } from "@/lib/supabase/proxy";

/**
 * Every page lives under /ar or /en. Requests without a language prefix —
 * the bare domain, or old links such as /about — are redirected (307) to
 * the same path in the visitor's saved language (the NEXT_LOCALE cookie set
 * by the language toggle) or in Arabic, the site's default. Query strings
 * are kept; browsers carry the #fragment over to the new URL.
 *
 * Prefixed URLs that are not a page (/en/old-page) are rendered by
 * app/[lang]/[...rest] as the branded 404 page; this sets their status.
 *
 * /admin (the CMS dashboard) is not localized: signed-out visitors are sent
 * to the login page (lib/supabase/proxy.ts).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return guardAdmin(request);
  const { locale, path } = splitLocale(pathname);
  if (locale) return isPagePath(path) ? NextResponse.next() : NextResponse.next({ status: 404 });

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const target = isLocale(saved) ? saved : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Pages: skip Next.js internals, API routes and files (anything with a
    // dot: /sitemap.xml, /robots.txt, /icon.svg, /images/…, /videos/…).
    "/((?!_next|__next|api/|.*\\..*).*)",
    // Everything under a language prefix, including dotted paths such as
    // /en/old-page.html, so unknown ones get their 404 status. Keep the
    // list in sync with `locales` in i18n/config.ts.
    "/(ar|en)/:path*",
  ],
};
