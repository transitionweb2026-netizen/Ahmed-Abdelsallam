"use client";

/* eslint-disable @next/next/no-img-element -- small dashboard thumbnails */
import { ArrowDown, ArrowUp, Pencil, Search, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { deleteRecord, reorderRecords, setRecordStatus } from "@/app/admin/_actions/content";
import { collectionDef } from "@/lib/cms/registry";
import { StatusBadge, useConfirm, useToast } from "./Feedback";
import { EmptyState } from "./PageHeader";

export interface ListItem {
  id: string;
  key: string;
  title_ar: string;
  title_en: string;
  status: "draft" | "published" | null;
  featured: boolean;
  thumb: string | null;
  note?: string;
  missing: number;
  placeholder?: boolean;
}

export function CollectionList({ collectionKey, items: initial }: { collectionKey: string; items: ListItem[] }) {
  const def = collectionDef(collectionKey)!;
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [busy, setBusy] = useState(false);

  const filtering = query.trim() !== "" || status !== "all";
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => (status === "all" || item.status === status) && (!q || [item.title_ar, item.title_en, item.key].some((v) => v.toLowerCase().includes(q))));
  }, [items, query, status]);

  const moveItem = async (index: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setBusy(true);
    const result = await reorderRecords(collectionKey, next.map((item) => item.id));
    setBusy(false);
    if (!result.ok) {
      setItems(items);
      toast("error", result.error);
    } else router.refresh();
  };

  const toggleStatus = async (item: ListItem) => {
    const next = item.status === "published" ? "draft" : "published";
    const result = await setRecordStatus(collectionKey, item.id, next);
    if (!result.ok) return toast("error", result.error);
    setItems((list) => list.map((i) => (i.id === item.id ? { ...i, status: next } : i)));
    toast("success", next === "published" ? "Published — now visible on the website." : "Moved to drafts — hidden from the website.");
    router.refresh();
  };

  const remove = async (item: ListItem) => {
    const ok = await confirm({
      title: `Delete “${item.title_en || item.title_ar || item.key}”?`,
      body: <>It is removed from the website. This cannot be undone.{def.hasStatus && " To hide it temporarily, set it to Draft instead."}</>,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    const result = await deleteRecord(collectionKey, item.id);
    if (!result.ok) return toast("error", result.error);
    setItems((list) => list.filter((i) => i.id !== item.id));
    toast("success", `${def.singular} deleted.`);
    router.refresh();
  };

  if (!items.length) {
    return (
      <EmptyState title={`No ${def.label.toLowerCase()} yet`}>
        <Link href={`/admin/c/${collectionKey}/new`} className="adm-btn adm-btn-primary mt-3">
          Add the first {def.singular.toLowerCase()}
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="adm-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-line p-3">
        <label className="relative min-w-52 flex-1">
          <span className="sr-only">Search</span>
          <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${def.label.toLowerCase()}`} className="adm-input ps-9" />
        </label>
        {def.hasStatus && (
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="adm-input w-auto" aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        )}
        <span className="text-xs text-muted">
          {visible.length} of {items.length}
          {filtering && " · clear the filters to reorder"}
        </span>
      </div>
      <ul className="divide-y divide-[#eef0f8]">
        {visible.map((item) => {
          const index = items.indexOf(item);
          return (
            <li key={item.id} className="flex flex-wrap items-center gap-3 px-3 py-2.5 sm:flex-nowrap">
              {!filtering && (
                <div className="flex flex-none flex-col">
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon h-6 min-h-0" disabled={busy || index === 0} onClick={() => moveItem(index, index - 1)} aria-label={`Move “${item.title_en || item.key}” up`}>
                    <ArrowUp size={14} aria-hidden />
                  </button>
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon h-6 min-h-0" disabled={busy || index === items.length - 1} onClick={() => moveItem(index, index + 1)} aria-label={`Move “${item.title_en || item.key}” down`}>
                    <ArrowDown size={14} aria-hidden />
                  </button>
                </div>
              )}
              {item.thumb !== null && (item.thumb ? <img src={item.thumb} alt="" className="h-12 w-16 flex-none rounded-md bg-[#eceffa] object-cover" loading="lazy" /> : <span className="h-12 w-16 flex-none rounded-md bg-[#eceffa]" />)}
              <Link href={`/admin/c/${collectionKey}/${item.id}`} className="grid min-w-0 flex-1 gap-0.5 hover:text-brand">
                <span className="flex items-center gap-1.5 truncate text-sm font-semibold">
                  {item.featured && <Star size={13} className="flex-none fill-amber-400 text-amber-500" aria-label="Featured" />}
                  <span className="truncate">{item.title_en || item.title_ar || item.key}</span>
                </span>
                <span className="truncate text-sm text-muted" dir="rtl" lang="ar">
                  {item.title_ar}
                </span>
              </Link>
              <div className="flex flex-none flex-wrap items-center gap-1.5">
                {item.placeholder && <span className="adm-badge adm-badge-red">Placeholder</span>}
                {item.missing > 0 && <span className="adm-badge adm-badge-amber">{item.missing} untranslated</span>}
                {item.note && <span className="adm-badge adm-badge-gray">{item.note}</span>}
                {item.status && (
                  <button type="button" onClick={() => toggleStatus(item)} title={item.status === "published" ? "Click to move to drafts" : "Click to publish"} className="rounded-full">
                    <StatusBadge status={item.status} />
                  </button>
                )}
                <Link href={`/admin/c/${collectionKey}/${item.id}`} className="adm-btn adm-btn-ghost adm-btn-icon" aria-label={`Edit “${item.title_en || item.key}”`}>
                  <Pencil size={15} aria-hidden />
                </Link>
                <button type="button" onClick={() => remove(item)} className="adm-btn adm-btn-ghost adm-btn-icon text-red-700" aria-label={`Delete “${item.title_en || item.key}”`}>
                  <Trash2 size={15} aria-hidden />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
