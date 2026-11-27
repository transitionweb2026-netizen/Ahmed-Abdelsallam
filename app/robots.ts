import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

// Required by `output: 'export'` (the Hostinger build) — harmless for the
// ordinary Vercel build, which never needs this file to be request-dynamic.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Crawling stays allowed everywhere, including the admin dashboard's own
  // deployment (admin.<domain>) — lib/seo.ts and app/admin/layout.tsx put
  // noindex,nofollow on every page served there, but a blanket Disallow
  // would stop Google from ever fetching those pages to find that out, so
  // any URL indexed before this was wired up would have no way to drop
  // back out of the index. No sitemap there either way: nothing on that
  // deployment is meant to be listed.
  const isAdminDeployment = process.env.DEPLOYMENT_TARGET === "admin";
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(isAdminDeployment ? {} : { sitemap: absoluteUrl("/sitemap.xml") }),
  };
}
