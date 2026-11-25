"use client";

import Link from "next/link";
import { useEffect } from "react";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config";

/** Saved cookie, then the browser's own language list, then Arabic. */
function detectLocale(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  const saved = match ? decodeURIComponent(match[1]) : null;
  if (isLocale(saved)) return saved;

  for (const lang of navigator.languages ?? [navigator.language]) {
    const short = lang.slice(0, 2).toLowerCase();
    if (isLocale(short)) return short;
  }
  return defaultLocale;
}

/**
 * Bare domain root. On the Vercel deployment, proxy.ts does this redirect
 * server-side before this would ever render; on the static export (no
 * server to run it on) this client-side component does the same job.
 * Always redirects to a different path (/ar or /en), so it can't loop.
 *
 * The page rendering this (app/page.tsx) is a Server Component with its own
 * generateMetadata — real, crawler-visible OG/Twitter tags — specifically
 * because this redirect itself is client-only and OG scrapers don't run
 * JavaScript, so metadata can't live here.
 */
export function RootRedirect() {
  useEffect(() => {
    window.location.replace(`/${detectLocale()}`);
  }, []);

  return (
    <noscript>
      <Link href="/ar">العربية</Link> · <Link href="/en">English</Link>
    </noscript>
  );
}
