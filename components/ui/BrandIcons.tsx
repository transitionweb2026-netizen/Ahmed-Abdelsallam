import type { ReactNode, SVGProps } from "react";
import type { SocialPlatform } from "@/types/content";

/**
 * Brand glyphs drawn as monochrome strokes so they inherit the site's
 * palette instead of each network's own colours.
 */
const PATHS: Record<SocialPlatform | "whatsapp", ReactNode> = {
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  tiktok: <path d="M21 7.9v4a10 10 0 0 1-5-1.9v4.5a6.5 6.5 0 1 1-8-6.3v4.3a2.5 2.5 0 1 0 4 2V3h4.1A6 6 0 0 0 21 7.9z" />,
  x: (
    <>
      <path d="m4 4 11.7 16H20L8.3 4z" />
      <path d="m4 20 6.8-6.8m2.4-2.4L20 4" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  whatsapp: (
    <>
      <path d="m3 21 1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </>
  ),
};

interface BrandIconProps extends SVGProps<SVGSVGElement> {
  name: SocialPlatform | "whatsapp";
  size?: number;
}

export function BrandIcon({ name, size = 20, strokeWidth = 1.8, ...props }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
