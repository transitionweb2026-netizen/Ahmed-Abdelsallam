import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { withUrl, type MediaItem, type MediaMap, type MediaUsage, type ReferenceOptions, type VideoOption } from "@/lib/cms/admin/types";
import type { Field } from "@/lib/cms/fields";
import { pageDef } from "@/lib/cms/pages";
import { collections, type CollectionDef } from "@/lib/cms/registry";
import type { MediaRow, NavRow, PageRow, SectionMediaRow, SectionRow, SettingsRow, SocialRow, UiStringRow } from "@/lib/cms/types";

/**
 * Reads for the dashboard. They run with the signed-in administrator's
 * session, so drafts and hidden sections are included (RLS: "admins read
 * all"), and a non-admin would get nothing back.
 */

type Row = Record<string, unknown>;

function data<T>(result: { data: T | null; error: { message: string } | null }, what: string): T {
  if (result.error) throw new Error(`Could not load ${what}: ${result.error.message}`);
  return result.data as T;
}

export async function loadMediaMap(supabase: SupabaseClient, ids: (string | null | undefined)[]): Promise<MediaMap> {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (!unique.length) return {};
  const rows = data<MediaRow[]>(await supabase.from("media").select("*").in("id", unique), "media");
  return Object.fromEntries(rows.map((row) => [row.id, withUrl(row)]));
}

export async function loadAllMedia(supabase: SupabaseClient): Promise<MediaItem[]> {
  const rows = data<MediaRow[]>(await supabase.from("media").select("*").order("created_at", { ascending: false }).order("path"), "media");
  return rows.map(withUrl);
}

/** Media ids referenced by media fields of a document. */
export function mediaIdsOf(fields: Field[], doc: Row): string[] {
  return fields.filter((field) => field.type === "media").map((field) => doc[field.key] as string | null).filter((id): id is string => Boolean(id));
}

export async function loadCollectionRows(supabase: SupabaseClient, def: CollectionDef): Promise<Row[]> {
  let query = supabase.from(def.table).select("*");
  if (def.group) query = query.eq(def.group.column, def.group.value);
  return data<Row[]>(await query.order("sort_order").order(def.naturalKey), def.label);
}

export async function loadRecord(supabase: SupabaseClient, def: CollectionDef, id: string): Promise<Row | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  let query = supabase.from(def.table).select("*").eq("id", id);
  if (def.group) query = query.eq(def.group.column, def.group.value);
  return data<Row | null>(await query.maybeSingle(), def.singular);
}

/** Choices for reference fields (e.g. the service a specialty opens). */
export async function loadReferenceOptions(supabase: SupabaseClient, fields: Field[]): Promise<ReferenceOptions> {
  const out: ReferenceOptions = {};
  for (const field of fields) {
    if (field.type !== "reference") continue;
    const rows = data<Row[]>(await supabase.from(field.table).select("*").order("sort_order"), field.label);
    out[field.key] = rows.map((row) => ({ value: String(row.id), label: String(row[field.labelColumn] || row.id) }));
  }
  return out;
}

export async function loadVideoOptions(supabase: SupabaseClient): Promise<VideoOption[]> {
  const rows = data<Row[]>(await supabase.from("videos").select("id, title_en, title_ar, status").order("sort_order"), "videos");
  return rows.map((row) => ({ value: String(row.id), label: String(row.title_en || row.title_ar), status: String(row.status) }));
}

export interface PageSections {
  sections: SectionRow[];
  media: SectionMediaRow[];
}

export async function loadPageSections(supabase: SupabaseClient, pageKey: string): Promise<PageSections> {
  const sections = data<SectionRow[]>(await supabase.from("page_sections").select("*").eq("page_key", pageKey).order("sort_order"), "sections");
  const media = sections.length
    ? data<SectionMediaRow[]>(
        await supabase
          .from("section_media")
          .select("*")
          .in(
            "section_id",
            sections.map((s) => s.id),
          ),
        "section images",
      )
    : [];
  return { sections, media };
}

export async function loadPage(supabase: SupabaseClient, key: string): Promise<PageRow | null> {
  return data<PageRow | null>(await supabase.from("pages").select("*").eq("key", key).maybeSingle(), "page");
}

export async function loadPages(supabase: SupabaseClient): Promise<PageRow[]> {
  return data<PageRow[]>(await supabase.from("pages").select("*").order("key"), "pages");
}

export async function loadSettings(supabase: SupabaseClient): Promise<SettingsRow | null> {
  return data<SettingsRow | null>(await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(), "settings");
}

export async function loadNavigation(supabase: SupabaseClient): Promise<{ navigation: NavRow[]; socials: SocialRow[] }> {
  const [navigation, socials] = await Promise.all([
    supabase.from("navigation_items").select("*").order("sort_order"),
    supabase.from("social_links").select("*").order("sort_order"),
  ]);
  return { navigation: data<NavRow[]>(navigation, "navigation"), socials: data<SocialRow[]>(socials, "social links") };
}

export async function loadUiStrings(supabase: SupabaseClient): Promise<UiStringRow[]> {
  return data<UiStringRow[]>(await supabase.from("ui_strings").select("*").order("key"), "interface text");
}

/* ---- Media usage -------------------------------------------------------------- */

const COLLECTION_BY_TABLE: Record<string, CollectionDef | undefined> = Object.fromEntries(
  collections.filter((c) => !c.group).map((c) => [c.table, c]),
);

const FIELD_LABELS: Record<string, string> = {
  image: "image",
  poster: "poster",
  file_ar: "video file",
  file_en: "English video file",
  avatar: "photo",
  cover: "cover",
  og_image_ar: "Arabic sharing image",
  og_image_en: "English sharing image",
  logo: "logo",
  favicon: "browser icon",
};

export function describeUsage(row: { source: string; record_id: string; record_key: string; field: string }): MediaUsage {
  const field = FIELD_LABELS[row.field] ?? row.field;
  if (row.source === "sections") {
    const [page, section] = row.record_key.split(".");
    const pageLabel = pageDef(page)?.label ?? page;
    const sectionLabel = pageDef(page)?.sections.find((s) => s.key === section)?.label ?? section;
    return { ...row, href: `/admin/pages/${page}/${section}`, label: `${pageLabel} → ${sectionLabel} (${row.field})` };
  }
  if (row.source === "pages") return { ...row, href: `/admin/seo#page-${row.record_key}`, label: `SEO of ${pageDef(row.record_key)?.label ?? row.record_key} (${field})` };
  if (row.source === "settings") return { ...row, href: "/admin/settings", label: `Global settings (${field})` };
  const collection = COLLECTION_BY_TABLE[row.source];
  return {
    ...row,
    href: collection ? `/admin/c/${collection.key}/${row.record_id}` : "/admin",
    label: `${collection?.singular ?? row.source} “${row.record_key}” (${field})`,
  };
}

export async function loadMediaUsages(supabase: SupabaseClient, mediaId?: string): Promise<Record<string, MediaUsage[]>> {
  let query = supabase.from("media_usages").select("*");
  if (mediaId) query = query.eq("media_id", mediaId);
  const rows = data<{ media_id: string; source: string; record_id: string; record_key: string; field: string }[]>(await query, "media usage");
  const out: Record<string, MediaUsage[]> = {};
  for (const row of rows) (out[row.media_id] ??= []).push(describeUsage(row));
  return out;
}

/* ---- Everything (overview, content explorer) ------------------------------ */

export interface AllContent {
  settings: SettingsRow | null;
  pages: PageRow[];
  sections: SectionRow[];
  navigation: NavRow[];
  socials: SocialRow[];
  uiStrings: UiStringRow[];
  tables: Record<CollectionDef["table"], Row[]>;
  mediaCount: number;
  mediaBytes: number;
  inbox: { total: number; unread: number };
}

export async function loadAllContent(supabase: SupabaseClient): Promise<AllContent> {
  const tables = [...new Set(collections.map((c) => c.table))];
  const [settings, pages, sections, navigation, socials, uiStrings, media, inboxTotal, inboxUnread, ...rows] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("pages").select("*").order("key"),
    supabase.from("page_sections").select("*").order("page_key").order("sort_order"),
    supabase.from("navigation_items").select("*").order("sort_order"),
    supabase.from("social_links").select("*").order("sort_order"),
    supabase.from("ui_strings").select("*").order("key"),
    supabase.from("media").select("size_bytes"),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
    ...tables.map((table) => supabase.from(table).select("*").order("sort_order")),
  ]);
  const mediaRows = data<{ size_bytes: number | null }[]>(media, "media");
  return {
    settings: data<SettingsRow | null>(settings, "settings"),
    pages: data<PageRow[]>(pages, "pages"),
    sections: data<SectionRow[]>(sections, "sections"),
    navigation: data<NavRow[]>(navigation, "navigation"),
    socials: data<SocialRow[]>(socials, "social links"),
    uiStrings: data<UiStringRow[]>(uiStrings, "interface text"),
    tables: Object.fromEntries(tables.map((table, i) => [table, data<Row[]>(rows[i] as never, table)])) as AllContent["tables"],
    mediaCount: mediaRows.length,
    mediaBytes: mediaRows.reduce((sum, row) => sum + Number(row.size_bytes ?? 0), 0),
    inbox: { total: inboxTotal.count ?? 0, unread: inboxUnread.count ?? 0 },
  };
}

/** The rows of one collection out of AllContent (timeline steps and stats are split by group). */
export function rowsOf(all: AllContent, def: CollectionDef): Row[] {
  const rows = all.tables[def.table] ?? [];
  return def.group ? rows.filter((row) => row[def.group!.column] === def.group!.value) : rows;
}
