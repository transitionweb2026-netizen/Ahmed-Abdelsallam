"use client";

import { Pencil, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import type { ContentEntry, EntryArea } from "@/lib/cms/admin/explorer";
import { StatusBadge } from "./Feedback";

const AREAS: Record<EntryArea, string> = {
  section: "Page sections",
  item: "Collection items",
  settings: "Global settings",
  seo: "SEO",
  navigation: "Navigation",
  interface: "Interface text",
};

export interface ExplorerFilters {
  q: string;
  page: string;
  area: string;
  lang: "any" | "ar" | "en";
  missing: "" | "any" | "ar" | "en";
  state: string;
}

function highlight(text: string, q: string): ReactNode {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-amber-200 px-0.5">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/** Snippet around the first match (long texts). */
function snippet(text: string, q: string, size = 180): string {
  if (text.length <= size) return text;
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return `${text.slice(0, size)}…`;
  const start = Math.max(0, i - 60);
  return `${start > 0 ? "…" : ""}${text.slice(start, start + size)}${start + size < text.length ? "…" : ""}`;
}

export function ContentExplorer({ entries, pages, initial }: { entries: ContentEntry[]; pages: { key: string; label: string }[]; initial: ExplorerFilters }) {
  const [filters, setFilters] = useState(initial);
  const [limit, setLimit] = useState(100);
  const set = (patch: Partial<ExplorerFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setLimit(100);
  };

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return entries.filter((e) => {
      if (filters.page && !e.pages.includes(filters.page)) return false;
      if (filters.area && e.area !== filters.area) return false;
      if (filters.state && e.state !== filters.state) return false;
      if (filters.missing === "any" && !e.missing) return false;
      if ((filters.missing === "ar" || filters.missing === "en") && e.missing !== filters.missing) return false;
      if (q) {
        const inAr = e.ar.toLowerCase().includes(q);
        const inEn = e.en.toLowerCase().includes(q);
        const inMeta = e.container.toLowerCase().includes(q) || e.field.toLowerCase().includes(q);
        if (filters.lang === "ar" ? !inAr : filters.lang === "en" ? !inEn : !(inAr || inEn || inMeta)) return false;
      }
      return true;
    });
  }, [entries, filters]);

  const missingCount = useMemo(() => entries.filter((e) => e.missing).length, [entries]);
  const q = filters.q.trim();

  return (
    <>
      <div className="adm-card mb-4 grid gap-3 p-3 md:grid-cols-[1fr_auto_auto] lg:grid-cols-[1fr_auto_auto_auto_auto_auto]">
        <label className="relative">
          <span className="sr-only">Search</span>
          <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" value={filters.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search all website text (Arabic or English)" className="adm-input ps-9" />
        </label>
        <select value={filters.lang} onChange={(e) => set({ lang: e.target.value as ExplorerFilters["lang"] })} className="adm-input" aria-label="Search in">
          <option value="any">Both languages</option>
          <option value="ar">Arabic only</option>
          <option value="en">English only</option>
        </select>
        <select value={filters.page} onChange={(e) => set({ page: e.target.value })} className="adm-input" aria-label="Page">
          <option value="">All pages</option>
          {pages.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
        <select value={filters.area} onChange={(e) => set({ area: e.target.value })} className="adm-input" aria-label="Type of content">
          <option value="">All content types</option>
          {Object.entries(AREAS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select value={filters.missing} onChange={(e) => set({ missing: e.target.value as ExplorerFilters["missing"] })} className="adm-input" aria-label="Translation">
          <option value="">Any translation state</option>
          <option value="any">Missing a translation ({missingCount})</option>
          <option value="ar">Missing Arabic</option>
          <option value="en">Missing English</option>
        </select>
        <select value={filters.state} onChange={(e) => set({ state: e.target.value })} className="adm-input" aria-label="Status">
          <option value="">Any status</option>
          <option value="published">Published / visible</option>
          <option value="draft">Draft</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>
      <p className="mb-3 text-sm text-muted" role="status">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>
      <ul className="grid grid-cols-1 gap-2">
        {results.slice(0, limit).map((e) => (
          <li key={e.id} className="adm-card grid min-w-0 grid-cols-1 gap-2 p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="adm-badge adm-badge-blue">{AREAS[e.area]}</span>
              <span className="min-w-0 truncate text-sm font-semibold">{e.container}</span>
              <span className="truncate text-xs text-muted">· {e.field}</span>
              <span className="ms-auto flex items-center gap-2">
                {e.missing && <span className="adm-badge adm-badge-amber">Missing {e.missing === "ar" ? "Arabic" : "English"}</span>}
                {e.state && e.state !== "published" && <StatusBadge status={e.state} />}
                <Link href={e.href} className="adm-btn adm-btn-secondary adm-btn-sm">
                  <Pencil size={13} aria-hidden /> Edit
                </Link>
              </span>
            </div>
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <p dir="rtl" lang="ar" className={`rounded-lg px-3 py-2 ${e.ar ? "bg-[#f7f8fd]" : "bg-amber-50 text-amber-800"}`}>
                {e.ar ? highlight(snippet(e.ar, q), q) : "— empty —"}
              </p>
              <p dir="ltr" lang="en" className={`rounded-lg px-3 py-2 ${e.en ? "bg-[#f7f8fd]" : "bg-amber-50 text-amber-800"}`}>
                {e.en ? highlight(snippet(e.en, q), q) : "— empty —"}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {results.length > limit && (
        <button type="button" className="adm-btn adm-btn-secondary mx-auto mt-4 flex" onClick={() => setLimit((l) => l + 100)}>
          Show more ({results.length - limit} left)
        </button>
      )}
    </>
  );
}
