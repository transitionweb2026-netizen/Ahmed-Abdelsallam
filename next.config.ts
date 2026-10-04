import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root: a parent folder contains another project's
  // lockfile, which would otherwise be picked up as the workspace root.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  images: {
    // AVIF first (smaller), WebP fallback.
    formats: ["image/avif", "image/webp"],
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
