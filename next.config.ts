import type { NextConfig } from "next";

// Images uploaded through the CMS are served from the Supabase project's public Storage.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
})();

// Set by scripts/build-export.mjs for the Hostinger static-export build only.
// The ordinary `next build` (Vercel, the admin dashboard) never sets this,
// so its behaviour is unchanged.
const isExport = process.env.DEPLOYMENT_TARGET === "export";

// The project's one and only Vercel deployment — confirmed via
// `vercel project inspect ahmed-abdelsallam` (prj_ar3y1RPclMVTVYskre7ddP3KePfh,
// repo transitionweb2026-netizen/Ahmed-Abdelsallam). There is no separate
// admin project; once admin.dr-ahmedabdelsalam.com is attached, it's this
// same deployment, reached by a second hostname.
const OLD_VERCEL_HOST = "ahmed-abdelsallam.vercel.app";
const ADMIN_HOST = "https://admin.dr-ahmedabdelsalam.com";
const PUBLIC_HOST = "https://dr-ahmedabdelsalam.com";

const nextConfig: NextConfig = {
  // Pin the project root: a parent folder contains another project's
  // lockfile, which would otherwise be picked up as the workspace root.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  ...(isExport
    ? {
        output: "export",
        // Static export has no server to run the Image Optimization route on,
        // and trailing slashes let Hostinger's Apache serve each page's
        // index.html via its own directory-index, with no rewrite rules.
        trailingSlash: true,
        // The admin-only app/components/lib trees are moved out of the way
        // for this build (see scripts/build-export.mjs). tsc still
        // type-checks every test file the base tsconfig matches, and
        // tests/db/dashboard.test.ts imports admin-only modules, so
        // tsconfig.export.json excludes tests/ for this build only.
        typescript: { tsconfigPath: "tsconfig.export.json" },
      }
    : {}),
  images: {
    // AVIF first (smaller), WebP fallback.
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] : [],
    ...(isExport ? { unoptimized: true } : {}),
  },
  // `headers()` and `redirects()` have no effect in export mode (no server
  // to run them on) and next build refuses to start with output:'export' if
  // either is defined at all.
  ...(isExport
    ? {}
    : {
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
        // Migrates the old public Vercel URL to the new domains, now that
        // the public site has moved to Hostinger. Scoped to that one
        // hostname (`has: host`), so it never touches a request that
        // already arrived via dr-ahmedabdelsalam.com or
        // admin.dr-ahmedabdelsalam.com — the admin app is never redirected
        // to the public site. Order matters: the two /admin rules must
        // come before the catch-all, since Next.js uses the first match.
        //
        // Next.js resolves these at the routing layer, before proxy.ts
        // (middleware) runs — and evaluating a `has: host` condition is a
        // documented Vercel/Next.js limitation of `next dev`/`vercel dev`:
        // it only takes effect once actually deployed, so this cannot be
        // tested locally.
        async redirects() {
          return [
            {
              source: "/admin",
              has: [{ type: "host", value: OLD_VERCEL_HOST }],
              destination: `${ADMIN_HOST}/admin`,
              permanent: true,
            },
            {
              source: "/admin/:path*",
              has: [{ type: "host", value: OLD_VERCEL_HOST }],
              destination: `${ADMIN_HOST}/admin/:path*`,
              permanent: true,
            },
            {
              source: "/:path*",
              has: [{ type: "host", value: OLD_VERCEL_HOST }],
              destination: `${PUBLIC_HOST}/:path*`,
              permanent: true,
            },
          ];
        },
      }),
};

export default nextConfig;
