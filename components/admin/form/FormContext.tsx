"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { MediaItem, MediaMap, ReferenceOptions } from "@/lib/cms/admin/types";
import type { FieldError } from "@/lib/cms/fields";

export type Path = (string | number)[];
export type LangView = "both" | "ar" | "en";

export function getIn(value: unknown, path: Path): unknown {
  let node = value;
  for (const key of path) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string | number, unknown>)[key];
  }
  return node;
}

/** Immutable update of a nested value. */
export function setIn<T>(value: T, path: Path, next: unknown): T {
  if (!path.length) return next as T;
  const [key, ...rest] = path;
  if (Array.isArray(value)) {
    const copy = [...value];
    copy[key as number] = setIn(copy[key as number], rest, next);
    return copy as T;
  }
  const record = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  return { ...record, [key]: setIn(record[key as string], rest, next) } as T;
}

export const pathKey = (path: Path) => path.join(".");

interface FormApi {
  doc: Record<string, unknown>;
  set: (path: Path, value: unknown) => void;
  lang: LangView;
  setLang: (lang: LangView) => void;
  errors: FieldError[];
  media: MediaMap;
  rememberMedia: (item: MediaItem) => void;
  references: ReferenceOptions;
  /** Fields that cannot change any more (identifiers of saved items). */
  locked: Set<string>;
}

const FormContext = createContext<FormApi | null>(null);

export function useFormApi(): FormApi {
  const api = useContext(FormContext);
  if (!api) throw new Error("Field editors must be inside <FormProvider>.");
  return api;
}

/** Errors at exactly this path, or (for leaf editors) anywhere below it. */
export function useErrors(path: Path, below = true): string[] {
  const { errors } = useFormApi();
  const key = pathKey(path);
  return errors.filter((e) => e.path === key || (below && e.path.startsWith(`${key}.`))).map((e) => e.message);
}

export function FormProvider({
  doc,
  onChange,
  errors,
  media: initialMedia,
  references = {},
  locked = [],
  children,
}: {
  doc: Record<string, unknown>;
  onChange: (updater: (doc: Record<string, unknown>) => Record<string, unknown>) => void;
  errors: FieldError[];
  media: MediaMap;
  references?: ReferenceOptions;
  locked?: string[];
  children: ReactNode;
}) {
  const [lang, setLang] = useState<LangView>("both");
  const [media, setMedia] = useState<MediaMap>(initialMedia);
  const set = useCallback((path: Path, value: unknown) => onChange((current) => setIn(current, path, value)), [onChange]);
  const rememberMedia = useCallback((item: MediaItem) => setMedia((map) => ({ ...map, [item.id]: item })), []);
  const lockedSet = useMemo(() => new Set(locked), [locked]);
  return (
    <FormContext.Provider value={{ doc, set, lang, setLang, errors, media, rememberMedia, references, locked: lockedSet }}>{children}</FormContext.Provider>
  );
}

/** Arabic + English | Arabic | English switch for the whole form. */
export function LangSwitch() {
  const { lang, setLang } = useFormApi();
  const options: { value: LangView; label: string }[] = [
    { value: "both", label: "Arabic + English" },
    { value: "ar", label: "العربية" },
    { value: "en", label: "English" },
  ];
  return (
    <div role="tablist" aria-label="Languages shown" className="inline-flex rounded-xl bg-[#eceffa] p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={lang === option.value}
          onClick={() => setLang(option.value)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${lang === option.value ? "bg-white text-brand-dark shadow-sm" : "text-[#4a5384] hover:text-ink"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Focuses the first field with an error after a failed save. */
export function focusFirstError() {
  requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>("[data-field-error='true']");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.querySelector<HTMLElement>("input, textarea, select, button")?.focus({ preventScroll: true });
  });
}
