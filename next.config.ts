import type { NextConfig } from "next";

// Images uploaded through the CMS are served from the Supabase project's public Storage.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // Pin the project root: a parent folder contains another project's
  // lockfile, which would otherwise be picked up as the workspace root.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  images: {
    // AVIF first (smaller), WebP fallback.
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] : [],
  },
  async headers() {
    return [
      {
        // Self-hosted fonts: file names carry a content hash (see app/fonts.css).
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Self-hosted video files: cache for a week at the edge/browser.
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
