import Link from "next/link";
import type { ComponentProps } from "react";
import { isImplementedRoute } from "@/config/routes";

type AppLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * Internal link that only prefetches routes which already exist, so planned
 * pages don't trigger 404 prefetch requests. Once a page ships, mark it
 * `implemented` in config/routes.ts and prefetching turns on by itself.
 */
export function AppLink({ href, prefetch, ...props }: AppLinkProps) {
  return <Link href={href} prefetch={isImplementedRoute(href) ? prefetch : false} {...props} />;
}
