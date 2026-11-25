import type { Metadata } from "next";
import { RootRedirect } from "@/components/RootRedirect";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";
import { defaultLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

/**
 * Real, static, crawler-visible metadata for the bare domain root — the
 * actual redirect (RootRedirect, a Client Component) can't carry any,
 * since OG/Twitter scrapers never run the JavaScript that would produce it.
 * Same content as the Arabic homepage (this is where / lands), except
 * `openGraph.url`, which names this exact URL rather than the redirect's
 * destination.
 *
 * metadataBase is set here explicitly — every other page inherits it from
 * app/[lang]/layout.tsx, but this one lives outside that layout's subtree,
 * so without this, relative image URLs (og:image) resolve against Next's
 * own localhost fallback instead of the real domain.
 */
export async function generateMetadata(): Promise<Metadata> {
  const metadata = await pageMetadata({ locale: defaultLocale, page: "home", path: routes.home, absoluteTitle: true });
  return {
    ...metadata,
    metadataBase: new URL(siteConfig.url),
    openGraph: { ...metadata.openGraph, url: siteConfig.url },
    // Same reason as metadataBase above: no parent layout to inherit this
    // from, so it has to be explicit here too (see app/[lang]/layout.tsx).
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default function RootPage() {
  return <RootRedirect />;
}
