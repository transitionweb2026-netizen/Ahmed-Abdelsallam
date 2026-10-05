import Image from "next/image";
import { BrandMark } from "@/components/ui/BrandMark";
import type { SiteData } from "@/lib/cms/source";

interface SiteLogoProps {
  /** Logo uploaded in the CMS (Global settings); null keeps the drawn brand mark. */
  logo: SiteData["logo"];
  size: number;
  idPrefix: string;
}

/** The brand tile in the header, drawer and footer. Decorative: the name sits next to it. */
export function SiteLogo({ logo, size, idPrefix }: SiteLogoProps) {
  if (!logo) return <BrandMark size={size} idPrefix={idPrefix} />;
  return (
    <Image
      src={logo.src}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      className="shrink-0 rounded-[28%] object-contain"
      style={{ width: size, height: size }}
    />
  );
}
