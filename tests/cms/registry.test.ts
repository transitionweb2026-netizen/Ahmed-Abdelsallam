/**
 * The dashboard's field definitions must describe the real content exactly:
 * every existing section and record validates, and loading it into a form
 * and saving it back (prune / row ⇄ document) loses nothing. Otherwise
 * editing a section in the dashboard could silently drop content.
 */
import { describe, expect, it } from "vitest";
import { buildBundledSnapshot } from "@/lib/cms/bundled";
import { docToRow, emptyDoc, isSafeHref, missingTranslations, pruneDoc, rowToDoc, validateDoc } from "@/lib/cms/fields";
import { cmsPages } from "@/lib/cms/pages";
import { collections, navigationFields, pageSeoFields, sectionTypes, settingsFields } from "@/lib/cms/registry";

const snapshot = buildBundledSnapshot();

describe("sections", () => {
  it("every page section has a section type definition", () => {
    for (const page of cmsPages) for (const section of page.sections) expect(sectionTypes[section.type], section.type).toBeDefined();
  });

  it.each(snapshot.sections.map((row) => [`${row.page_key}.${row.key}`, row] as const))("%s validates and survives a save", (_, row) => {
    const def = sectionTypes[row.type as keyof typeof sectionTypes];
    expect(validateDoc(def.fields, row.content)).toEqual([]);
    expect(pruneDoc(def.fields, row.content)).toEqual(row.content);
  });

  it("every image slot in use is declared", () => {
    for (const media of snapshot.sectionMedia) {
      const section = snapshot.sections.find((row) => row.id === media.section_id)!;
      const slots = sectionTypes[section.type as keyof typeof sectionTypes].slots ?? [];
      const base = media.slot.replace(/En$/, "");
      const slot = slots.find((s) => s.key === base);
      expect(slot, `${section.page_key}.${section.key}: ${media.slot}`).toBeDefined();
      if (media.slot !== base) expect(slot?.englishOverride).toBe(true);
    }
  });

  it("sections with a video are declared as such", () => {
    for (const row of snapshot.sections.filter((r) => r.video_id)) {
      expect(sectionTypes[row.type as keyof typeof sectionTypes].video, row.key).toBe(true);
    }
  });

  it("bundled content has no missing translations", () => {
    for (const row of snapshot.sections) {
      const def = sectionTypes[row.type as keyof typeof sectionTypes];
      expect(missingTranslations(def.fields, row.content), `${row.page_key}.${row.key}`).toEqual([]);
    }
  });
});

describe("collections", () => {
  const tables: Record<string, Record<string, unknown>[]> = {
    services: snapshot.services as never,
    conditions: snapshot.conditions as never,
    specialties: snapshot.specialties as never,
    qualifications: snapshot.qualifications as never,
    timeline_steps: snapshot.timelineSteps as never,
    stats: snapshot.stats as never,
    videos: snapshot.videos as never,
    reviews: snapshot.reviews as never,
    faqs: snapshot.faqs as never,
    articles: snapshot.articles as never,
    article_categories: snapshot.articleCategories as never,
  };

  it.each(collections.map((c) => [c.key, c] as const))("%s rows validate and convert losslessly", (_, def) => {
    const rows = tables[def.table].filter((row) => !def.group || row[def.group.column] === def.group.value);
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      const doc = rowToDoc(def.fields, row);
      expect(validateDoc(def.fields, doc), `${def.key}: ${String(row[def.naturalKey])}`).toEqual([]);
      const back = docToRow(def.fields, doc);
      for (const [column, value] of Object.entries(back)) expect(value, `${def.key}.${column}`).toEqual(row[column]);
    }
  });

  it("new items start valid apart from their required fields", () => {
    for (const def of collections) {
      const errors = validateDoc(def.fields, emptyDoc(def.fields)).filter((e) => !/required|choose|lowercase|invalid selection/.test(e.message));
      expect(errors, def.key).toEqual([]);
    }
  });
});

describe("settings, SEO and navigation", () => {
  it("global settings round-trip", () => {
    const row = snapshot.settings as unknown as Record<string, unknown>;
    const doc = rowToDoc(settingsFields, row);
    expect(validateDoc(settingsFields, doc)).toEqual([]);
    for (const [column, value] of Object.entries(docToRow(settingsFields, doc))) expect(value, column).toEqual(row[column]);
  });

  it("page SEO round-trips", () => {
    for (const page of snapshot.pages.filter((p) => p.path)) {
      const doc = rowToDoc(pageSeoFields, page as never);
      expect(validateDoc(pageSeoFields, doc), page.key).toEqual([]);
    }
  });

  it("navigation round-trips", () => {
    for (const item of snapshot.navigation) expect(validateDoc(navigationFields, rowToDoc(navigationFields, item as never)), item.key).toEqual([]);
  });
});

describe("link safety", () => {
  it("accepts site links and rejects script URLs", () => {
    for (const ok of ["/", "/services#fractures", "#faq", "https://example.com/a", "tel:+201000000000", "mailto:a@b.co"]) expect(isSafeHref(ok), ok).toBe(true);
    for (const bad of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "//evil.example", "data:text/html,x", " /x", "/x y", "vbscript:x", ""]) {
      expect(isSafeHref(bad), bad).toBe(false);
    }
  });
});
