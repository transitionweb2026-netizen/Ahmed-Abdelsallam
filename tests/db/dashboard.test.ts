/**
 * The dashboard's save path end to end, without Supabase: documents go
 * through the same preparation as the Server Actions (lib/cms/admin/
 * mutations.ts) and are then written the way PostgREST writes them, as a
 * signed-in administrator under Row Level Security. Also covers the seed
 * SQL file used for the first import from the Supabase SQL editor.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PGlite, Transaction } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { InvalidInput, orderUpdates, prepareNavigation, preparePageSeo, prepareRecord, prepareSection, prepareSettings, prepareSocials, prepareUiStrings } from "@/lib/cms/admin/mutations";
import { buildBundledSnapshot } from "@/lib/cms/bundled";
import { ContentReader } from "@/lib/cms/content-map";
import { rowToDoc } from "@/lib/cms/fields";
import { cmsPages } from "@/lib/cms/pages";
import { collections, pageSeoFields, settingsFields } from "@/lib/cms/registry";
import { seedSql } from "@/lib/cms/seed-sql";
import type { CmsSnapshot } from "@/lib/cms/types";
import { as, createDatabase, createUser, failureOf, type Actor } from "./harness";

type Row = Record<string, unknown>;

const snapshot = buildBundledSnapshot();
const SEED_FILE = join(process.cwd(), "supabase", "seed", "content.sql");

let db: PGlite;
let admin: Actor;
let outsider: Actor;

/** UPDATE … like PostgREST: values coerced from JSON into the column types. */
async function update(tx: Transaction, table: string, values: Row, where: string, params: unknown[]): Promise<number> {
  const columns = Object.keys(values).map((c) => `"${c}"`);
  const set = columns.length === 1 ? `${columns[0]} = (select ${columns[0]} from v)` : `(${columns.join(", ")}) = (select ${columns.join(", ")} from v)`;
  const result = await tx.query(`with v as (select * from jsonb_populate_record(null::public.${table}, $1::jsonb)) update public.${table} set ${set} where ${where}`, [JSON.stringify(values), ...params]);
  return result.affectedRows ?? 0;
}

async function insert(tx: Transaction, table: string, values: Row): Promise<string> {
  const columns = Object.keys(values).map((c) => `"${c}"`).join(", ");
  const { rows } = await tx.query<{ id: string }>(`insert into public.${table} (${columns}) select ${columns} from jsonb_populate_record(null::public.${table}, $1::jsonb) returning id`, [JSON.stringify(values)]);
  return rows[0].id;
}

/** Rows as PostgREST returns them (JSON types: numbers, "YYYY-MM-DD" dates …). */
async function rowsOf(table: string, where = "true"): Promise<Row[]> {
  return (await db.query<{ r: Row }>(`select to_jsonb(t) as r from public.${table} t where ${where}`)).rows.map((x) => x.r);
}

async function publicSnapshot(): Promise<CmsSnapshot> {
  const { rows } = await as(db, { role: "anon" }, (tx) => tx.query<{ s: CmsSnapshot }>(`select public.cms_snapshot() as s`));
  return rows[0].s;
}

const invalid = (fn: () => unknown): string[] => {
  try {
    fn();
  } catch (error) {
    if (error instanceof InvalidInput) return error.fieldErrors.map((e) => e.path);
    throw error;
  }
  return [];
};

beforeAll(async () => {
  db = await createDatabase();
  // First import through the generated seed file (what the SQL editor runs).
  await db.exec(readFileSync(SEED_FILE, "utf8"));
  const adminId = await createUser(db, "editor@example.com");
  await db.query(`insert into public.admins (user_id, email, role) values ($1, 'editor@example.com', 'editor')`, [adminId]);
  admin = { role: "authenticated", userId: adminId };
  outsider = { role: "authenticated", userId: await createUser(db, "someone@example.com") };
});

describe("seed SQL (supabase/seed/content.sql)", () => {
  it("is up to date with the content in the code (run `npm run cms:seed-sql` after changing data/)", () => {
    expect(readFileSync(SEED_FILE, "utf8").replace(/\r\n/g, "\n")).toBe(seedSql(snapshot));
  });

  it("imports everything, and running it again changes nothing", async () => {
    const count = async () => (await db.query<{ n: number }>(`select (select count(*) from public.page_sections) + (select count(*) from public.services) + (select count(*) from public.media) as n`)).rows[0].n;
    const before = Number(await count());
    expect(before).toBe(snapshot.sections.length + snapshot.services.length + snapshot.media.length);
    await db.exec(readFileSync(SEED_FILE, "utf8"));
    expect(Number(await count())).toBe(before);
  });

  it("renders the original website", async () => {
    const golden = JSON.parse(readFileSync(join(process.cwd(), "tests", "fixtures", "golden-content.json"), "utf8"));
    for (const locale of ["ar", "en"] as const) {
      const reader = new ContentReader(await publicSnapshot(), locale, null, getDictionary(locale));
      expect(JSON.parse(JSON.stringify(reader.home()))).toEqual(golden[locale].home);
      expect(JSON.parse(JSON.stringify(reader.services()))).toEqual(golden[locale].services);
    }
  });
});

describe("saving existing content as an administrator", () => {
  it.each(collections.map((c) => [c.key, c] as const))("%s: every item saves unchanged", async (_, def) => {
    const where = def.group ? `${def.group.column} = '${def.group.value}'` : "true";
    const rows = await rowsOf(def.table, where);
    expect(rows.length).toBeGreaterThan(0);
    await as(db, admin, async (tx) => {
      for (const row of rows) {
        const values = prepareRecord(def, { doc: rowToDoc(def.fields, row), status: (row.status as "draft" | "published") ?? "published" }, "update");
        expect(await update(tx, def.table, values, "id = $2", [row.id])).toBe(1);
      }
      const after = (await tx.query<{ r: Row }>(`select to_jsonb(t) as r from public.${def.table} t where ${where}`)).rows.map((x) => x.r);
      const strip = (r: Row): Row => ({ ...r, updated_at: null });
      expect(after.map(strip).sort((a, b) => String(a.id).localeCompare(String(b.id)))).toEqual(rows.map(strip).sort((a, b) => String(a.id).localeCompare(String(b.id))));
    });
  });

  it("every page section saves", async () => {
    const { rows } = await db.query<{ id: string; page_key: string; key: string; content: Row; video_id: string | null }>(`select id, page_key, key, content, video_id from public.page_sections`);
    const media = await db.query<{ section_id: string; slot: string; media_id: string; object_position: string | null; alt_ar: string | null; alt_en: string | null }>(`select * from public.section_media`);
    await as(db, admin, async (tx) => {
      for (const row of rows) {
        const slots = Object.fromEntries(media.rows.filter((m) => m.section_id === row.id).map((m) => [m.slot, { media_id: m.media_id, object_position: m.object_position, alt_ar: m.alt_ar, alt_en: m.alt_en }]));
        const prepared = prepareSection(row.page_key, row.key, { doc: row.content, slots, videoId: row.video_id });
        expect(prepared.content).toEqual(row.content);
        const values: Row = { content: prepared.content };
        if (prepared.videoId !== undefined) values.video_id = prepared.videoId;
        expect(await update(tx, "page_sections", values, "id = $2", [row.id])).toBe(1);
        for (const slot of prepared.upsertSlots) {
          await tx.query(
            `insert into public.section_media (section_id, slot, media_id, object_position, alt_ar, alt_en) values ($1, $2, $3, $4, $5, $6)
             on conflict (section_id, slot) do update set media_id = excluded.media_id, object_position = excluded.object_position, alt_ar = excluded.alt_ar, alt_en = excluded.alt_en`,
            [row.id, slot.slot, slot.media_id, slot.object_position, slot.alt_ar, slot.alt_en],
          );
        }
      }
    });
  });

  it("settings, page SEO, navigation, social links and interface text save", async () => {
    const [settings] = await rowsOf("site_settings");
    const pages = await rowsOf("pages", "path is not null");
    const nav = (await rowsOf("navigation_items")).sort((a, b) => Number(a.sort_order) - Number(b.sort_order));
    await as(db, admin, async (tx) => {
      expect(await update(tx, "site_settings", prepareSettings(rowToDoc(settingsFields, settings)), "id = 1", [])).toBe(1);
      for (const page of pages) expect(await update(tx, "pages", preparePageSeo(rowToDoc(pageSeoFields, page)), "key = $2", [page.key])).toBe(1);
      const items = prepareNavigation(nav.map((n) => ({ id: String(n.id), key: String(n.key), doc: { label: { ar: n.label_ar, en: n.label_en }, href: n.href, visible: n.visible, show_in_header: n.show_in_header, show_in_footer: n.show_in_footer } })));
      for (const item of items) expect(await update(tx, "navigation_items", item.row, "id = $2", [item.id])).toBe(1);
      for (const social of prepareSocials([{ platform: "instagram", url: "https://www.instagram.com/example.clinic", visible: true }])) {
        expect(await update(tx, "social_links", social, "platform = $2", [social.platform])).toBe(1);
      }
      const known = new Set(snapshot.uiStrings.map((s) => s.key));
      const [first] = prepareUiStrings([{ key: snapshot.uiStrings[0].key, value_ar: "نص", value_en: "Text" }], known);
      expect(await update(tx, "ui_strings", { value_ar: first.value_ar, value_en: first.value_en }, "key = $2", [first.key])).toBe(1);
    });
  });
});

describe("creating, publishing and ordering", () => {
  it("a new item starts as a draft and appears on the website only once published", async () => {
    const faqs = collections.find((c) => c.key === "faqs")!;
    const values = prepareRecord(faqs, { doc: { key: "new-question", question: { ar: "سؤال جديد؟", en: "A new question?" }, answer: { ar: "إجابة.", en: "An answer." }, featured: false }, status: "draft" }, "create");
    const id = await as(db, admin, (tx) => insert(tx, "faqs", { ...values, sort_order: 999 }), true);
    const keys = async () => (await publicSnapshot()).faqs.map((f) => f.key);
    expect(await keys()).not.toContain("new-question");
    await as(db, admin, (tx) => update(tx, "faqs", { status: "published" }, "id = $2", [id]), true);
    expect(await keys()).toContain("new-question");
    await db.query(`delete from public.faqs where id = $1`, [id]);
  });

  it("someone who is not an administrator cannot save", async () => {
    const faqs = collections.find((c) => c.key === "faqs")!;
    const [row] = await rowsOf("faqs");
    const values = prepareRecord(faqs, { doc: { ...rowToDoc(faqs.fields, row), question: { ar: "x", en: "Hacked" } }, status: "published" }, "update");
    expect(await as(db, outsider, (tx) => update(tx, "faqs", values, "id = $2", [row.id]))).toBe(0);
    expect(await as(db, { role: "anon" }, (tx) => update(tx, "faqs", values, "id = $2", [row.id]).catch(() => -1))).toBeLessThanOrEqual(0);
  });

  it("reordering assigns spaced positions", () => {
    const ids = ["7a0c7f2e-2f4c-4a43-9d76-0a2c5f0d1e11", "0d9f6c1b-3c5e-4f2a-8b1d-9e8f7a6b5c4d"];
    expect(orderUpdates(ids)).toEqual([
      { id: ids[0], sort_order: 10 },
      { id: ids[1], sort_order: 20 },
    ]);
    expect(invalid(() => orderUpdates([ids[0], ids[0]]))).toEqual([""]);
    expect(invalid(() => orderUpdates(["1; drop table x"]))).toEqual([""]);
  });
});

describe("what the dashboard refuses", () => {
  const hero = () => structuredClone(snapshot.sections.find((s) => s.page_key === "home" && s.key === "hero")!.content) as Row;
  const heroSlots = () => {
    const id = snapshot.sections.find((s) => s.page_key === "home" && s.key === "hero")!.id;
    return Object.fromEntries(snapshot.sectionMedia.filter((m) => m.section_id === id).map((m) => [m.slot, { media_id: m.media_id, object_position: m.object_position, alt_ar: m.alt_ar, alt_en: m.alt_en }]));
  };

  it("script links in buttons", () => {
    const doc = hero();
    (doc.primaryCta as Row).href = "javascript:alert(1)";
    expect(invalid(() => prepareSection("home", "hero", { doc }))).toContain("primaryCta.href");
  });

  it("drops unknown keys, also inside buttons and title parts", () => {
    const doc = hero();
    doc.onClick = "alert(1)";
    (doc.primaryCta as Row).onclick = "alert(1)";
    ((doc.title as { en: Row[] }).en[0] as Row).html = "<img src=x onerror=alert(1)>";
    const { content } = prepareSection("home", "hero", { doc, slots: heroSlots() });
    expect(content).not.toHaveProperty("onClick");
    expect(content.primaryCta).not.toHaveProperty("onclick");
    expect((content.title as { en: Row[] }).en[0]).not.toHaveProperty("html");
  });

  it("removing a required image, unknown image slots and bad focal points", () => {
    expect(invalid(() => prepareSection("home", "hero", { doc: hero(), slots: { desktop: null } }))).toContain("slots.desktop");
    expect(invalid(() => prepareSection("home", "hero", { doc: hero(), slots: { banner: null } }))).toContain("slots");
    const slots = heroSlots();
    slots.desktop = { ...slots.desktop, object_position: "url(javascript:x)" };
    expect(invalid(() => prepareSection("home", "hero", { doc: hero(), slots }))).toContain("slots.desktop.object_position");
  });

  it("unknown sections, invalid statuses and changed identifiers", () => {
    expect(invalid(() => prepareSection("home", "admin", { doc: {} }))).toEqual([""]);
    const services = collections.find((c) => c.key === "services")!;
    const doc = rowToDoc(services.fields, snapshot.services[0] as unknown as Row);
    expect(invalid(() => prepareRecord(services, { doc, status: "live" as never }, "update"))).toContain("status");
    // On update the identifier is never written, so existing links keep working.
    expect(prepareRecord(services, { doc: { ...doc, slug: "renamed" }, status: "published" }, "update")).not.toHaveProperty("slug");
  });

  it("invalid settings, navigation, social links and interface text", () => {
    const settings = rowToDoc(settingsFields, snapshot.settings as unknown as Row);
    expect(invalid(() => prepareSettings({ ...settings, booking_href: "data:text/html,x" }))).toContain("booking_href");
    expect(invalid(() => prepareSettings({ ...settings, phone_digits: "+20 100" }))).toContain("phone_digits");
    expect(invalid(() => prepareNavigation([{ key: "Bad Key", doc: { label: { ar: "a", en: "b" }, href: "/", visible: true, show_in_header: true, show_in_footer: true } }]))).toContain("0.key");
    expect(invalid(() => prepareSocials([{ platform: "facebook", url: "http://facebook.com/x", visible: true }]))).toContain("0.url");
    expect(invalid(() => prepareSocials([{ platform: "myspace", url: "https://myspace.com/x", visible: true }]))).toContain("0.platform");
    expect(invalid(() => prepareUiStrings([{ key: "not.a.real.key", value_ar: "", value_en: "" }], new Set(["header.book"])))).toEqual(["not.a.real.key"]);
  });

  it("deleting a media file that is still in use", async () => {
    const used = (await db.query<{ media_id: string }>(`select media_id from public.media_usages limit 1`)).rows[0].media_id;
    expect(await failureOf(db, admin, (tx) => tx.query(`delete from public.media where id = $1`, [used]))).toMatch(/foreign key/);
  });

  it("every page of the site has its sections in the registry", () => {
    for (const page of cmsPages) for (const section of page.sections) expect(snapshot.sections.some((s) => s.page_key === page.key && s.key === section.key), `${page.key}.${section.key}`).toBe(true);
  });
});
