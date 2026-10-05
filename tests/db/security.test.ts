/**
 * Database security: Row Level Security, privileges, admin management,
 * storage policies and constraints — run against the real migration files
 * in an in-process Postgres (see harness.ts).
 */
import type { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { applyMigrations, as, createDatabase, createUser, failureOf, type Actor } from "./harness";

let db: PGlite;
let owner: Actor;
let editor: Actor;
let outsider: Actor;
let editorId: string;
let outsiderId: string;
const anon: Actor = { role: "anon" };

beforeAll(async () => {
  db = await createDatabase();
  const ownerId = await createUser(db, "owner@example.com");
  editorId = await createUser(db, "editor@example.com");
  outsiderId = await createUser(db, "visitor@example.com");
  await db.query(`insert into public.admins (user_id, email, role) values ($1, 'owner@example.com', 'owner'), ($2, 'editor@example.com', 'editor')`, [
    ownerId,
    editorId,
  ]);
  owner = { role: "authenticated", userId: ownerId };
  editor = { role: "authenticated", userId: editorId };
  outsider = { role: "authenticated", userId: outsiderId };

  // Content in every visibility state.
  await db.exec(`
    insert into public.site_settings (id, doctor_name_en) values (1, 'Dr. Test');
    insert into public.services (slug, icon, status, title_en) values
      ('published-service', 'bone', 'published', 'Visible'),
      ('draft-service', 'bone', 'draft', 'Hidden draft');
    insert into public.articles (slug, status, title_en) values
      ('published-article', 'published', 'Visible'),
      ('draft-article', 'draft', 'Hidden draft');
    insert into public.pages (key, path) values ('home', '/');
    insert into public.page_sections (page_key, key, type, visible) values
      ('home', 'hero', 'hero', true),
      ('home', 'secret', 'collectionHeading', false);
    insert into public.navigation_items (key, href, label_en, visible) values
      ('home', '/', 'Home', true),
      ('hidden', '/hidden', 'Hidden', false);
  `);
});

describe("migrations", () => {
  it("can be applied again without errors (idempotent)", async () => {
    await expect(applyMigrations(db)).resolves.toBeUndefined();
  });
});

describe("public visitors (anon)", () => {
  it("read published content only", async () => {
    const services = await as(db, anon, (tx) => tx.query<{ slug: string }>(`select slug from public.services order by slug`));
    expect(services.rows.map((r) => r.slug)).toEqual(["published-service"]);
    const articles = await as(db, anon, (tx) => tx.query<{ slug: string }>(`select slug from public.articles`));
    expect(articles.rows.map((r) => r.slug)).toEqual(["published-article"]);
    const nav = await as(db, anon, (tx) => tx.query<{ key: string }>(`select key from public.navigation_items`));
    expect(nav.rows.map((r) => r.key)).toEqual(["home"]);
  });

  it("get a snapshot without drafts or hidden sections", async () => {
    const { rows } = await as(db, anon, (tx) => tx.query<{ s: Record<string, unknown[]> }>(`select public.cms_snapshot() as s`));
    const snapshot = rows[0].s;
    expect((snapshot.services as { slug: string }[]).map((s) => s.slug)).toEqual(["published-service"]);
    expect((snapshot.articles as { slug: string }[]).map((s) => s.slug)).toEqual(["published-article"]);
    expect((snapshot.sections as { key: string }[]).map((s) => s.key)).toEqual(["hero"]);
    expect((snapshot.navigation as { key: string }[]).map((s) => s.key)).toEqual(["home"]);
  });

  it("cannot write content", async () => {
    expect(await failureOf(db, anon, (tx) => tx.query(`insert into public.services (slug, icon) values ('x', 'bone')`))).toMatch(/permission denied/);
    expect(await failureOf(db, anon, (tx) => tx.query(`update public.services set title_en = 'hacked'`))).toMatch(/permission denied/);
    expect(await failureOf(db, anon, (tx) => tx.query(`delete from public.services`))).toMatch(/permission denied/);
    expect(await failureOf(db, anon, (tx) => tx.query(`update public.site_settings set phone_digits = '201000000000'`))).toMatch(/permission denied/);
  });

  it("cannot see administrators", async () => {
    expect(await failureOf(db, anon, (tx) => tx.query(`select * from public.admins`))).toMatch(/permission denied/);
  });

  it("can send a contact message but never read the inbox", async () => {
    // Kept (persist) so the editor tests below have a message to manage.
    await as(
      db,
      anon,
      (tx) =>
        tx.query(
          `insert into public.contact_submissions (locale, name, phone, subject, message) values ('en', 'Jo Doe', '01012345678', 'Booking', 'Please call me back soon.')`,
        ),
      true,
    );
    expect(await failureOf(db, anon, (tx) => tx.query(`select * from public.contact_submissions`))).toMatch(/permission denied/);
  });

  it("cannot set a message's status or timestamp", async () => {
    const error = await failureOf(db, anon, (tx) =>
      tx.query(
        `insert into public.contact_submissions (locale, name, phone, subject, message, status) values ('en', 'Jo', '01012345678', 'x', 'Long enough message', 'read')`,
      ),
    );
    expect(error).toMatch(/permission denied/);
  });

  it("cannot upload, change or delete media files", async () => {
    expect(await failureOf(db, anon, (tx) => tx.query(`insert into storage.objects (bucket_id, name) values ('media', 'x.jpg')`))).toMatch(
      /row-level security/,
    );
  });
});

describe("signed-in users who are not administrators", () => {
  it("see only what visitors see", async () => {
    const { rows } = await as(db, outsider, (tx) => tx.query<{ slug: string }>(`select slug from public.services`));
    expect(rows.map((r) => r.slug)).toEqual(["published-service"]);
  });

  it("cannot write content or read the inbox", async () => {
    expect(await failureOf(db, outsider, (tx) => tx.query(`insert into public.services (slug, icon) values ('x', 'bone')`))).toMatch(
      /row-level security/,
    );
    const updated = await as(db, outsider, (tx) => tx.query(`update public.services set title_en = 'hacked' returning id`));
    expect(updated.rows).toHaveLength(0);
    const inbox = await as(db, outsider, (tx) => tx.query(`select * from public.contact_submissions`));
    expect(inbox.rows).toHaveLength(0);
  });

  it("cannot make themselves administrators", async () => {
    expect(
      await failureOf(db, outsider, (tx) => tx.query(`insert into public.admins (user_id, email, role) values ($1, 'visitor@example.com', 'owner')`, [outsiderId])),
    ).toMatch(/row-level security/);
    expect(await failureOf(db, outsider, (tx) => tx.query(`select public.admin_grant('visitor@example.com', 'owner')`))).toMatch(/Only owners/);
  });

  it("cannot upload media", async () => {
    expect(await failureOf(db, outsider, (tx) => tx.query(`insert into storage.objects (bucket_id, name) values ('media', 'x.jpg')`))).toMatch(
      /row-level security/,
    );
  });
});

describe("editors", () => {
  it("read drafts and hidden rows", async () => {
    const { rows } = await as(db, editor, (tx) => tx.query<{ slug: string }>(`select slug from public.services order by slug`));
    expect(rows.map((r) => r.slug)).toEqual(["draft-service", "published-service"]);
    const sections = await as(db, editor, (tx) => tx.query(`select key from public.page_sections`));
    expect(sections.rows).toHaveLength(2);
  });

  it("create, update and delete content", async () => {
    await as(db, editor, async (tx) => {
      await tx.query(`insert into public.faqs (key, question_en, answer_en) values ('new-faq', 'Q?', 'A.')`);
      const updated = await tx.query(`update public.faqs set answer_en = 'Changed.' where key = 'new-faq' returning id`);
      expect(updated.rows).toHaveLength(1);
      const deleted = await tx.query(`delete from public.faqs where key = 'new-faq' returning id`);
      expect(deleted.rows).toHaveLength(1);
    });
  });

  it("read and manage the inbox", async () => {
    const { rows } = await as(db, editor, (tx) => tx.query<{ status: string }>(`update public.contact_submissions set status = 'read' returning status`));
    expect(rows.length).toBeGreaterThan(0);
  });

  it("upload and delete media files", async () => {
    await as(db, editor, async (tx) => {
      await tx.query(`insert into storage.objects (bucket_id, name) values ('media', 'images/a.jpg')`);
      const deleted = await tx.query(`delete from storage.objects where name = 'images/a.jpg' returning id`);
      expect(deleted.rows).toHaveLength(1);
    });
  });

  it("cannot manage administrators", async () => {
    expect(await failureOf(db, editor, (tx) => tx.query(`select public.admin_grant('visitor@example.com', 'editor')`))).toMatch(/Only owners/);
    const removed = await as(db, editor, (tx) => tx.query(`delete from public.admins returning user_id`));
    expect(removed.rows).toHaveLength(0);
    const own = await as(db, editor, (tx) => tx.query<{ role: string }>(`select role from public.admins`));
    expect(own.rows).toEqual([{ role: "editor" }]);
  });
});

describe("owners", () => {
  it("grant and revoke access for existing users", async () => {
    await as(db, owner, async (tx) => {
      const granted = await tx.query<{ role: string }>(`select (public.admin_grant('visitor@example.com', 'editor')).role`);
      expect(granted.rows[0].role).toBe("editor");
      await tx.query(`select public.admin_revoke($1)`, [outsiderId]);
      const left = await tx.query(`select * from public.admins where user_id = $1`, [outsiderId]);
      expect(left.rows).toHaveLength(0);
    });
  });

  it("are told when the user does not exist", async () => {
    expect(await failureOf(db, owner, (tx) => tx.query(`select public.admin_grant('nobody@example.com', 'editor')`))).toMatch(/No Supabase Auth user/);
  });

  it("cannot remove or demote the last owner", async () => {
    const ownerId = (owner as { userId: string }).userId;
    expect(await failureOf(db, owner, (tx) => tx.query(`select public.admin_revoke($1)`, [ownerId]))).toMatch(/at least one owner/);
    expect(await failureOf(db, owner, (tx) => tx.query(`update public.admins set role = 'editor' where user_id = $1`, [ownerId]))).toMatch(
      /at least one owner/,
    );
  });
});

describe("constraints", () => {
  const service: Actor = { role: "service_role" };

  it("reject unsafe links", async () => {
    for (const href of ["javascript:alert(1)", "//evil.example", "data:text/html,x", "vbscript:x", "https://ok.example/ path"]) {
      expect(await failureOf(db, service, (tx) => tx.query(`insert into public.navigation_items (key, href) values ('bad', $1)`, [href]))).toMatch(
        /check constraint/,
      );
    }
    for (const href of ["/services", "/services#fractures", "#faq", "https://www.example.com/x", "tel:+201000000000", "mailto:a@b.co"]) {
      expect(await failureOf(db, service, (tx) => tx.query(`insert into public.navigation_items (key, href) values ('ok', $1)`, [href]))).toBeNull();
    }
  });

  it("reject malformed values", async () => {
    const bad = [
      `insert into public.services (slug, icon) values ('Bad Slug', 'bone')`,
      `insert into public.reviews (key, rating) values ('r', 6)`,
      `insert into public.stats (group_key, key, icon, value, count_of) values ('home', 's', 'bone', 5, 'services')`,
      `insert into public.stats (group_key, key, icon) values ('home', 's', 'bone')`,
      `insert into public.videos (slug, youtube_id) values ('v', 'not-an-id')`,
      `insert into public.videos (slug, duration) values ('v', '1:75')`,
      `update public.site_settings set phone_digits = '+20 100'`,
      `update public.site_settings set email = 'not-an-email'`,
      `insert into public.social_links (platform, url) values ('facebook', 'http://insecure.example')`,
      `insert into public.media (kind, bucket, path, mime_type) values ('image', 'media', '../escape.jpg', 'image/jpeg')`,
      `insert into public.page_sections (page_key, key, type, content) values ('home', 'x', 'hero', '[]')`,
    ];
    for (const statement of bad) {
      expect(await failureOf(db, service, (tx) => tx.query(statement)), statement).toMatch(/violates|invalid/);
    }
  });

  it("protect media that is still in use", async () => {
    await as(
      db,
      { role: "service_role" },
      async (tx) => {
        const media = await tx.query<{ id: string }>(
          `insert into public.media (kind, bucket, path, mime_type) values ('image', 'media', 'images/used.jpg', 'image/jpeg') returning id`,
        );
        await tx.query(`update public.services set image_id = $1 where slug = 'published-service'`, [media.rows[0].id]);
        const usage = await tx.query<{ source: string; record_key: string }>(`select source, record_key from public.media_usages where media_id = $1`, [
          media.rows[0].id,
        ]);
        expect(usage.rows).toEqual([{ source: "services", record_key: "published-service" }]);
        await expect(tx.query(`delete from public.media where id = $1`, [media.rows[0].id])).rejects.toThrow(/foreign key/);
      },
    );
  });
});
