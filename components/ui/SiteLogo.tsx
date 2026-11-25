import Image from "next/image";
import type { SiteData } from "@/lib/cms/source";

interface SiteLogoProps {
  /** CMS content (Global Settings); deliberately unused — see below. */
  logo: SiteData["logo"];
  size: number;
  idPrefix: string;
}

/**
 * The brand tile in the header, drawer and footer. Decorative: the name
 * sits next to it. Always the static brand mark — not the CMS's Global
 * Settings logo, same as the favicon and default OG image (lib/seo.ts).
 */
export function SiteLogo({ size }: SiteLogoProps) {
  return (
    <Image
      src="/icon-192.png"
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  );
}
