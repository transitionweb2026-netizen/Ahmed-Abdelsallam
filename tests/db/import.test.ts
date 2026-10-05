/**
 * The import path end to end, without Supabase: the bundled content is
 * written into the migrated database with the same import plan the
 * dashboard's Import content action uses, then read back the way the website reads it
 * (`cms_snapshot()` as an anonymous visitor) and compared with the
 * original website content.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { buildBundledSnapshot } from "@/lib/cms/bundled";
import { ContentReader } from "@/lib/cms/content-map";
import { importPlan } from "@/lib/cms/import-plan";
import type { CmsSnapshot, Locale } from "@/lib/cms/types";
import { as, createDatabase } from "./harness";

const golden = JSON.parse(readFileSync(join(process.cwd(), "tests", "fixtures", "golden-content.json"), "utf8"));
const plain = <T>(value: T): T => JSON.parse(JSON.stringify(value));

let db: PGlite;

/** Same semantics as the script's upsert: insert, never overwrite. */
async function runImport(target: PGlite): Promise<Record<string, number>> {
  const inserted: Record<string, number> = {};
  for (const step of importPlan(buildBundledSnapshot())) {
    if (!step.rows.length) continue;
    const columns = Object.keys(step.rows[0]).map((c) => `"${c}"`).join(", ");
    const { rows } = await target.query<{ n: number }>(
      `with ins as (
         insert into public.${step.table} (${columns})
         select ${columns} from jsonb_populate_recordset(null::public.${step.table}, $1::jsonb)
         on conflict (${step.onConflict}) do nothing
         returning 1
       ) select count(*)::int as n from ins`,
      [JSON.stringify(step.rows)],
    );
    inserted[step.table] = rows[0].n;
  }
  return inserted;
}

async function publicSnapshot(): Promise<CmsSnapshot> {
  const { rows } = await as(db, { role: "anon" }, (tx) => tx.query<{ s: CmsSnapshot }>(`select public.cms_snapshot() as s`));
  return rows[0].s;
}

beforeAll(async () => {
  db = await createDatabase();
});

describe("import", () => {
  it("writes every bundled row", async () => {
    const inserted = await runImport(db);
    const snapshot = buildBundledSnapshot();
    expect(inserted.services).toBe(snapshot.services.length);
    expect(inserted.page_sections).toBe(snapshot.sections.length);
    expect(inserted.media).toBe(snapshot.media.length);
    expect(inserted.ui_strings).toBe(snapshot.uiStrings.length);
  });

  it("is idempotent and never overwrites edited content", async () => {
    await db.query(`update public.services set title_en = 'Edited in the dashboard' where slug = 'fractures'`);
    const again = await runImport(db);
    expect(Object.values(again).every((n) => n === 0)).toBe(true);
    const { rows } = await db.query<{ title_en: string }>(`select title_en from public.services where slug = 'fractures'`);
    expect(rows[0].title_en).toBe("Edited in the dashboard");
    await db.query(`update public.services set title_en = 'Fracture Diagnosis and Treatment' where slug = 'fractures'`);
  });
});

describe.each<Locale>(["ar", "en"])("website content read from the database (%s)", (locale) => {
  let reader: ContentReader;
  beforeAll(async () => {
    reader = new ContentReader(await publicSnapshot(), locale, "https://example.supabase.co/storage/v1/object/public", getDictionary(locale));
  });

  it("matches the original website", () => {
    const g = golden[locale];
    expect(plain(reader.dictionary())).toEqual(g.dictionary);
    expect(plain(reader.home())).toEqual(g.home);
    expect(plain(reader.about())).toEqual(g.about);
    expect(plain(reader.servicesPage())).toEqual(g.servicesPage);
    expect(plain(reader.videosPage())).toEqual(g.videosPage);
    expect(plain(reader.reviewsPage())).toEqual(g.reviewsPage);
    expect(plain(reader.articlesPage())).toEqual(g.articlesPage);
    expect(plain(reader.contactPage())).toEqual(g.contactPage);
    expect(plain(reader.services())).toEqual(g.services);
    expect(plain(reader.conditions())).toEqual(g.conditions);
    expect(plain(reader.specialties())).toEqual(g.specialties);
    expect(plain(reader.qualifications())).toEqual(g.qualifications);
    expect(plain(reader.videos())).toEqual(g.videos);
    expect(plain(reader.reviews())).toEqual(g.reviews);
    expect(plain(reader.faqs())).toEqual(g.faqs);
    expect(plain(reader.articles())).toEqual(g.articles);
    expect(plain(reader.contactInfo())).toEqual(g.contactInfo);
    expect(plain(reader.identity())).toEqual(golden.identity[locale]);
  });
});

describe("publishing", () => {
  it("drafts and hidden sections disappear from the website", async () => {
    await db.query(`update public.services set status = 'draft' where slug = 'fractures'`);
    await db.query(`update public.page_sections set visible = false where page_key = 'home' and key = 'stats'`);
    const reader = new ContentReader(await publicSnapshot(), "en", null, getDictionary("en"));
    expect(reader.services().map((s) => s.slug)).not.toContain("fractures");
    expect(reader.sectionOrder("home")).not.toContain("stats");
    await db.query(`update public.services set status = 'published' where slug = 'fractures'`);
    await db.query(`update public.page_sections set visible = true where page_key = 'home' and key = 'stats'`);
  });

  it("reordered sections render in the new order", async () => {
    await db.query(`update public.page_sections set sort_order = 15 where page_key = 'home' and key = 'videos'`);
    const reader = new ContentReader(await publicSnapshot(), "ar", null, getDictionary("ar"));
    expect(reader.sectionOrder("home").slice(0, 3)).toEqual(["hero", "videos", "intro"]);
  });

  it("media stored in Supabase Storage resolve to public URLs", async () => {
    await db.query(`update public.media set bucket = 'media', path = 'site/images/services/fractures.jpg' where legacy_path = '/images/services/fractures.jpg'`);
    const reader = new ContentReader(await publicSnapshot(), "en", "https://example.supabase.co/storage/v1/object/public", getDictionary("en"));
    expect(reader.services().find((s) => s.slug === "fractures")?.image.src).toBe(
      "https://example.supabase.co/storage/v1/object/public/media/site/images/services/fractures.jpg",
    );
  });
});
