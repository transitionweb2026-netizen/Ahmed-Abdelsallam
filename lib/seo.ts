import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Canonical path, e.g. "/about". */
  path: string;
  /** Use `title` as-is instead of "title | site name". */
  absoluteTitle?: boolean;
  image?: { src: string; width: number; height: number; alt: string };
}

/**
 * Page-level metadata: title, description, canonical URL, Open Graph and
 * Twitter card. Next.js replaces (does not merge) nested objects such as
 * `openGraph`, so every field is set here. For an English version, pass
 * `alternates.languages` alongside the canonical.
 */
export function pageMetadata({ title, description, path, absoluteTitle = false, image }: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const og = image ?? { ...siteConfig.ogImage, alt: siteConfig.name };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [{ url: og.src, width: og.width, height: og.height, alt: og.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [og.src],
    },
  };
}
