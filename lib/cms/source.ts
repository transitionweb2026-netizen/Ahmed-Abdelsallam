import "server-only";
import { cache } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import { buildBundledSnapshot } from "@/lib/cms/bundled";
import { ContentReader, type ContactSettings, type NavItemContent, type SiteIdentityContent, type SocialLinkContent } from "@/lib/cms/content-map";
import type { CmsSnapshot, Locale } from "@/lib/cms/types";
import { storagePublicBaseUrl } from "@/lib/supabase/env";
import { publicSupabase } from "@/lib/supabase/public";

/**
 * Where the website's content comes from:
 *  - Supabase (when NEXT_PUBLIC_SUPABASE_URL and the publishable key are
 *    set): one `cms_snapshot()` call per render, published rows only;
 *  - otherwise the content bundled in data/ — the site as it was before the
 *    CMS, so nothing breaks until the project is connected.
 *
 * Once Supabase is configured there is no silent fallback: if the content
 * cannot be loaded, rendering fails (a build fails, and a background
 * revalidation keeps serving the last good page) instead of showing stale
 * bundled content.
 */
export const contentSource: "supabase" | "bundled" = publicSupabase ? "supabase" : "bundled";

let bundled: CmsSnapshot | undefined;

export const getSnapshot = cache(async (): Promise<CmsSnapshot> => {
  if (!publicSupabase) {
    bundled ??= buildBundledSnapshot();
    return bundled;
  }
  const { data, error } = await publicSupabase.rpc("cms_snapshot");
  if (error) throw new Error(`CMS: could not load the website content from Supabase (${error.message}).`);
  const snapshot = data as CmsSnapshot | null;
  if (!snapshot?.settings) {
    throw new Error("CMS: Supabase is connected but holds no website content yet. Run supabase/seed/content.sql in the SQL editor, or sign in to /admin and use Import content (see docs/cms/SETUP.md).");
  }
  return snapshot;
});

/** Content of one language, read from the current snapshot. */
export const getReader = cache(async (locale: Locale): Promise<ContentReader> => {
  return new ContentReader(await getSnapshot(), locale, storagePublicBaseUrl, getDictionary(locale));
});

/** Site-wide settings shared by the header, footer, metadata and contact actions. */
export interface SiteData {
  identity: SiteIdentityContent;
  contact: ContactSettings;
  navigation: NavItemContent[];
  socials: SocialLinkContent[];
  bookingHref: string;
  /** Uploaded logo replacing the drawn brand mark (none = the built-in mark). */
  logo: { src: string; width: number; height: number; alt: string } | null;
  favicon: { src: string; type: string } | null;
  robotsIndex: boolean;
  storeSubmissions: boolean;
}

export const getSite = cache(async (locale: Locale): Promise<SiteData> => {
  const reader = await getReader(locale);
  const settings = reader.snapshot.settings;
  const media = (id: string | null | undefined) => (id ? reader.snapshot.media.find((row) => row.id === id) : undefined);
  const logo = media(settings?.logo_id);
  const favicon = media(settings?.favicon_id);
  return {
    identity: reader.identity(),
    contact: reader.contactSettings(),
    navigation: reader.navigation(),
    socials: reader.socials(),
    bookingHref: reader.bookingHref(),
    logo: logo ? { ...reader.image(logo.id), alt: reader.identity().name } : null,
    favicon: favicon ? { src: reader.mediaUrl(favicon), type: favicon.mime_type } : null,
    robotsIndex: settings?.robots_index ?? true,
    storeSubmissions: settings?.form_store_submissions ?? false,
  };
});
