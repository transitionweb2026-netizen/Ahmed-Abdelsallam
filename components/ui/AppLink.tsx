"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { isImplementedRoute } from "@/config/routes";
import { localizeHref } from "@/i18n/config";

type AppLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * Internal link in the current language ("/about" → "/en/about"), so
 * content and components never hard-code a language. Defaults to no
 * prefetch — the header/footer nav render every destination's link at
 * once, so Next's own viewport-prefetch default was quietly fetching every
 * other page's full HTML in the background on every page load (confirmed:
 * ~1MB extra per page view). Pass `prefetch` explicitly on a case-by-case
 * basis for a link worth the trade-off. Never prefetches a route that
 * isn't implemented yet, regardless.
 */
export function AppLink({ href, prefetch = false, ...props }: AppLinkProps) {
  const locale = useLocale();
  return <Link href={localizeHref(href, locale)} prefetch={isImplementedRoute(href) ? prefetch : false} {...props} />;
}
