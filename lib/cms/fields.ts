/**
 * Field definitions: one declarative description of each editable shape,
 * used by the dashboard forms, by validation (in the browser and again on
 * the server), by the content explorer and by missing-translation checks.
 *
 * A "document" is what a form edits: plain JSON where every translated
 * value is `{ ar, en }`. Collections store documents as table columns
 * (`title` → `title_ar` / `title_en`, see docToRow / rowToDoc); sections
 * store them as-is in page_sections.content.
 */
import type { L } from "@/lib/cms/types";

export type Option = { value: string; label: string };

interface Base {
  key: string;
  label: string;
  help?: string;
  required?: boolean;
  /** Only shown (and validated, and saved) when another field of the same object has this value. */
  when?: { key: string; equals: unknown };
}

/** Whether a field applies, given the other values of its object. */
export function isActive(field: Field, siblings: Record<string, unknown>): boolean {
  return !field.when || siblings[field.when.key] === field.when.equals;
}

export type Field =
  /** Text; `localized` stores { ar, en }. */
  | (Base & { type: "text"; localized?: boolean; multiline?: boolean; rows?: number; max?: number; dir?: "ltr"; placeholder?: string })
  /** Heading split into parts (accent colour, line breaks), per language. */
  | (Base & { type: "title" })
  /** Lines of text (paragraphs, bullets), per language unless `localized: false`. */
  | (Base & { type: "stringList"; localized?: boolean; itemLabel: string; multiline?: boolean; max?: number })
  | (Base & { type: "icon" })
  /** A link: site path, #anchor, https URL, tel: or mailto:. */
  | (Base & { type: "href" })
  /** Button: label per language + destination (+ options). */
  | (Base & { type: "cta"; optional?: boolean })
  /** Link or WhatsApp button (call-to-action band). */
  | (Base & { type: "action" })
  | (Base & { type: "group"; fields: Field[] })
  | (Base & { type: "list"; itemLabel: string; fields: Field[]; min?: number; max?: number })
  | (Base & { type: "boolean" })
  | (Base & { type: "number"; min?: number; max?: number; step?: number })
  | (Base & { type: "select"; options: Option[] })
  | (Base & { type: "date" })
  /** URL-safe identifier; fixed once created so links never break. */
  | (Base & { type: "slug" })
  /** Detail-dialog text (lead + titled sections), per language. */
  | (Base & { type: "details" })
  /** Article body blocks, per language. */
  | (Base & { type: "blocks" })
  /** Opening hours rows, per language. */
  | (Base & { type: "hours" })
  /** A media library item (value: media id or null). */
  | (Base & { type: "media"; kind: "image" | "video" })
  /** Another record (value: its id). */
  | (Base & { type: "reference"; table: "services" | "article_categories" | "videos"; labelColumn: string })
  /** Free text matching a pattern (durations, YouTube ids, digits …). */
  | (Base & { type: "pattern"; pattern: string; patternHelp: string; max?: number; dir?: "ltr"; /** Stored as NULL when empty. */ nullable?: boolean });

export type FieldType = Field["type"];

export const LOCALES = ["ar", "en"] as const;

/** Field types whose stored value is `{ ar, en }`. */
export function isLocalized(field: Field): boolean {
  switch (field.type) {
    case "text":
    case "stringList":
      return field.localized !== false && (field.type === "stringList" || field.localized === true);
    case "title":
    case "details":
    case "blocks":
    case "hours":
      return true;
    default:
      return false;
  }
}

/* ---- Empty values ------------------------------------------------------ */

const pair = <T>(make: () => T): L<T> => ({ ar: make(), en: make() });

export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "text":
      return field.localized ? pair(() => "") : "";
    case "title":
      return pair((): unknown[] => []);
    case "stringList":
      return field.localized === false ? [] : pair((): string[] => []);
    case "icon":
      return "sparkles";
    case "href":
      return "/";
    case "cta":
      return field.optional ? null : { label: pair(() => ""), href: "/" };
    case "action":
      return { kind: "link", label: pair(() => ""), href: "/contact" };
    case "group":
      return emptyDoc(field.fields);
    case "list":
      return [];
    case "boolean":
      return false;
    case "number":
      return field.min ?? 0;
    case "select":
      return field.options[0]?.value ?? "";
    case "date":
      return new Date().toISOString().slice(0, 10);
    case "slug":
    case "pattern":
      return "";
    case "details":
      return pair(() => ({ lead: "", sections: [] }));
    case "blocks":
      return pair((): unknown[] => []);
    case "hours":
      return pair((): unknown[] => []);
    case "media":
    case "reference":
      return null;
  }
}

export function emptyDoc(fields: Field[]): Record<string, unknown> {
  return Object.fromEntries(fields.map((field) => [field.key, emptyValue(field)]));
}

/* ---- Link safety (same rules as public.is_safe_href in the database) ---- */

export function isSafeHref(value: unknown): value is string {
  if (typeof value !== "string" || !value || value.length > 2048) return false;
  if (/[\s\u0000-\u001f\u007f]/.test(value)) return false;
  return (
    (value.startsWith("/") && !value.startsWith("//")) ||
    /^#[A-Za-z0-9_-]*$/.test(value) ||
    /^https?:\/\/[^/\s]+/i.test(value) ||
    /^tel:\+?[0-9]{4,20}$/i.test(value) ||
    /^mailto:[^@\s]+@[^@\s]+$/i.test(value)
  );
}

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/* ---- Validation -------------------------------------------------------- */

export interface FieldError {
  /** Dotted path in the document, e.g. "primaryCta.href" or "points.2.title.en". */
  path: string;
  message: string;
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isL = (value: unknown): value is L<unknown> => isObject(value) && "ar" in value && "en" in value;
const text = (value: unknown) => (typeof value === "string" ? value : "");

/**
 * Validates a document against field definitions. Structural problems and
 * unsafe values are errors; a translation missing in one language is not
 * (see missingTranslations) — but a required field empty in both is.
 */
export function validateDoc(fields: Field[], doc: unknown, base = ""): FieldError[] {
  const errors: FieldError[] = [];
  const at = (key: string) => (base ? `${base}.${key}` : key);
  const record = isObject(doc) ? doc : {};
  for (const field of fields) {
    if (!isActive(field, record)) continue;
    errors.push(...validateField(field, record[field.key], at(field.key)));
  }
  return errors;
}

/**
 * The document with only known, active fields (groups and lists pruned
 * recursively) — what gets saved, so stale or injected keys never reach
 * the database.
 */
export function pruneDoc(fields: Field[], doc: unknown): Record<string, unknown> {
  const record = isObject(doc) ? doc : {};
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    if (!isActive(field, record)) continue;
    const value = record[field.key];
    if (field.type === "group") out[field.key] = pruneDoc(field.fields, value);
    else if (field.type === "list") out[field.key] = Array.isArray(value) ? value.map((item) => pruneDoc(field.fields, item)) : [];
    else if (value !== undefined) out[field.key] = cleanLeaf(field, value);
  }
  return out;
}

const pick = (value: Record<string, unknown>, keys: string[]) => Object.fromEntries(keys.filter((key) => value[key] !== undefined).map((key) => [key, value[key]]));
const mapL = (value: unknown, fn: (v: unknown) => unknown) => (isL(value) ? { ar: fn(value.ar), en: fn(value.en) } : value);
const mapItems = (value: unknown, fn: (item: Record<string, unknown>) => unknown) => (Array.isArray(value) ? value.map((item) => (isObject(item) ? fn(item) : item)) : value);
const pickL = (value: unknown) => (isL(value) ? pick(value as Record<string, unknown>, ["ar", "en"]) : value);

/** Keeps only the known keys inside structured values (buttons, title parts, blocks …). */
function cleanLeaf(field: Field, value: unknown): unknown {
  switch (field.type) {
    case "text":
    case "stringList":
      return isLocalized(field) ? pickL(value) : value;
    case "title":
      return mapL(value, (parts) => mapItems(parts, (part) => pick(part, ["text", "accent", "breakAfter"])));
    case "cta": {
      if (!isObject(value)) return value;
      const out = pick(value, ["label", "href", "external", "ariaLabel", "icon"]);
      if (out.label !== undefined) out.label = pickL(out.label);
      if (out.ariaLabel !== undefined) out.ariaLabel = pickL(out.ariaLabel);
      return out;
    }
    case "action": {
      if (!isObject(value)) return value;
      const out = pick(value, value.kind === "whatsapp" ? ["kind", "label", "message"] : ["kind", "label", "href"]);
      if (out.label !== undefined) out.label = pickL(out.label);
      if (out.message !== undefined) out.message = pickL(out.message);
      return out;
    }
    case "details":
      return mapL(value, (d) =>
        isObject(d) ? { ...pick(d, ["lead"]), sections: mapItems(d.sections, (section) => pick(section, ["title", "icon", "paragraphs", "items"])) } : d,
      );
    case "blocks":
      return mapL(value, (blocks) =>
        mapItems(blocks, (block) => pick(block, block.type === "list" ? ["type", "items", "ordered"] : block.type === "callout" ? ["type", "tone", "title", "text"] : ["type", "text"])),
      );
    case "hours":
      return mapL(value, (rows) => mapItems(rows, (row) => pick(row, ["days", "time"])));
    default:
      return value;
  }
}

function checkText(value: unknown, path: string, field: { max?: number; label: string }, errors: FieldError[]) {
  if (typeof value !== "string") {
    errors.push({ path, message: `${field.label}: expected text.` });
    return;
  }
  if (field.max && value.length > field.max) errors.push({ path, message: `${field.label}: at most ${field.max} characters.` });
}

export function validateField(field: Field, value: unknown, path: string): FieldError[] {
  const errors: FieldError[] = [];
  const fail = (message: string, where = path) => errors.push({ path: where, message: `${field.label}: ${message}` });

  switch (field.type) {
    case "text": {
      if (field.localized) {
        if (!isL(value)) return [{ path, message: `${field.label}: expected Arabic and English text.` }];
        checkText(value.ar, `${path}.ar`, field, errors);
        checkText(value.en, `${path}.en`, field, errors);
        if (field.required && !text(value.ar).trim() && !text(value.en).trim()) fail("required (in at least one language).");
      } else {
        checkText(value, path, field, errors);
        if (field.required && !text(value).trim()) fail("required.");
      }
      break;
    }
    case "pattern": {
      checkText(value, path, field, errors);
      const v = text(value);
      if (field.required && !v) fail("required.");
      if (v && !new RegExp(field.pattern).test(v)) fail(field.patternHelp);
      break;
    }
    case "title": {
      if (!isL(value)) return [{ path, message: `${field.label}: expected a title per language.` }];
      for (const locale of LOCALES) {
        const parts = value[locale];
        if (!Array.isArray(parts)) {
          fail("expected title parts.", `${path}.${locale}`);
          continue;
        }
        parts.forEach((part, i) => {
          if (!isObject(part) || typeof part.text !== "string") fail("each part needs text.", `${path}.${locale}.${i}`);
          else if ((part.accent !== undefined && typeof part.accent !== "boolean") || (part.breakAfter !== undefined && typeof part.breakAfter !== "boolean")) {
            fail("invalid part options.", `${path}.${locale}.${i}`);
          } else if (part.text.length > 200) fail("each part is limited to 200 characters.", `${path}.${locale}.${i}`);
        });
      }
      if (field.required && !hasText(value.ar) && !hasText(value.en)) fail("required (in at least one language).");
      break;
    }
    case "stringList": {
      const check = (list: unknown, where: string) => {
        if (!Array.isArray(list)) return fail("expected a list.", where);
        list.forEach((item, i) => checkText(item, `${where}.${i}`, field, errors));
      };
      if (field.localized === false) check(value, path);
      else if (isL(value)) {
        check(value.ar, `${path}.ar`);
        check(value.en, `${path}.en`);
      } else fail("expected a list per language.");
      break;
    }
    case "icon":
      if (typeof value !== "string" || !/^[a-zA-Z]{2,40}$/.test(value)) fail("choose an icon.");
      break;
    case "href":
      if (!isSafeHref(value)) fail("use a site path (/services), an #anchor, an https:// link, tel: or mailto:.");
      break;
    case "cta": {
      if (value === null && field.optional) break;
      if (!isObject(value)) return [{ path, message: `${field.label}: expected a button.` }];
      errors.push(...validateField({ type: "text", key: "label", label: `${field.label} label`, localized: true, max: 80 }, value.label, `${path}.label`));
      if (!isSafeHref(value.href)) fail("link: use a site path (/services), an #anchor, an https:// link, tel: or mailto:.", `${path}.href`);
      if (value.ariaLabel !== undefined) {
        errors.push(...validateField({ type: "text", key: "ariaLabel", label: `${field.label} accessible name`, localized: true, max: 160 }, value.ariaLabel, `${path}.ariaLabel`));
      }
      if (value.icon !== undefined && !["arrow", "whatsapp", "phone"].includes(String(value.icon))) fail("unknown button icon.", `${path}.icon`);
      break;
    }
    case "action": {
      if (!isObject(value)) return [{ path, message: `${field.label}: expected an action.` }];
      errors.push(...validateField({ type: "text", key: "label", label: `${field.label} label`, localized: true, max: 80, required: true }, value.label, `${path}.label`));
      if (value.kind === "link") {
        if (!isSafeHref(value.href)) fail("link: use a site path, an https:// link, tel: or mailto:.", `${path}.href`);
      } else if (value.kind === "whatsapp") {
        errors.push(...validateField({ type: "text", key: "message", label: `${field.label} message`, localized: true, max: 500 }, value.message, `${path}.message`));
      } else fail("choose a link or a WhatsApp chat.", `${path}.kind`);
      break;
    }
    case "group":
      errors.push(...validateDoc(field.fields, value, path));
      break;
    case "list": {
      if (!Array.isArray(value)) return [{ path, message: `${field.label}: expected a list.` }];
      if (field.min !== undefined && value.length < field.min) fail(`at least ${field.min} ${field.itemLabel.toLowerCase()}(s).`);
      if (field.max !== undefined && value.length > field.max) fail(`at most ${field.max} ${field.itemLabel.toLowerCase()}(s).`);
      value.forEach((item, i) => errors.push(...validateDoc(field.fields, item, `${path}.${i}`)));
      break;
    }
    case "boolean":
      if (typeof value !== "boolean") fail("expected yes or no.");
      break;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) fail("expected a number.");
      else {
        if (field.min !== undefined && value < field.min) fail(`at least ${field.min}.`);
        if (field.max !== undefined && value > field.max) fail(`at most ${field.max}.`);
      }
      break;
    case "select":
      if (!field.options.some((option) => option.value === value)) fail("choose one of the options.");
      break;
    case "date":
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail("expected a date.");
      break;
    case "slug":
      if (typeof value !== "string" || !SLUG_PATTERN.test(value)) fail("lowercase letters, digits and single hyphens (e.g. knee-pain).");
      break;
    case "details": {
      if (!isL(value)) return [{ path, message: `${field.label}: expected text per language.` }];
      for (const locale of LOCALES) {
        const d = value[locale];
        if (!isObject(d) || typeof d.lead !== "string" || !Array.isArray(d.sections)) fail("expected an introduction and sections.", `${path}.${locale}`);
        else
          d.sections.forEach((section, i) => {
            const where = `${path}.${locale}.sections.${i}`;
            if (!isObject(section) || typeof section.title !== "string") return fail("each section needs a title.", where);
            if (section.icon !== undefined && (typeof section.icon !== "string" || !/^[a-zA-Z]{2,40}$/.test(section.icon))) fail("invalid section icon.", where);
            for (const key of ["paragraphs", "items"] as const) {
              const list = section[key];
              if (list !== undefined && !(Array.isArray(list) && list.every((item) => typeof item === "string"))) fail(`section ${key} must be text lines.`, where);
            }
          });
      }
      break;
    }
    case "blocks": {
      if (!isL(value)) return [{ path, message: `${field.label}: expected blocks per language.` }];
      for (const locale of LOCALES) {
        const blocks = value[locale];
        if (!Array.isArray(blocks)) {
          fail("expected blocks.", `${path}.${locale}`);
          continue;
        }
        blocks.forEach((block, i) => {
          const where = `${path}.${locale}.${i}`;
          if (!isObject(block)) return fail("invalid block.", where);
          if ((block.type === "paragraph" || block.type === "heading") && typeof block.text === "string") return;
          if (block.type === "list" && Array.isArray(block.items) && block.items.every((item) => typeof item === "string") && (block.ordered === undefined || typeof block.ordered === "boolean")) return;
          if (block.type === "callout" && (block.tone === "tip" || block.tone === "warning") && typeof block.title === "string" && typeof block.text === "string") return;
          fail("invalid block.", where);
        });
      }
      break;
    }
    case "hours": {
      if (!isL(value)) return [{ path, message: `${field.label}: expected hours per language.` }];
      for (const locale of LOCALES) {
        const rows = value[locale];
        if (!Array.isArray(rows) || !rows.every((row) => isObject(row) && typeof row.days === "string" && typeof row.time === "string")) {
          fail("each row needs days and times.", `${path}.${locale}`);
        }
      }
      break;
    }
    case "media":
    case "reference":
      if (value !== null && (typeof value !== "string" || !/^[0-9a-f-]{36}$/.test(value))) fail("invalid selection.");
      if (field.required && !value) fail("required.");
      break;
  }
  return errors;
}

function hasText(parts: unknown): boolean {
  return Array.isArray(parts) && parts.some((part) => isObject(part) && typeof part.text === "string" && part.text.trim() !== "");
}

/* ---- Missing translations --------------------------------------------- */

export interface MissingTranslation {
  path: string;
  label: string;
  /** The language that is empty. */
  missing: "ar" | "en";
}

/** Localized values filled in one language but empty in the other. */
export function missingTranslations(fields: Field[], doc: unknown, base = "", labels: string[] = []): MissingTranslation[] {
  const out: MissingTranslation[] = [];
  const record = isObject(doc) ? doc : {};
  for (const field of fields) {
    if (!isActive(field, record)) continue;
    const value = record[field.key];
    const path = base ? `${base}.${field.key}` : field.key;
    const label = [...labels, field.label].join(" → ");
    const compare = (ar: boolean, en: boolean) => {
      if (ar && !en) out.push({ path, label, missing: "en" });
      if (en && !ar) out.push({ path, label, missing: "ar" });
    };
    switch (field.type) {
      case "text":
        if (field.localized && isL(value)) compare(text(value.ar).trim() !== "", text(value.en).trim() !== "");
        break;
      case "title":
        if (isL(value)) compare(hasText(value.ar), hasText(value.en));
        break;
      case "stringList":
        if (field.localized !== false && isL(value)) compare(nonEmptyList(value.ar), nonEmptyList(value.en));
        break;
      case "details":
        if (isL(value)) compare(detailsFilled(value.ar), detailsFilled(value.en));
        break;
      case "blocks":
      case "hours":
        if (isL(value)) compare(nonEmptyList(value.ar), nonEmptyList(value.en));
        break;
      case "cta":
        if (isObject(value)) {
          if (isL(value.label)) compare(text(value.label.ar).trim() !== "", text(value.label.en).trim() !== "");
        }
        break;
      case "action":
        if (isObject(value)) {
          if (isL(value.label)) compare(text(value.label.ar).trim() !== "", text(value.label.en).trim() !== "");
          if (value.kind === "whatsapp" && isL(value.message)) compare(text(value.message.ar).trim() !== "", text(value.message.en).trim() !== "");
        }
        break;
      case "group":
        out.push(...missingTranslations(field.fields, value, path, [...labels, field.label]));
        break;
      case "list":
        if (Array.isArray(value)) {
          value.forEach((item, i) => out.push(...missingTranslations(field.fields, item, `${path}.${i}`, [...labels, `${field.label} ${i + 1}`])));
        }
        break;
      default:
        break;
    }
  }
  return out;
}

const nonEmptyList = (value: unknown) => Array.isArray(value) && value.length > 0;
const detailsFilled = (value: unknown) => isObject(value) && ((typeof value.lead === "string" && value.lead.trim() !== "") || nonEmptyList(value.sections));

/* ---- Collections: document ⇄ table row --------------------------------- */

/** Column(s) a field is stored in. */
export function columnsOf(field: Field): string[] {
  return isLocalized(field) ? [`${field.key}_ar`, `${field.key}_en`] : [field.key];
}

export function rowToDoc(fields: Field[], row: Record<string, unknown>): Record<string, unknown> {
  const doc: Record<string, unknown> = {};
  for (const field of fields) {
    if (isLocalized(field)) doc[field.key] = { ar: row[`${field.key}_ar`] ?? emptyLocalized(field), en: row[`${field.key}_en`] ?? emptyLocalized(field) };
    else doc[field.key] = normalizeColumn(field, row[field.key]) ?? emptyValue(field);
  }
  return doc;
}

/** Numeric and date columns as the form expects them, whichever driver read them. */
function normalizeColumn(field: Field, value: unknown): unknown {
  if (field.type === "number" && typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  if (field.type === "date" && value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
}

function emptyLocalized(field: Field): unknown {
  return (emptyValue(field) as L<unknown>).ar;
}

export function docToRow(fields: Field[], doc: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const field of fields) {
    const value = doc[field.key];
    if (isLocalized(field)) {
      const pairValue = (isL(value) ? value : emptyValue(field)) as L<unknown>;
      row[`${field.key}_ar`] = pairValue.ar;
      row[`${field.key}_en`] = pairValue.en;
    } else if (field.type === "pattern" && field.nullable && (value === "" || value === undefined)) row[field.key] = null;
    else row[field.key] = value === undefined ? emptyValue(field) : value;
  }
  return row;
}

/* ---- Walking text for search ---------------------------------------- */

export interface TextEntry {
  path: string;
  label: string;
  ar: string;
  en: string;
}

/** Every translatable text value of a document, flattened (content explorer). */
export function textEntries(fields: Field[], doc: unknown, base = "", labels: string[] = []): TextEntry[] {
  const out: TextEntry[] = [];
  const record = isObject(doc) ? doc : {};
  for (const field of fields) {
    if (!isActive(field, record)) continue;
    const value = record[field.key];
    const path = base ? `${base}.${field.key}` : field.key;
    const label = [...labels, field.label].join(" → ");
    const join = (v: unknown): string => {
      if (typeof v === "string") return v;
      if (Array.isArray(v)) return v.map(join).filter(Boolean).join(" · ");
      if (isObject(v)) return Object.values(v).map(join).filter(Boolean).join(" · ");
      return "";
    };
    switch (field.type) {
      case "text":
      case "title":
      case "details":
      case "blocks":
      case "hours":
        if (isLocalized(field) && isL(value)) out.push({ path, label, ar: join(value.ar), en: join(value.en) });
        else if (typeof value === "string" && value) out.push({ path, label, ar: value, en: value });
        break;
      case "stringList":
        if (isL(value)) out.push({ path, label, ar: join(value.ar), en: join(value.en) });
        break;
      case "cta":
      case "action":
        if (isObject(value) && isL(value.label)) out.push({ path: `${path}.label`, label: `${label} (label)`, ar: join(value.label.ar), en: join(value.label.en) });
        if (isObject(value) && isL(value.message)) out.push({ path: `${path}.message`, label: `${label} (message)`, ar: join(value.message.ar), en: join(value.message.en) });
        break;
      case "group":
        out.push(...textEntries(field.fields, value, path, [...labels, field.label]));
        break;
      case "list":
        if (Array.isArray(value)) value.forEach((item, i) => out.push(...textEntries(field.fields, item, `${path}.${i}`, [...labels, `${field.label} ${i + 1}`])));
        break;
      default:
        break;
    }
  }
  return out;
}
