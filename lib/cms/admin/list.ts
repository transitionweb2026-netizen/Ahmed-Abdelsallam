import type { ListItem } from "@/components/admin/CollectionList";
import type { MediaMap } from "@/lib/cms/admin/types";
import { missingTranslations, rowToDoc } from "@/lib/cms/fields";
import type { CollectionDef } from "@/lib/cms/registry";

type Row = Record<string, unknown>;

/** The image shown next to an item in its list (first image field). */
export function thumbField(def: CollectionDef): string | null {
  return def.fields.find((field) => field.type === "media" && field.kind === "image")?.key ?? null;
}

function noteOf(def: CollectionDef, row: Row): string | undefined {
  if (def.table === "stats") return row.count_of ? `counts ${row.count_of}` : `${row.prefix ?? ""}${row.value ?? ""}${row.suffix ?? ""}`;
  if (def.table === "qualifications") return String(row.year || "") || undefined;
  if (def.table === "articles") return String(row.published_at ?? "");
  if (def.table === "videos" && row.listed === false) return "not in gallery";
  if (def.table === "timeline_steps" && (row.meta_en || row.meta_ar)) return String(row.meta_en || row.meta_ar);
  return undefined;
}

export function toListItem(def: CollectionDef, row: Row, media: MediaMap): ListItem {
  const thumb = thumbField(def);
  return {
    id: String(row.id),
    key: String(row[def.naturalKey] ?? ""),
    title_ar: String(row[`${def.titleField}_ar`] ?? ""),
    title_en: String(row[`${def.titleField}_en`] ?? ""),
    status: def.hasStatus ? (row.status === "draft" ? "draft" : "published") : null,
    featured: def.hasFeatured && row.featured === true,
    thumb: thumb ? (media[String(row[thumb])]?.url ?? "") : null,
    note: noteOf(def, row),
    missing: missingTranslations(def.fields, rowToDoc(def.fields, row)).length,
    placeholder: def.table === "reviews" && row.is_placeholder === true,
  };
}

/** Back link for collections that are one group of a hub page. */
export function hubOf(key: string): { href: string; label: string } | undefined {
  if (["journey", "diagnosis", "career"].includes(key)) return { href: "/admin/timelines", label: "Timelines" };
  if (["home-stats", "about-stats"].includes(key)) return { href: "/admin/statistics", label: "Statistics" };
  return undefined;
}
