/**
 * What every dashboard save goes through before it reaches the database:
 * the submitted document is pruned to the known fields, validated with the
 * same definitions the form uses, and turned into table columns. Nothing
 * here trusts the browser — unknown keys are dropped, identifiers cannot
 * be changed after creation and links are checked for safety. (The
 * database repeats the critical checks with constraints and RLS.)
 *
 * Pure functions, so they are unit-tested against the real schema.
 */
import { columnsOf, docToRow, isSafeHref, pruneDoc, validateDoc, type Field, type FieldError } from "@/lib/cms/fields";
import { sectionDef } from "@/lib/cms/pages";
import { navigationFields, pageSeoFields, sectionTypes, settingsFields, SOCIAL_PLATFORMS, type CollectionDef } from "@/lib/cms/registry";
import type { SectionType } from "@/lib/cms/section-docs";
import type { SlotValue } from "@/lib/cms/admin/types";

export class InvalidInput extends Error {
  constructor(readonly fieldErrors: FieldError[]) {
    super(fieldErrors[0]?.message ?? "Invalid input.");
  }
}

function checked(fields: Field[], input: unknown): Record<string, unknown> {
  const doc = pruneDoc(fields, input);
  const errors = validateDoc(fields, doc);
  if (errors.length) throw new InvalidInput(errors);
  return doc;
}

const isUuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

/* ---- Collections ------------------------------------------------------------ */

export interface RecordInput {
  doc: unknown;
  status?: "draft" | "published";
}

/**
 * Columns to write for a collection item. On update the identifier (slug /
 * key) is left out, so links to the item can never break.
 */
export function prepareRecord(def: CollectionDef, input: RecordInput, mode: "create" | "update"): Record<string, unknown> {
  const row = docToRow(def.fields, checked(def.fields, input.doc));
  if (def.hasStatus) {
    if (input.status !== "draft" && input.status !== "published") throw new InvalidInput([{ path: "status", message: "Choose draft or published." }]);
    row.status = input.status;
  }
  if (def.group) row[def.group.column] = def.group.value;
  if (mode === "update") delete row[def.naturalKey];
  return row;
}

/** Columns a collection's form may write (for the update guard). */
export function recordColumns(def: CollectionDef): string[] {
  return [...def.fields.flatMap(columnsOf), ...(def.hasStatus ? ["status"] : [])];
}

/* ---- Sections ---------------------------------------------------------------- */

export interface SectionInput {
  doc: unknown;
  /** Image slots: media + focal point + alt text for this use. null removes an optional image. */
  slots?: Record<string, SlotValue | null>;
  /** The video a video section shows. */
  videoId?: string | null;
}

export interface PreparedSection {
  content: Record<string, unknown>;
  upsertSlots: { slot: string; media_id: string; object_position: string | null; alt_ar: string | null; alt_en: string | null }[];
  deleteSlots: string[];
  /** undefined = the section has no video setting. */
  videoId?: string | null;
}

const POSITION = /^[a-z0-9%. -]{1,40}$/;

export function prepareSection(pageKey: string, sectionKey: string, input: SectionInput): PreparedSection {
  const section = sectionDef(pageKey, sectionKey);
  if (!section) throw new InvalidInput([{ path: "", message: "Unknown section." }]);
  const type = sectionTypes[section.type as SectionType];
  const content = checked(type.fields, input.doc);
  const errors: FieldError[] = [];
  const upsertSlots: PreparedSection["upsertSlots"] = [];
  const deleteSlots: string[] = [];

  for (const slot of type.slots ?? []) {
    const keys = slot.englishOverride ? [slot.key, `${slot.key}En`] : [slot.key];
    for (const key of keys) {
      const value = input.slots?.[key];
      const path = `slots.${key}`;
      if (value === undefined) continue; // unchanged
      if (value === null) {
        if (key === slot.key && slot.required) errors.push({ path, message: `${slot.label}: an image is required.` });
        else deleteSlots.push(key);
        continue;
      }
      if (!isUuid(value.media_id)) {
        errors.push({ path, message: `${slot.label}: choose an image.` });
        continue;
      }
      const position = value.object_position?.trim() || null;
      if (position && !POSITION.test(position)) errors.push({ path: `${path}.object_position`, message: `${slot.label}: focal point like "50% 30%" or "center top".` });
      const alt = (v: string | null | undefined) => (typeof v === "string" && v.trim() ? v.trim() : null);
      const altAr = alt(value.alt_ar);
      const altEn = alt(value.alt_en);
      if ((altAr?.length ?? 0) > 400 || (altEn?.length ?? 0) > 400) errors.push({ path, message: `${slot.label}: alt text is limited to 400 characters.` });
      upsertSlots.push({ slot: key, media_id: value.media_id, object_position: slot.position ? position : null, alt_ar: altAr, alt_en: altEn });
    }
  }
  const unknown = Object.keys(input.slots ?? {}).filter((key) => !(type.slots ?? []).some((slot) => key === slot.key || (slot.englishOverride && key === `${slot.key}En`)));
  if (unknown.length) errors.push({ path: "slots", message: `Unknown image slot(s): ${unknown.join(", ")}.` });

  let videoId: string | null | undefined;
  if (type.video) {
    if (input.videoId !== null && input.videoId !== undefined && !isUuid(input.videoId)) errors.push({ path: "video", message: "Choose a video." });
    else videoId = input.videoId ?? null;
  }
  if (errors.length) throw new InvalidInput(errors);
  return { content, upsertSlots, deleteSlots, videoId };
}

/* ---- Settings, SEO, navigation, social links, interface text ----------------- */

export function prepareSettings(doc: unknown): Record<string, unknown> {
  return docToRow(settingsFields, checked(settingsFields, doc));
}

export function preparePageSeo(doc: unknown): Record<string, unknown> {
  return docToRow(pageSeoFields, checked(pageSeoFields, doc));
}

const NAV_KEY = /^[a-z][a-z0-9-]*$/;

export interface NavInput {
  id?: string;
  key: string;
  doc: unknown;
}

/** The full navigation list, in order. Keys are fixed for existing items. */
export function prepareNavigation(items: NavInput[]): { id?: string; key: string; row: Record<string, unknown> }[] {
  const errors: FieldError[] = [];
  const keys = new Set<string>();
  const out = items.map((item, i) => {
    if (!NAV_KEY.test(item.key)) errors.push({ path: `${i}.key`, message: `Item ${i + 1}: identifier must be lowercase letters, digits and hyphens.` });
    if (keys.has(item.key)) errors.push({ path: `${i}.key`, message: `Item ${i + 1}: identifier “${item.key}” is used twice.` });
    keys.add(item.key);
    const doc = pruneDoc(navigationFields, item.doc);
    for (const error of validateDoc(navigationFields, doc, String(i))) errors.push({ ...error, message: `Item ${i + 1}: ${error.message}` });
    if (item.id !== undefined && !isUuid(item.id)) errors.push({ path: `${i}`, message: `Item ${i + 1}: invalid id.` });
    return { id: item.id, key: item.key, row: { ...docToRow(navigationFields, doc), sort_order: (i + 1) * 10 } };
  });
  if (errors.length) throw new InvalidInput(errors);
  return out;
}

export interface SocialInput {
  platform: string;
  url: string;
  visible: boolean;
}

export function prepareSocials(items: SocialInput[]): Record<string, unknown>[] {
  const errors: FieldError[] = [];
  const seen = new Set<string>();
  const rows = items.map((item, i) => {
    if (!SOCIAL_PLATFORMS.some((p) => p.value === item.platform)) errors.push({ path: `${i}.platform`, message: `Link ${i + 1}: choose a platform.` });
    else if (seen.has(item.platform)) errors.push({ path: `${i}.platform`, message: `Link ${i + 1}: each platform can be listed once.` });
    seen.add(item.platform);
    const url = typeof item.url === "string" ? item.url.trim() : "";
    if (!/^https:\/\/[^/\s]+/i.test(url) || !isSafeHref(url)) errors.push({ path: `${i}.url`, message: `Link ${i + 1}: use the full https:// address of the profile.` });
    return { platform: item.platform, url, visible: item.visible === true, sort_order: (i + 1) * 10 };
  });
  if (errors.length) throw new InvalidInput(errors);
  return rows;
}

export interface UiStringInput {
  key: string;
  value_ar: string;
  value_en: string;
}

/** Only keys the website uses can be saved; an empty value means "use the default". */
export function prepareUiStrings(items: UiStringInput[], knownKeys: Set<string>): UiStringInput[] {
  const errors: FieldError[] = [];
  const rows = items.map((item) => {
    if (!knownKeys.has(item.key)) errors.push({ path: item.key, message: `Unknown interface text “${item.key}”.` });
    const value_ar = typeof item.value_ar === "string" ? item.value_ar : "";
    const value_en = typeof item.value_en === "string" ? item.value_en : "";
    if (value_ar.length > 600 || value_en.length > 600) errors.push({ path: item.key, message: `“${item.key}”: at most 600 characters.` });
    return { key: item.key, value_ar, value_en };
  });
  if (errors.length) throw new InvalidInput(errors);
  return rows;
}

/* ---- Reordering ---------------------------------------------------------------- */

/** sort_order values for ids in their new order (gaps of 10 leave room for inserts). */
export function orderUpdates(ids: unknown): { id: string; sort_order: number }[] {
  if (!Array.isArray(ids) || !ids.every(isUuid) || new Set(ids).size !== ids.length) throw new InvalidInput([{ path: "", message: "Invalid order." }]);
  return ids.map((id, i) => ({ id, sort_order: (i + 1) * 10 }));
}
