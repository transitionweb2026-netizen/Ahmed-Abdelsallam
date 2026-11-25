import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

// Required by `output: 'export'` (the Hostinger build) — harmless for the
// ordinary Vercel build, which never needs this file to be request-dynamic.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // The admin dashboard's own deployment (admin.<domain>) — nothing there
  // is a public page, so it must never be crawled or listed.
  if (process.env.DEPLOYMENT_TARGET === "admin") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
