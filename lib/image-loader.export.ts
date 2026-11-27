/**
 * Custom next/image loader for the Hostinger static export only (see
 * next.config.ts). output:'export' has no server to run Next's own Image
 * Optimization route on, and this project's Supabase plan doesn't have the
 * Storage image-transformation add-on enabled (confirmed: a direct request
 * to its render/image endpoint returns 403 FeatureNotEnabled) — so CMS
 * photos would otherwise ship exactly as uploaded. Several run 2-2.5MB as
 * plain PNG; routed through images.weserv.nl (a free, public resizing
 * proxy, no API key) at the actual requested width, re-encoded to WebP,
 * the same file measured 83KB in testing — about a 97% reduction, with
 * nothing changed on the Supabase side.
 *
 * Local/bundled assets (favicon, the static OG images, this app's own
 * public/ files) are already small and same-origin; weserv.nl needs a
 * publicly fetchable absolute URL, so those are served as-is unchanged.
 */
export default function exportImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("/")) return src;

  const bare = src.replace(/^https?:\/\//, "");
  const params = new URLSearchParams({
    url: bare,
    w: String(width),
    q: String(quality ?? 75),
    output: "webp",
  });
  return `https://images.weserv.nl/?${params.toString()}`;
}
