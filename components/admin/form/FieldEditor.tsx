"use client";

import { ArrowDown, ArrowUp, ChevronDown, Lock, Plus, Trash2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { emptyDoc, emptyValue, isActive, isSafeHref, type Field } from "@/lib/cms/fields";
import { ICON_NAMES } from "@/lib/cms/icons";
import { cmsPages } from "@/lib/cms/pages";
import type { L } from "@/lib/cms/types";
import type { IconName } from "@/types/content";
import { MediaField } from "../media/MediaField";
import { getIn, pathKey, useErrors, useFormApi, type Path } from "./FormContext";

type Lang = "ar" | "en";
const LANGS: Lang[] = ["ar", "en"];
const LANG_NAME: Record<Lang, string> = { ar: "Arabic", en: "English" };

const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const pairOf = <T,>(v: unknown, empty: T): L<T> => {
  const o = obj(v);
  return { ar: (o.ar as T) ?? empty, en: (o.en as T) ?? empty };
};

function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/* ---- Layout helpers ---------------------------------------------------------------- */

export function FieldShell({ label, help, required, errors, children, htmlFor }: { label: string; help?: string; required?: boolean; errors: string[]; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-2" data-field-error={errors.length ? "true" : undefined}>
      <div className="grid gap-0.5">
        <label htmlFor={htmlFor} className="adm-label">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
        {help && <p className="adm-help">{help}</p>}
      </div>
      {children}
      {errors.length > 0 && (
        <ul className="grid gap-0.5" role="alert">
          {[...new Set(errors)].map((error) => (
            <li key={error} className="text-xs font-medium text-red-700">
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LangTag({ lang, missing }: { lang: Lang; missing?: boolean }) {
  return (
    <span className={`adm-lang ${missing ? "adm-lang-missing" : ""}`}>
      {lang === "ar" ? "العربية" : "English"}
      {missing && <span className="ms-1 normal-case">· missing</span>}
    </span>
  );
}

/** Renders one editor per visible language, flagging a language that is empty while the other is filled. */
function Pair({ value, filled, render }: { value: L<unknown>; filled: (v: unknown) => boolean; render: (lang: Lang) => ReactNode }) {
  const { lang } = useFormApi();
  const visible = lang === "both" ? LANGS : [lang];
  const has = { ar: filled(value.ar), en: filled(value.en) };
  return (
    <div className={`grid gap-3 ${visible.length === 2 ? "md:grid-cols-2" : ""}`}>
      {visible.map((l) => (
        <div key={l} className="grid min-w-0 content-start gap-1.5" lang={l} dir={l === "ar" ? "rtl" : "ltr"}>
          <div dir="ltr" className="flex">
            <LangTag lang={l} missing={!has[l] && has[l === "ar" ? "en" : "ar"]} />
          </div>
          {render(l)}
        </div>
      ))}
    </div>
  );
}

const filledText = (v: unknown) => str(v).trim() !== "";
const filledList = (v: unknown) => arr(v).length > 0;

function RowButtons({ index, count, onMove, onRemove, label }: { index: number; count: number; onMove: (to: number) => void; onRemove: () => void; label: string }) {
  return (
    <div className="flex flex-none items-center gap-0.5" dir="ltr">
      <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" disabled={index === 0} onClick={() => onMove(index - 1)} aria-label={`Move ${label} up`}>
        <ArrowUp size={15} aria-hidden />
      </button>
      <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" disabled={index === count - 1} onClick={() => onMove(index + 1)} aria-label={`Move ${label} down`}>
        <ArrowDown size={15} aria-hidden />
      </button>
      <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon text-red-700" onClick={onRemove} aria-label={`Remove ${label}`}>
        <Trash2 size={15} aria-hidden />
      </button>
    </div>
  );
}

function AddButton({ onClick, children, disabled }: { onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="adm-btn adm-btn-secondary adm-btn-sm justify-self-start">
      <Plus size={14} aria-hidden /> {children}
    </button>
  );
}

/* ---- Plain inputs --------------------------------------------------------------------- */

function TextBox({
  value,
  onChange,
  multiline,
  rows,
  max,
  dir,
  lang,
  label,
  invalid,
  placeholder,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  max?: number;
  dir?: "rtl" | "ltr" | "auto";
  lang?: Lang;
  label: string;
  invalid?: boolean;
  placeholder?: string;
  id?: string;
}) {
  const props = {
    id,
    value,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    dir: dir ?? (lang === "ar" ? "rtl" : lang === "en" ? "ltr" : "auto"),
    lang,
    maxLength: max,
    placeholder,
    className: "adm-input",
    "aria-label": label,
    "aria-invalid": invalid || undefined,
  } as const;
  return (
    <div className="grid gap-1">
      {multiline ? <textarea rows={rows ?? 3} {...props} /> : <input type="text" {...props} />}
      {multiline && max ? (
        <span className={`text-end text-[0.7rem] ${value.length > max * 0.9 ? "text-amber-700" : "text-[#646c95]"}`} dir="ltr">
          {value.length} / {max}
        </span>
      ) : null}
    </div>
  );
}

function StringList({ items, onChange, lang, label, itemLabel, multiline, max }: { items: string[]; onChange: (items: string[]) => void; lang?: Lang; label: string; itemLabel: string; multiline?: boolean; max?: number }) {
  return (
    <div className="grid gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <div className="min-w-0 flex-1">
            <TextBox value={item} onChange={(v) => onChange(items.map((it, j) => (j === i ? v : it)))} lang={lang} multiline={multiline} rows={3} max={max} label={`${label}: ${itemLabel} ${i + 1}`} />
          </div>
          <RowButtons index={i} count={items.length} onMove={(to) => onChange(move(items, i, to))} onRemove={() => onChange(items.filter((_, j) => j !== i))} label={`${itemLabel} ${i + 1}`} />
        </div>
      ))}
      {items.length === 0 && <p className="adm-help">None yet.</p>}
      <AddButton onClick={() => onChange([...items, ""])}>Add {itemLabel.toLowerCase()}</AddButton>
    </div>
  );
}

/* ---- Icons ---------------------------------------------------------------------------------- */

export function IconPicker({ value, onChange, label, allowNone }: { value: string | undefined; onChange: (value: string | undefined) => void; label: string; allowNone?: boolean }) {
  const [open, setOpen] = useState(false);
  const current = (ICON_NAMES as readonly string[]).includes(value ?? "") ? (value as IconName) : null;
  return (
    <div className="grid gap-2" dir="ltr">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="adm-btn adm-btn-secondary justify-self-start" aria-label={`${label}: ${current ?? "none"}. Change icon`}>
        {current ? <Icon name={current} size={18} /> : <span className="text-xs text-muted">No icon</span>}
        <span className="font-mono text-xs text-muted">{current ?? ""}</span>
        <ChevronDown size={14} aria-hidden />
      </button>
      {open && (
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-line bg-white p-2" role="group" aria-label={label}>
          {allowNone && (
            <button
              type="button"
              aria-pressed={!current}
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className={`grid h-9 place-items-center rounded-lg px-2 text-xs ${!current ? "bg-brand-dark text-white" : "bg-[#f1f3fb] text-[#3a4472] hover:bg-[#e4e8f8]"}`}
            >
              None
            </button>
          )}
          {ICON_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              title={name}
              aria-label={name}
              aria-pressed={current === name}
              onClick={() => {
                onChange(name);
                setOpen(false);
              }}
              className={`grid h-9 w-9 place-items-center rounded-lg transition ${current === name ? "bg-brand-dark text-white" : "bg-[#f1f3fb] text-[#3a4472] hover:bg-[#e4e8f8]"}`}
            >
              <Icon name={name} size={17} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Links ---------------------------------------------------------------------------------- */

const SITE_LINKS = cmsPages.flatMap((page) => (page.path ? [page.path, ...page.sections.filter((s) => s.anchor).map((s) => `${page.path === "/" ? "/" : page.path}#${s.anchor}`)] : []));

function HrefInput({ value, onChange, label, invalid, id }: { value: string; onChange: (v: string) => void; label: string; invalid?: boolean; id?: string }) {
  const listId = useId();
  const warn = value !== "" && !isSafeHref(value);
  return (
    <div className="grid gap-1">
      <input id={id} type="text" dir="ltr" list={listId} value={value} onChange={(e) => onChange(e.target.value.trim())} className="adm-input font-mono text-[0.82rem]" aria-label={label} aria-invalid={invalid || warn || undefined} placeholder="/contact" />
      <datalist id={listId}>
        {SITE_LINKS.map((link) => (
          <option key={link} value={link} />
        ))}
      </datalist>
      {warn && <span className="text-xs text-red-700">Use a site path (/services), an #anchor, an https:// link, tel: or mailto:.</span>}
    </div>
  );
}

function CtaEditor({ field, path }: { field: Extract<Field, { type: "cta" }>; path: Path }) {
  const { doc, set } = useFormApi();
  const value = getIn(doc, path);
  const errors = useErrors(path);
  const enabled = value !== null && value !== undefined;
  const cta = obj(value);
  const label = pairOf(cta.label, "");
  const aria = cta.ariaLabel ? pairOf(cta.ariaLabel, "") : null;
  return (
    <FieldShell label={field.label} help={field.help} errors={errors}>
      <div className="adm-fieldset grid gap-3">
        {field.optional && (
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={enabled} onChange={(e) => set(path, e.target.checked ? { label: { ar: "", en: "" }, href: "/contact" } : null)} />
            Show this button
          </label>
        )}
        {enabled && (
          <>
            <Pair value={label} filled={filledText} render={(l) => <TextBox value={label[l]} onChange={(v) => set([...path, "label", l], v)} lang={l} max={80} label={`${field.label} label (${LANG_NAME[l]})`} />} />
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
              <div className="grid gap-1">
                <span className="adm-label">Link</span>
                <HrefInput value={str(cta.href)} onChange={(v) => set([...path, "href"], v)} label={`${field.label} link`} />
              </div>
              <label className="grid gap-1">
                <span className="adm-label">Icon</span>
                <select value={str(cta.icon)} onChange={(e) => set([...path, "icon"], e.target.value || undefined)} className="adm-input">
                  <option value="">Default</option>
                  <option value="arrow">Arrow</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Phone</option>
                </select>
              </label>
              <label className="flex min-h-[2.35rem] items-center gap-2 text-sm">
                <input type="checkbox" checked={cta.external === true} onChange={(e) => set([...path, "external"], e.target.checked || undefined)} />
                New tab
              </label>
            </div>
            <details className="text-sm" open={Boolean(aria)}>
              <summary className="font-medium text-muted">Accessible name (optional)</summary>
              <div className="mt-2 grid gap-2">
                <p className="adm-help">For screen readers, when the visible label alone is not descriptive (e.g. “Read more”).</p>
                {aria ? (
                  <>
                    <Pair value={aria} filled={filledText} render={(l) => <TextBox value={aria[l]} onChange={(v) => set([...path, "ariaLabel", l], v)} lang={l} max={160} label={`Accessible name (${LANG_NAME[l]})`} />} />
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm justify-self-start" onClick={() => set([...path, "ariaLabel"], undefined)}>
                      Remove accessible name
                    </button>
                  </>
                ) : (
                  <AddButton onClick={() => set([...path, "ariaLabel"], { ar: "", en: "" })}>Add accessible name</AddButton>
                )}
              </div>
            </details>
          </>
        )}
      </div>
    </FieldShell>
  );
}

function ActionEditor({ field, path }: { field: Extract<Field, { type: "action" }>; path: Path }) {
  const { doc, set } = useFormApi();
  const action = obj(getIn(doc, path));
  const errors = useErrors(path);
  const kind = action.kind === "whatsapp" ? "whatsapp" : "link";
  const label = pairOf(action.label, "");
  const message = pairOf(action.message, "");
  return (
    <FieldShell label={field.label} help={field.help} errors={errors}>
      <div className="adm-fieldset grid gap-3">
        <div className="flex flex-wrap gap-4 text-sm" role="radiogroup" aria-label={`${field.label}: action`}>
          {(["link", "whatsapp"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2">
              <input
                type="radio"
                checked={kind === k}
                onChange={() => set(path, k === "link" ? { kind: "link", label: action.label ?? { ar: "", en: "" }, href: "/contact" } : { kind: "whatsapp", label: action.label ?? { ar: "", en: "" }, message: { ar: "", en: "" } })}
              />
              {k === "link" ? "Link" : "WhatsApp chat (uses the WhatsApp number from Global settings)"}
            </label>
          ))}
        </div>
        <Pair value={label} filled={filledText} render={(l) => <TextBox value={label[l]} onChange={(v) => set([...path, "label", l], v)} lang={l} max={80} label={`${field.label} label (${LANG_NAME[l]})`} />} />
        {kind === "link" ? (
          <div className="grid gap-1">
            <span className="adm-label">Link</span>
            <HrefInput value={str(action.href)} onChange={(v) => set([...path, "href"], v)} label={`${field.label} link`} />
          </div>
        ) : (
          <div className="grid gap-1">
            <span className="adm-label">Pre-filled message</span>
            <Pair value={message} filled={filledText} render={(l) => <TextBox value={message[l]} onChange={(v) => set([...path, "message", l], v)} lang={l} multiline rows={2} max={500} label={`WhatsApp message (${LANG_NAME[l]})`} />} />
          </div>
        )}
      </div>
    </FieldShell>
  );
}

/* ---- Structured text ---------------------------------------------------------------------- */

type Part = { text: string; accent?: boolean; breakAfter?: boolean };

function TitleParts({ parts, onChange, lang, label }: { parts: Part[]; onChange: (parts: Part[]) => void; lang: Lang; label: string }) {
  const update = (i: number, patch: Partial<Part>) =>
    onChange(
      parts.map((part, j) => {
        if (j !== i) return part;
        const next: Part = { ...part, ...patch };
        if (!next.accent) delete next.accent;
        if (!next.breakAfter) delete next.breakAfter;
        return next;
      }),
    );
  return (
    <div className="grid gap-2">
      {parts.map((part, i) => (
        <div key={i} className="flex flex-wrap items-center gap-1.5 sm:flex-nowrap">
          <div className="min-w-0 flex-1">
            <TextBox value={part.text} onChange={(text) => update(i, { text })} lang={lang} max={200} label={`${label}: part ${i + 1}`} />
          </div>
          <div className="flex gap-1" dir="ltr">
            <button type="button" aria-pressed={part.accent === true} onClick={() => update(i, { accent: !part.accent })} className={`adm-btn adm-btn-sm ${part.accent ? "adm-btn-primary" : "adm-btn-secondary"}`} title="Show in the accent colour">
              Accent
            </button>
            <button type="button" aria-pressed={part.breakAfter === true} onClick={() => update(i, { breakAfter: !part.breakAfter })} className={`adm-btn adm-btn-sm ${part.breakAfter ? "adm-btn-primary" : "adm-btn-secondary"}`} title="Start a new line after this part (wide screens)">
              ↵ Break
            </button>
          </div>
          <RowButtons index={i} count={parts.length} onMove={(to) => onChange(move(parts, i, to))} onRemove={() => onChange(parts.filter((_, j) => j !== i))} label={`part ${i + 1}`} />
        </div>
      ))}
      <AddButton onClick={() => onChange([...parts, { text: "" }])}>Add part</AddButton>
      {parts.some((p) => p.text) && (
        <p className="rounded-lg bg-[#f4f6fc] px-3 py-2 text-base font-bold leading-snug" aria-label="Preview">
          {parts.map((part, i) => (
            <span key={i}>
              <span className={part.accent ? "text-[#4f60b8]" : "text-ink"}>{part.text}</span>
              {part.breakAfter ? <br /> : i < parts.length - 1 ? " " : null}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

type DetailSection = { title: string; icon?: string; paragraphs?: string[]; items?: string[] };
type Details = { lead: string; sections: DetailSection[] };

function DetailsEditor({ value, onChange, lang }: { value: Details; onChange: (v: Details) => void; lang: Lang }) {
  const sections = arr<DetailSection>(value.sections);
  const setSection = (i: number, patch: Partial<DetailSection>) =>
    onChange({
      ...value,
      sections: sections.map((s, j) => {
        if (j !== i) return s;
        const next = { ...s, ...patch } as DetailSection;
        for (const key of ["icon", "paragraphs", "items"] as const) if (next[key] === undefined || (Array.isArray(next[key]) && next[key]!.length === 0)) delete next[key];
        return next;
      }),
    });
  return (
    <div className="grid gap-3">
      <div className="grid gap-1">
        <span className="adm-label">Introduction</span>
        <TextBox value={str(value.lead)} onChange={(lead) => onChange({ ...value, lead })} lang={lang} multiline rows={3} max={1200} label="Introduction" />
      </div>
      {sections.map((section, i) => (
        <div key={i} className="grid gap-2 rounded-xl border border-line bg-white p-3">
          <div className="flex items-center gap-2">
            <span className="adm-label flex-1">Section {i + 1}</span>
            <RowButtons index={i} count={sections.length} onMove={(to) => onChange({ ...value, sections: move(sections, i, to) })} onRemove={() => onChange({ ...value, sections: sections.filter((_, j) => j !== i) })} label={`section ${i + 1}`} />
          </div>
          <TextBox value={section.title} onChange={(title) => setSection(i, { title })} lang={lang} max={160} label={`Section ${i + 1} title`} placeholder="Title" />
          <IconPicker value={section.icon} onChange={(icon) => setSection(i, { icon })} label={`Section ${i + 1} icon`} allowNone />
          <span className="adm-help">Paragraphs</span>
          <StringList items={arr<string>(section.paragraphs)} onChange={(paragraphs) => setSection(i, { paragraphs })} lang={lang} label={`Section ${i + 1}`} itemLabel="Paragraph" multiline max={1500} />
          <span className="adm-help">Bullet points</span>
          <StringList items={arr<string>(section.items)} onChange={(items) => setSection(i, { items })} lang={lang} label={`Section ${i + 1}`} itemLabel="Point" max={300} />
        </div>
      ))}
      <AddButton onClick={() => onChange({ ...value, sections: [...sections, { title: "" }] })}>Add section</AddButton>
    </div>
  );
}

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; tone: "tip" | "warning"; title: string; text: string };

const BLOCK_LABELS: Record<Block["type"], string> = { paragraph: "Paragraph", heading: "Heading", list: "List", callout: "Highlighted note" };

function convertBlock(block: Block, type: Block["type"]): Block {
  const text = block.type === "list" ? block.items.join("\n") : block.text;
  if (type === "list") return { type, items: text ? text.split("\n") : [""] };
  if (type === "callout") return { type, tone: "tip", title: block.type === "callout" ? block.title : "", text };
  return { type, text };
}

function BlocksEditor({ blocks, onChange, lang }: { blocks: Block[]; onChange: (b: Block[]) => void; lang: Lang }) {
  const update = (i: number, block: Block) => onChange(blocks.map((b, j) => (j === i ? block : b)));
  return (
    <div className="grid gap-3">
      {blocks.length === 0 && <p className="adm-help">No text yet — add a paragraph to start.</p>}
      {blocks.map((block, i) => (
        <div key={i} className="grid gap-2 rounded-xl border border-line bg-white p-3">
          <div className="flex flex-wrap items-center gap-2" dir="ltr">
            <select value={block.type} onChange={(e) => update(i, convertBlock(block, e.target.value as Block["type"]))} className="adm-input w-auto py-1 text-xs font-semibold" aria-label={`Block ${i + 1} type`}>
              {Object.entries(BLOCK_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {block.type === "list" && (
              <label className="flex items-center gap-1.5 text-xs">
                <input type="checkbox" checked={block.ordered === true} onChange={(e) => update(i, { ...block, ordered: e.target.checked || undefined })} /> Numbered
              </label>
            )}
            {block.type === "callout" && (
              <select value={block.tone} onChange={(e) => update(i, { ...block, tone: e.target.value as "tip" | "warning" })} className="adm-input w-auto py-1 text-xs" aria-label={`Block ${i + 1} tone`}>
                <option value="tip">Tip</option>
                <option value="warning">Warning</option>
              </select>
            )}
            <div className="ms-auto">
              <RowButtons index={i} count={blocks.length} onMove={(to) => onChange(move(blocks, i, to))} onRemove={() => onChange(blocks.filter((_, j) => j !== i))} label={`block ${i + 1}`} />
            </div>
          </div>
          {block.type === "list" ? (
            <StringList items={block.items} onChange={(items) => update(i, { ...block, items })} lang={lang} label={`Block ${i + 1}`} itemLabel="Item" max={600} />
          ) : block.type === "callout" ? (
            <>
              <TextBox value={block.title} onChange={(title) => update(i, { ...block, title })} lang={lang} max={160} label={`Block ${i + 1} title`} placeholder="Title" />
              <TextBox value={block.text} onChange={(text) => update(i, { ...block, text })} lang={lang} multiline rows={3} label={`Block ${i + 1} text`} />
            </>
          ) : (
            <TextBox value={block.text} onChange={(text) => update(i, { ...block, text })} lang={lang} multiline={block.type === "paragraph"} rows={4} label={`Block ${i + 1} ${BLOCK_LABELS[block.type]}`} />
          )}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(BLOCK_LABELS) as Block["type"][]).map((type) => (
          <AddButton key={type} onClick={() => onChange([...blocks, convertBlock({ type: "paragraph", text: "" }, type)])}>
            {BLOCK_LABELS[type]}
          </AddButton>
        ))}
      </div>
    </div>
  );
}

type HoursRow = { days: string; time: string };

function HoursEditor({ rows, onChange, lang }: { rows: HoursRow[]; onChange: (rows: HoursRow[]) => void; lang: Lang }) {
  return (
    <div className="grid gap-2">
      {rows.map((row, i) => (
        <div key={i} className="flex flex-wrap items-center gap-1.5 sm:flex-nowrap">
          <div className="min-w-0 flex-1">
            <TextBox value={row.days} onChange={(days) => onChange(rows.map((r, j) => (j === i ? { ...r, days } : r)))} lang={lang} max={80} label={`Row ${i + 1} days`} placeholder="Days" />
          </div>
          <div className="min-w-0 flex-1">
            <TextBox value={row.time} onChange={(time) => onChange(rows.map((r, j) => (j === i ? { ...r, time } : r)))} lang={lang} max={80} label={`Row ${i + 1} hours`} placeholder="Hours" />
          </div>
          <RowButtons index={i} count={rows.length} onMove={(to) => onChange(move(rows, i, to))} onRemove={() => onChange(rows.filter((_, j) => j !== i))} label={`row ${i + 1}`} />
        </div>
      ))}
      <AddButton onClick={() => onChange([...rows, { days: "", time: "" }])}>Add row</AddButton>
    </div>
  );
}

/* ---- Recursion ------------------------------------------------------------------------------ */

/** The fields of the object at `path`, skipping fields whose `when` condition is not met. */
export function FieldList({ fields, path }: { fields: Field[]; path: Path }) {
  const { doc } = useFormApi();
  const record = obj(getIn(doc, path));
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      {fields.map((field) => (isActive(field, record) ? <FieldEditor key={field.key} field={field} path={[...path, field.key]} siblings={fields} /> : null))}
    </div>
  );
}

function ListItem({ field, path, index, count, item, onMove, onRemove, startOpen }: { field: Extract<Field, { type: "list" }>; path: Path; index: number; count: number; item: Record<string, unknown>; onMove: (to: number) => void; onRemove: () => void; startOpen: boolean }) {
  const [open, setOpen] = useState(startOpen);
  const bodyId = useId();
  // Items with validation errors open themselves so the error is visible.
  const hasErrors = useErrors([...path, index]).length > 0;
  const expanded = open || hasErrors;
  let title = "";
  for (const key of ["title", "label", "name"]) {
    const v = obj(item[key]);
    title = str(v.en) || str(v.ar);
    if (title) break;
  }
  return (
    <div className="rounded-xl border border-line bg-[#fbfcff]">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <button type="button" aria-expanded={expanded} aria-controls={bodyId} onClick={() => setOpen(!expanded)} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-1 text-start text-sm font-semibold">
          <ChevronDown size={15} className={`flex-none transition ${expanded ? "" : "-rotate-90"}`} aria-hidden />
          <span className="truncate">
            {field.itemLabel} {index + 1}
            {title && <span className="font-normal text-muted"> · {title}</span>}
          </span>
        </button>
        <RowButtons index={index} count={count} onMove={onMove} onRemove={onRemove} label={`${field.itemLabel} ${index + 1}`} />
      </div>
      {expanded && (
        <div id={bodyId} className="border-t border-line p-3">
          <FieldList fields={field.fields} path={[...path, index]} />
        </div>
      )}
    </div>
  );
}

function ListEditor({ field, path }: { field: Extract<Field, { type: "list" }>; path: Path }) {
  const { doc, set } = useFormApi();
  const items = arr<Record<string, unknown>>(getIn(doc, path));
  const errors = useErrors(path, false);
  return (
    <FieldShell label={field.label} help={field.help} errors={errors}>
      <div className="grid grid-cols-1 gap-2">
        {items.map((item, i) => (
          <ListItem
            key={i}
            field={field}
            path={path}
            index={i}
            count={items.length}
            item={item}
            startOpen={items.length <= 2}
            onMove={(to) => set(path, move(items, i, to))}
            onRemove={() => set(path, items.filter((_, j) => j !== i))}
          />
        ))}
        {items.length === 0 && <p className="adm-help">None yet.</p>}
        <AddButton onClick={() => set(path, [...items, emptyDoc(field.fields)])} disabled={field.max !== undefined && items.length >= field.max}>
          Add {field.itemLabel.toLowerCase()}
          {field.max !== undefined && ` (max ${field.max})`}
        </AddButton>
      </div>
    </FieldShell>
  );
}

export function FieldEditor({ field, path, siblings }: { field: Field; path: Path; siblings?: Field[] }) {
  const { doc, set, references, locked } = useFormApi();
  const id = useId();
  const value = getIn(doc, path);
  const errors = useErrors(path, field.type !== "group" && field.type !== "list");
  const invalid = errors.length > 0;
  const shell = (children: ReactNode, htmlFor?: string) => (
    <FieldShell label={field.label} help={field.help} required={field.required} errors={errors} htmlFor={htmlFor}>
      {children}
    </FieldShell>
  );

  switch (field.type) {
    case "group":
      return (
        <fieldset className="adm-fieldset grid gap-4" data-field-error={invalid ? "true" : undefined}>
          <legend className="px-1 text-sm font-bold text-ink">{field.label}</legend>
          {field.help && <p className="adm-help -mt-2">{field.help}</p>}
          {errors.map((e) => (
            <p key={e} role="alert" className="text-xs font-medium text-red-700">
              {e}
            </p>
          ))}
          <FieldList fields={field.fields} path={path} />
        </fieldset>
      );
    case "list":
      return <ListEditor field={field} path={path} />;
    case "cta":
      return <CtaEditor field={field} path={path} />;
    case "action":
      return <ActionEditor field={field} path={path} />;
    case "text": {
      if (field.localized) {
        const pair = pairOf(value, "");
        return shell(
          <Pair
            value={pair}
            filled={filledText}
            render={(l) => <TextBox value={pair[l]} onChange={(v) => set([...path, l], v)} lang={l} multiline={field.multiline} rows={field.rows} max={field.max} placeholder={field.placeholder} label={`${field.label} (${LANG_NAME[l]})`} invalid={invalid} />}
          />,
        );
      }
      return shell(<TextBox id={id} value={str(value)} onChange={(v) => set(path, v)} multiline={field.multiline} rows={field.rows} max={field.max} dir={field.dir} label={field.label} invalid={invalid} placeholder={field.placeholder} />, id);
    }
    case "pattern":
      return shell(<TextBox id={id} value={str(value)} onChange={(v) => set(path, v.trim())} max={field.max} dir={field.dir ?? "ltr"} label={field.label} invalid={invalid} />, id);
    case "title": {
      const pair = pairOf<Part[]>(value, []);
      return shell(<Pair value={pair} filled={(v) => arr<Part>(v).some((p) => str(p?.text).trim())} render={(l) => <TitleParts parts={pair[l]} onChange={(parts) => set([...path, l], parts)} lang={l} label={`${field.label} (${LANG_NAME[l]})`} />} />);
    }
    case "stringList": {
      if (field.localized === false) return shell(<StringList items={arr<string>(value)} onChange={(v) => set(path, v)} label={field.label} itemLabel={field.itemLabel} multiline={field.multiline} max={field.max} />);
      const pair = pairOf<string[]>(value, []);
      return shell(<Pair value={pair} filled={filledList} render={(l) => <StringList items={pair[l]} onChange={(v) => set([...path, l], v)} lang={l} label={`${field.label} (${LANG_NAME[l]})`} itemLabel={field.itemLabel} multiline={field.multiline} max={field.max} />} />);
    }
    case "details": {
      const pair = pairOf<Details>(value, { lead: "", sections: [] });
      return shell(<Pair value={pair} filled={(v) => Boolean(str(obj(v).lead).trim() || arr(obj(v).sections).length)} render={(l) => <DetailsEditor value={pair[l]} onChange={(v) => set([...path, l], v)} lang={l} />} />);
    }
    case "blocks": {
      const pair = pairOf<Block[]>(value, []);
      return shell(<Pair value={pair} filled={filledList} render={(l) => <BlocksEditor blocks={pair[l]} onChange={(v) => set([...path, l], v)} lang={l} />} />);
    }
    case "hours": {
      const pair = pairOf<HoursRow[]>(value, []);
      return shell(<Pair value={pair} filled={filledList} render={(l) => <HoursEditor rows={pair[l]} onChange={(v) => set([...path, l], v)} lang={l} />} />);
    }
    case "icon":
      return shell(<IconPicker value={str(value)} onChange={(v) => set(path, v ?? "sparkles")} label={field.label} />);
    case "href":
      return shell(<HrefInput id={id} value={str(value)} onChange={(v) => set(path, v)} label={field.label} invalid={invalid} />, id);
    case "boolean":
      return (
        <div className="flex items-start justify-between gap-6" data-field-error={invalid ? "true" : undefined}>
          <div className="grid gap-0.5">
            <label htmlFor={id} className="adm-label">
              {field.label}
            </label>
            {field.help && <p className="adm-help">{field.help}</p>}
          </div>
          <button type="button" id={id} role="switch" aria-checked={value === true} onClick={() => set(path, value !== true)} className="adm-switch">
            <span />
          </button>
        </div>
      );
    case "number":
      return shell(
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={field.step ?? "any"}
          min={field.min}
          max={field.max}
          value={typeof value === "number" && Number.isFinite(value) ? value : ""}
          onChange={(e) => set(path, e.target.value === "" ? null : Number(e.target.value))}
          className="adm-input max-w-xs"
          dir="ltr"
          aria-invalid={invalid || undefined}
        />,
        id,
      );
    case "select":
      return shell(
        <select
          id={id}
          value={str(value)}
          onChange={(e) => {
            set(path, e.target.value);
            // Fill in fields that this choice reveals (e.g. a page's custom call-to-action).
            const parent = path.slice(0, -1);
            const record = { ...obj(getIn(doc, parent)), [field.key]: e.target.value };
            for (const sibling of siblings ?? []) {
              if (sibling.when?.key === field.key && isActive(sibling, record) && record[sibling.key] === undefined) set([...parent, sibling.key], emptyValue(sibling));
            }
          }}
          className="adm-input max-w-md"
          aria-invalid={invalid || undefined}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>,
        id,
      );
    case "date":
      return shell(<input id={id} type="date" value={str(value).slice(0, 10)} onChange={(e) => set(path, e.target.value)} className="adm-input max-w-xs" aria-invalid={invalid || undefined} />, id);
    case "slug": {
      const isLocked = locked.has(field.key);
      const suggestFrom = ["title", "name", "question", "label"].map((key) => str(obj(doc[key]).en)).find(Boolean) ?? "";
      const suggestion = suggestFrom
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
      return shell(
        <div className="flex flex-wrap items-center gap-2">
          <input
            id={id}
            type="text"
            dir="ltr"
            value={str(value)}
            disabled={isLocked}
            onChange={(e) => set(path, e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            className="adm-input max-w-sm font-mono text-[0.82rem]"
            aria-invalid={invalid || undefined}
          />
          {isLocked ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Lock size={13} aria-hidden /> Fixed
            </span>
          ) : (
            suggestion &&
            suggestion !== value && (
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => set(path, suggestion)}>
                Use “{suggestion}”
              </button>
            )
          )}
        </div>,
        id,
      );
    }
    case "media":
      return shell(<MediaField kind={field.kind} value={typeof value === "string" ? value : null} onChange={(v) => set(path, v)} required={field.required} label={field.label} invalid={invalid} />);
    case "reference": {
      const options = references[field.key] ?? [];
      return shell(
        <select id={id} value={str(value)} onChange={(e) => set(path, e.target.value || null)} className="adm-input max-w-md" aria-invalid={invalid || undefined}>
          <option value="">— None —</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>,
        id,
      );
    }
  }
}

export { pathKey };
