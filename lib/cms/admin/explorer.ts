/**
 * Every editable text of the website as a flat, searchable list (content
 * explorer) plus the dashboard overview's figures. Pure functions over the
 * rows an administrator can read.
 */
import { rowToDoc, textEntries } from "@/lib/cms/fields";
import { cmsPages, pageDef } from "@/lib/cms/pages";
import { collections, navigationFields, pageSeoFields, sectionTypes, settingsFields, type CollectionDef } from "@/lib/cms/registry";
import type { SectionType } from "@/lib/cms/section-docs";
import type { NavRow, PageRow, SectionRow, SettingsRow, SocialRow, UiStringRow } from "@/lib/cms/types";

type Row = Record<string, unknown>;

export type EntryArea = "section" | "item" | "settings" | "seo" | "navigation" | "interface";

export interface ContentEntry {
  id: string;
  area: EntryArea;
  /** Pages the text appears on ("" = every page). */
  pages: string[];
  /** Where it is edited, e.g. "Home → Hero" or "Service · Knee pain". */
  container: string;
  field: string;
  ar: string;
  en: string;
  /** The language that is empty while the other is filled. */
  missing: "ar" | "en" | null;
  state: "published" | "draft" | "hidden" | null;
  href: string;
}

/** Pages on which a collection's items appear. */
export const COLLECTION_PAGES: Record<string, string[]> = {
  services: ["services", "home", "about"],
  conditions: ["services", "home"],
  specialties: ["about"],
  qualifications: ["about"],
  journey: ["home"],
  diagnosis: ["services"],
  career: ["about"],
  "home-stats": ["home"],
  "about-stats": ["about"],
  videos: ["videos", "home", "about"],
  reviews: ["reviews", "home"],
  faqs: ["reviews", "home"],
  articles: ["articles"],
  categories: ["articles"],
};

export interface IndexInput {
  settings: SettingsRow | null;
  pages: PageRow[];
  sections: SectionRow[];
  navigation: NavRow[];
  socials?: SocialRow[];
  uiStrings: UiStringRow[];
  rowsOf: (def: CollectionDef) => Row[];
}

const ALL_PAGES = cmsPages.filter((p) => p.path).map((p) => p.key);

function missingOf(ar: string, en: string): "ar" | "en" | null {
  const a = ar.trim() !== "";
  const e = en.trim() !== "";
  return a && !e ? "en" : e && !a ? "ar" : null;
}

export function itemTitle(def: CollectionDef, row: Row): string {
  return String(row[`${def.titleField}_en`] || row[`${def.titleField}_ar`] || row[def.naturalKey] || "Untitled");
}

export function buildContentIndex(input: IndexInput): ContentEntry[] {
  const out: ContentEntry[] = [];
  const push = (base: Omit<ContentEntry, "id" | "field" | "ar" | "en" | "missing">, entries: { path: string; label: string; ar: string; en: string }[], flagMissing = true) => {
    for (const entry of entries) {
      if (!entry.ar && !entry.en) continue;
      out.push({ ...base, id: `${base.href}|${entry.path}`, field: entry.label, ar: entry.ar, en: entry.en, missing: flagMissing ? missingOf(entry.ar, entry.en) : null });
    }
  };

  for (const section of input.sections) {
    const page = pageDef(section.page_key);
    const def = page?.sections.find((s) => s.key === section.key);
    const type = sectionTypes[section.type as SectionType];
    if (!page || !def || !type) continue;
    push(
      {
        area: "section",
        pages: page.path ? [page.key] : ALL_PAGES,
        container: `${page.label} → ${def.label}`,
        state: section.visible ? "published" : "hidden",
        href: `/admin/pages/${page.key}/${section.key}`,
      },
      textEntries(type.fields, section.content),
    );
  }

  for (const def of collections) {
    for (const row of input.rowsOf(def)) {
      push(
        {
          area: "item",
          pages: COLLECTION_PAGES[def.key] ?? [],
          container: `${def.singular} · ${itemTitle(def, row)}`,
          state: def.hasStatus ? (row.status === "draft" ? "draft" : "published") : null,
          href: `/admin/c/${def.key}/${row.id}`,
        },
        textEntries(def.fields, rowToDoc(def.fields, row)),
      );
    }
  }

  if (input.settings) {
    push(
      { area: "settings", pages: ALL_PAGES, container: "Global settings", state: null, href: "/admin/settings" },
      textEntries(settingsFields, rowToDoc(settingsFields, input.settings as unknown as Row)),
    );
  }

  for (const page of input.pages) {
    const def = pageDef(page.key);
    if (!def?.path) continue;
    push(
      { area: "seo", pages: [page.key], container: `SEO · ${def.label}`, state: page.robots_index ? "published" : "hidden", href: `/admin/seo#page-${page.key}` },
      textEntries(pageSeoFields, rowToDoc(pageSeoFields, page as unknown as Row)),
    );
  }

  for (const item of input.navigation) {
    push(
      { area: "navigation", pages: ALL_PAGES, container: `Menu · ${item.key}`, state: item.visible ? "published" : "hidden", href: "/admin/navigation" },
      textEntries(navigationFields, rowToDoc(navigationFields, item as unknown as Row)).map((e) => ({ ...e, path: `${item.key}.${e.path}` })),
    );
  }

  // Empty interface texts fall back to the built-in wording, so they are not "missing".
  for (const row of input.uiStrings) {
    push(
      { area: "interface", pages: ALL_PAGES, container: `Interface text · ${row.key.split(".")[0]}`, state: null, href: `/admin/strings?q=${encodeURIComponent(row.key)}` },
      [{ path: row.key, label: row.key, ar: row.value_ar, en: row.value_en }],
      false,
    );
  }
  return out;
}

/* ---- Overview ------------------------------------------------------------------ */

export interface Attention {
  level: "warning" | "info";
  text: string;
  href: string;
}

export function attentionItems(input: IndexInput, entries: ContentEntry[]): Attention[] {
  const out: Attention[] = [];
  const s = input.settings;
  if (s) {
    if (!s.phone_digits) out.push({ level: "warning", text: "The clinic phone number is not set — call buttons show a placeholder.", href: "/admin/settings" });
    if (!s.email) out.push({ level: "info", text: "No contact email is set.", href: "/admin/settings" });
    if (s.address_is_placeholder) out.push({ level: "warning", text: "The clinic address is marked as provisional.", href: "/admin/settings" });
    if (s.hours_are_placeholder) out.push({ level: "warning", text: "The opening hours are marked as provisional.", href: "/admin/settings" });
    if (s.map_is_placeholder) out.push({ level: "warning", text: "The map pin is marked as provisional.", href: "/admin/settings" });
    if (!s.robots_index) out.push({ level: "warning", text: "Search engines are asked not to index the website.", href: "/admin/settings" });
  }
  const generic = (input.socials ?? []).filter((social) => social.visible && /^https?:\/\/[^/]+\/?$/.test(social.url));
  if (generic.length) {
    out.push({
      level: "warning",
      text: `${generic.length} social link${generic.length === 1 ? " points" : "s point"} to a platform's home page instead of the doctor's profile (${generic.map((s) => s.platform).join(", ")}).`,
      href: "/admin/navigation",
    });
  }
  const reviews = collections.find((c) => c.key === "reviews")!;
  const placeholderReviews = input.rowsOf(reviews).filter((row) => row.is_placeholder && row.status === "published").length;
  if (placeholderReviews) {
    out.push({
      level: "warning",
      text: `${placeholderReviews} published review${placeholderReviews === 1 ? " is a placeholder" : "s are placeholders"}, not genuine patient feedback. Replace them with real reviews (with consent) or set them to draft.`,
      href: "/admin/c/reviews",
    });
  }
  const missing = entries.filter((e) => e.missing).length;
  if (missing) out.push({ level: "info", text: `${missing} text${missing === 1 ? " is" : "s are"} filled in one language only.`, href: "/admin/content?missing=any" });
  return out;
}

export interface RecentChange {
  label: string;
  href: string;
  updatedAt: string;
}

export function recentChanges(input: IndexInput, limit = 8): RecentChange[] {
  const out: RecentChange[] = [];
  for (const section of input.sections) {
    const page = pageDef(section.page_key);
    const def = page?.sections.find((s) => s.key === section.key);
    if (page && def && section.updated_at) out.push({ label: `${page.label} → ${def.label}`, href: `/admin/pages/${page.key}/${section.key}`, updatedAt: section.updated_at });
  }
  for (const def of collections) {
    for (const row of input.rowsOf(def)) {
      if (row.updated_at) out.push({ label: `${def.singular} · ${itemTitle(def, row)}`, href: `/admin/c/${def.key}/${row.id}`, updatedAt: String(row.updated_at) });
    }
  }
  if (input.settings?.updated_at) out.push({ label: "Global settings", href: "/admin/settings", updatedAt: input.settings.updated_at });
  for (const page of input.pages) {
    if (page.updated_at && pageDef(page.key)?.path) out.push({ label: `SEO · ${pageDef(page.key)!.label}`, href: `/admin/seo#page-${page.key}`, updatedAt: page.updated_at });
  }
  return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, limit);
}
