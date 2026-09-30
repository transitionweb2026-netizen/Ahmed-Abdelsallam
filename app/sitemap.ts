import type { MetadataRoute } from "next";
import { mainNav } from "@/config/routes";
import { absoluteUrl } from "@/lib/utils";

/** Lists only routes that exist; flip `implemented` in config/routes.ts as pages ship. */
export default function sitemap(): MetadataRoute.Sitemap {
  return mainNav
    .filter((item) => item.implemented)
    .map((item) => ({
      url: absoluteUrl(item.href),
      changeFrequency: "monthly" as const,
      priority: item.href === "/" ? 1 : 0.7,
    }));
}
