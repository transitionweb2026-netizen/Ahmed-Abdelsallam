"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { isImplementedRoute } from "@/config/routes";
import { localizeHref } from "@/i18n/config";

type AppLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * Internal link in the current language ("/about" → "/en/about"), so
 * content and components never hard-code a language. Only prefetches routes
 * which already exist, so planned pages don't trigger 404 prefetch requests.
 * Once a page ships, mark it `implemented` in config/routes.ts and
 * prefetching turns on by itself.
 */
export function AppLink({ href, prefetch, ...props }: AppLinkProps) {
  const locale = useLocale();
  return <Link href={localizeHref(href, locale)} prefetch={isImplementedRoute(href) ? prefetch : false} {...props} />;
}
