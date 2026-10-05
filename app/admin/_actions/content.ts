"use server";

import { getDictionary } from "@/i18n/dictionaries";
import {
  orderUpdates,
  prepareNavigation,
  preparePageSeo,
  prepareRecord,
  prepareSection,
  prepareSettings,
  prepareSocials,
  prepareUiStrings,
  type NavInput,
  type RecordInput,
  type SectionInput,
  type SocialInput,
  type UiStringInput,
} from "@/lib/cms/admin/mutations";
import { ActionError, check, requireAdmin, requireOwner, revalidateSite, run } from "@/lib/cms/admin/session";
import type { ActionResult } from "@/lib/cms/admin/types";
import { buildBundledSnapshot } from "@/lib/cms/bundled";
import { importPlan } from "@/lib/cms/import-plan";
import { pageDef, sectionDef } from "@/lib/cms/pages";
import { collectionDef, type CollectionDef } from "@/lib/cms/registry";
import { flattenDictionary } from "@/lib/cms/ui-strings";

/*
 * Every action re-checks the administrator on the server (requireAdmin),
 * validates the input with the shared field definitions (mutations.ts) and
 * writes with the administrator's own session, so Row Level Security has
 * the final word. Public pages are rebuilt after each successful change.
 */

function collection(key: string): CollectionDef {
  const def = collectionDef(key);
  if (!def) throw new ActionError("Unknown collection.");
  return def;
}

/* ---- Collections ---------------------------------------------------------------- */

export async function saveRecord(collectionKey: string, id: string | null, input: RecordInput): Promise<ActionResult<{ id: string }>> {
  return run(async () => {
    const def = collection(collectionKey);
    const { supabase } = await requireAdmin();
    if (id === null) {
      const row = prepareRecord(def, input, "create");
      let last = supabase.from(def.table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
      if (def.group) last = last.eq(def.group.column, def.group.value);
      const [top] = check(await last) as { sort_order: number }[];
      row.sort_order = (top?.sort_order ?? 0) + 10;
      const created = check(await supabase.from(def.table).insert(row).select("id").single()) as { id: string };
      revalidateSite();
      return { id: created.id };
    }
    const row = prepareRecord(def, input, "update");
    let query = supabase.from(def.table).update(row).eq("id", id);
    if (def.group) query = query.eq(def.group.column, def.group.value);
    const updated = check(await query.select("id")) as { id: string }[];
    if (!updated.length) throw new ActionError("This item no longer exists — it may have been deleted in another window.");
    revalidateSite();
    return { id };
  });
}

export async function setRecordStatus(collectionKey: string, id: string, status: "draft" | "published"): Promise<ActionResult<undefined>> {
  return run(async () => {
    const def = collection(collectionKey);
    if (!def.hasStatus || (status !== "draft" && status !== "published")) throw new ActionError("This item has no publication status.");
    const { supabase } = await requireAdmin();
    const updated = check(await supabase.from(def.table).update({ status }).eq("id", id).select("id")) as unknown[];
    if (!updated.length) throw new ActionError("This item no longer exists.");
    revalidateSite();
    return undefined;
  });
}

export async function deleteRecord(collectionKey: string, id: string): Promise<ActionResult<undefined>> {
  return run(async () => {
    const def = collection(collectionKey);
    const { supabase } = await requireAdmin();
    let query = supabase.from(def.table).delete().eq("id", id);
    if (def.group) query = query.eq(def.group.column, def.group.value);
    const deleted = check(await query.select("id")) as unknown[];
    if (!deleted.length) throw new ActionError("This item no longer exists.");
    revalidateSite();
    return undefined;
  });
}

export async function reorderRecords(collectionKey: string, ids: string[]): Promise<ActionResult<undefined>> {
  return run(async () => {
    const def = collection(collectionKey);
    const { supabase } = await requireAdmin();
    const updates = orderUpdates(ids);
    const results = await Promise.all(
      updates.map(({ id, sort_order }) => {
        let query = supabase.from(def.table).update({ sort_order }).eq("id", id);
        if (def.group) query = query.eq(def.group.column, def.group.value);
        return query;
      }),
    );
    for (const result of results) check(result);
    revalidateSite();
    return undefined;
  });
}

/* ---- Page sections ---------------------------------------------------------------- */

export async function saveSection(pageKey: string, sectionKey: string, input: SectionInput): Promise<ActionResult<undefined>> {
  return run(async () => {
    const prepared = prepareSection(pageKey, sectionKey, input);
    const def = sectionDef(pageKey, sectionKey)!;
    const { supabase } = await requireAdmin();
    const values: Record<string, unknown> = { content: prepared.content };
    if (prepared.videoId !== undefined) values.video_id = prepared.videoId;

    const existing = check(await supabase.from("page_sections").select("id").eq("page_key", pageKey).eq("key", sectionKey).maybeSingle()) as { id: string } | null;
    let sectionId = existing?.id;
    if (sectionId) {
      check(await supabase.from("page_sections").update(values).eq("id", sectionId));
    } else {
      // A section added to the site after the content was imported.
      const created = check(
        await supabase
          .from("page_sections")
          .insert({ page_key: pageKey, key: sectionKey, type: def.type, sort_order: 1000, visible: true, ...values })
          .select("id")
          .single(),
      ) as { id: string };
      sectionId = created.id;
    }
    if (prepared.upsertSlots.length) {
      check(
        await supabase.from("section_media").upsert(
          prepared.upsertSlots.map((slot) => ({ section_id: sectionId, ...slot })),
          { onConflict: "section_id,slot" },
        ),
      );
    }
    if (prepared.deleteSlots.length) check(await supabase.from("section_media").delete().eq("section_id", sectionId).in("slot", prepared.deleteSlots));
    revalidateSite();
    return undefined;
  });
}

export async function setSectionVisible(pageKey: string, sectionKey: string, visible: boolean): Promise<ActionResult<undefined>> {
  return run(async () => {
    const def = sectionDef(pageKey, sectionKey);
    if (!def) throw new ActionError("Unknown section.");
    if (def.required || def.copyOnly) throw new ActionError("This section cannot be hidden.");
    const { supabase } = await requireAdmin();
    const updated = check(await supabase.from("page_sections").update({ visible: visible === true }).eq("page_key", pageKey).eq("key", sectionKey).select("id")) as unknown[];
    if (!updated.length) throw new ActionError("This section is not in the database yet — save it once first.");
    revalidateSite();
    return undefined;
  });
}

export async function reorderSections(pageKey: string, keys: string[]): Promise<ActionResult<undefined>> {
  return run(async () => {
    const page = pageDef(pageKey);
    if (!page) throw new ActionError("Unknown page.");
    const movable = page.sections.filter((s) => !s.copyOnly && !s.pinned).map((s) => s.key);
    if (!Array.isArray(keys) || keys.length !== movable.length || [...keys].sort().join() !== [...movable].sort().join()) throw new ActionError("Invalid order.");
    const { supabase } = await requireAdmin();
    const pinned = page.sections.filter((s) => s.pinned).map((s) => s.key);
    const ordered = [...pinned, ...keys];
    const results = await Promise.all(ordered.map((key, i) => supabase.from("page_sections").update({ sort_order: (i + 1) * 10 }).eq("page_key", pageKey).eq("key", key)));
    for (const result of results) check(result);
    revalidateSite();
    return undefined;
  });
}

/* ---- SEO, settings, navigation, social links, interface text ------------------ */

export async function savePageSeo(pageKey: string, doc: unknown): Promise<ActionResult<undefined>> {
  return run(async () => {
    const page = pageDef(pageKey);
    if (!page?.path) throw new ActionError("Unknown page.");
    const row = preparePageSeo(doc);
    const { supabase } = await requireAdmin();
    check(await supabase.from("pages").upsert({ key: pageKey, path: page.path, ...row }, { onConflict: "key" }));
    revalidateSite();
    return undefined;
  });
}

export async function saveSettings(doc: unknown): Promise<ActionResult<undefined>> {
  return run(async () => {
    const row = prepareSettings(doc);
    const { supabase } = await requireAdmin();
    check(await supabase.from("site_settings").upsert({ id: 1, ...row }, { onConflict: "id" }));
    revalidateSite();
    return undefined;
  });
}

export async function saveNavigation(items: NavInput[]): Promise<ActionResult<undefined>> {
  return run(async () => {
    const prepared = prepareNavigation(items);
    const { supabase } = await requireAdmin();
    const existing = check(await supabase.from("navigation_items").select("id, key")) as { id: string; key: string }[];
    const keep = new Set(prepared.filter((item) => item.id).map((item) => item.id));
    const removed = existing.filter((row) => !keep.has(row.id)).map((row) => row.id);
    if (removed.length) check(await supabase.from("navigation_items").delete().in("id", removed));
    for (const item of prepared) {
      const current = item.id ? existing.find((row) => row.id === item.id) : undefined;
      if (item.id && !current) throw new ActionError("A menu item was deleted in another window. Reload the page.");
      // Identifiers of existing items never change (the header picks its icon by key).
      if (current) check(await supabase.from("navigation_items").update(item.row).eq("id", current.id));
      else check(await supabase.from("navigation_items").insert({ key: item.key, ...item.row }));
    }
    revalidateSite();
    return undefined;
  });
}

export async function saveSocials(items: SocialInput[]): Promise<ActionResult<undefined>> {
  return run(async () => {
    const rows = prepareSocials(items);
    const { supabase } = await requireAdmin();
    const platforms = rows.map((row) => String(row.platform));
    const stale = check(await supabase.from("social_links").select("platform")) as { platform: string }[];
    const removed = stale.map((row) => row.platform).filter((p) => !platforms.includes(p));
    if (removed.length) check(await supabase.from("social_links").delete().in("platform", removed));
    if (rows.length) check(await supabase.from("social_links").upsert(rows, { onConflict: "platform" }));
    revalidateSite();
    return undefined;
  });
}

export async function saveUiStrings(items: UiStringInput[]): Promise<ActionResult<undefined>> {
  return run(async () => {
    const known = new Set([...Object.keys(flattenDictionary(getDictionary("ar"))), ...Object.keys(flattenDictionary(getDictionary("en")))]);
    const rows = prepareUiStrings(items, known);
    const { supabase } = await requireAdmin();
    if (rows.length) check(await supabase.from("ui_strings").upsert(rows, { onConflict: "key" }));
    revalidateSite();
    return undefined;
  });
}

/* ---- First import -------------------------------------------------------------- */

/**
 * Copies the website's current content (bundled in the code) into the
 * database. Existing rows are never touched (insert … on conflict do
 * nothing), so running it again only fills in what is missing.
 */
export async function importBundledContent(): Promise<ActionResult<{ inserted: number }>> {
  return run(async () => {
    const { supabase } = await requireOwner();
    let inserted = 0;
    for (const step of importPlan(buildBundledSnapshot())) {
      for (let i = 0; i < step.rows.length; i += 200) {
        const result = await supabase
          .from(step.table)
          .upsert(step.rows.slice(i, i + 200), { onConflict: step.onConflict, ignoreDuplicates: true, defaultToNull: false, count: "exact" });
        if (result.error) throw result.error;
        inserted += result.count ?? 0;
      }
    }
    revalidateSite();
    return { inserted };
  });
}
