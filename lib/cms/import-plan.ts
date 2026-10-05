/**
 * The order and conflict keys for writing a snapshot into the database.
 * Inserts never overwrite: a row whose natural key already exists is left
 * as it is (`on conflict … do nothing`), so re-running the import after
 * editors changed content in the dashboard keeps their changes.
 */
import type { CmsSnapshot } from "@/lib/cms/types";

export interface ImportStep {
  table: string;
  /** Columns (comma separated) identifying an existing row. */
  onConflict: string;
  rows: Record<string, unknown>[];
}

const rows = <T extends object>(items: T[]): Record<string, unknown>[] => items.map((item) => ({ ...item }) as Record<string, unknown>);

/** Parents before children, so every foreign key already exists. */
export function importPlan(snapshot: CmsSnapshot): ImportStep[] {
  return [
    { table: "media", onConflict: "id", rows: rows(snapshot.media) },
    { table: "site_settings", onConflict: "id", rows: snapshot.settings ? rows([snapshot.settings]) : [] },
    { table: "social_links", onConflict: "platform", rows: rows(snapshot.socials) },
    { table: "navigation_items", onConflict: "key", rows: rows(snapshot.navigation) },
    { table: "services", onConflict: "slug", rows: rows(snapshot.services) },
    { table: "conditions", onConflict: "slug", rows: rows(snapshot.conditions) },
    { table: "specialties", onConflict: "slug", rows: rows(snapshot.specialties) },
    { table: "qualifications", onConflict: "key", rows: rows(snapshot.qualifications) },
    { table: "timeline_steps", onConflict: "group_key,key", rows: rows(snapshot.timelineSteps) },
    { table: "stats", onConflict: "group_key,key", rows: rows(snapshot.stats) },
    { table: "videos", onConflict: "slug", rows: rows(snapshot.videos) },
    { table: "reviews", onConflict: "key", rows: rows(snapshot.reviews) },
    { table: "faqs", onConflict: "key", rows: rows(snapshot.faqs) },
    { table: "article_categories", onConflict: "key", rows: rows(snapshot.articleCategories) },
    { table: "articles", onConflict: "slug", rows: rows(snapshot.articles) },
    { table: "pages", onConflict: "key", rows: rows(snapshot.pages) },
    { table: "page_sections", onConflict: "page_key,key", rows: rows(snapshot.sections) },
    { table: "section_media", onConflict: "section_id,slot", rows: rows(snapshot.sectionMedia) },
    { table: "ui_strings", onConflict: "key", rows: rows(snapshot.uiStrings) },
  ];
}
