"use client";

/* eslint-disable @next/next/no-img-element -- full-size preview of an upload */
import { AlertTriangle, Copy, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { deleteMedia, updateMediaDetails } from "@/app/admin/_actions/media";
import type { MediaItem, MediaUsage } from "@/lib/cms/admin/types";
import { Dialog, useConfirm, useToast } from "../Feedback";
import { MediaPreview, mediaName, mediaSummary } from "./MediaPreview";
import { UploadButton } from "./UploadButton";

type Filters = { q: string; kind: "" | "image" | "video"; usage: "" | "used" | "unused"; alt: boolean; source: "" | "uploaded" | "bundled" };

/** Full address (files bundled with the site have a path only). Called on click, never during render. */
function absolute(url: string) {
  return url.startsWith("/") ? `${window.location.origin}${url}` : url;
}

function Details({ item, usages, onClose, onChanged, onDeleted }: { item: MediaItem; usages: MediaUsage[]; onClose: () => void; onChanged: (item: MediaItem) => void; onDeleted: (id: string) => void }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [values, setValues] = useState({ title: item.title, alt_ar: item.alt_ar, alt_en: item.alt_en });
  const [saving, setSaving] = useState(false);
  const dirty = values.title !== item.title || values.alt_ar !== item.alt_ar || values.alt_en !== item.alt_en;

  const save = async () => {
    setSaving(true);
    const result = await updateMediaDetails(item.id, values);
    setSaving(false);
    if (!result.ok) return toast("error", result.error);
    onChanged(result.data);
    toast("success", "Details saved.");
  };

  const remove = async () => {
    const ok = await confirm({
      title: `Delete “${mediaName(item)}”?`,
      body: item.bucket ? "The file is deleted from storage. This cannot be undone." : "It is removed from the library. (The file itself ships with the website code and stays there.)",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    const result = await deleteMedia(item.id);
    if (!result.ok) return toast("error", result.error);
    toast("success", "Deleted.");
    onDeleted(item.id);
  };

  return (
    <Dialog
      open
      onClose={() => {
        if (!dirty || window.confirm("Discard the unsaved changes to this file's details?")) onClose();
      }}
      title={mediaName(item)}
      size="lg"
      footer={
        <>
          <button type="button" className="adm-btn adm-btn-danger me-auto" onClick={remove} disabled={usages.length > 0} title={usages.length ? "Used on the website — choose another file in those places first" : undefined}>
            <Trash2 size={15} aria-hidden /> Delete
          </button>
          <button type="button" className="adm-btn adm-btn-primary" onClick={save} disabled={!dirty || saving}>
            {saving ? "Saving…" : "Save details"}
          </button>
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
        <div className="grid content-start gap-3">
          {item.kind === "video" ? (
            <video src={item.url} controls preload="metadata" className="max-h-80 w-full rounded-xl bg-black" />
          ) : (
            <img src={item.url} alt="" className="max-h-80 w-full rounded-xl bg-[#eceffa] object-contain" />
          )}
          <p className="text-xs text-muted">{mediaSummary(item)}</p>
          <div className="flex items-center gap-2">
            <input readOnly value={item.url} className="adm-input font-mono text-[0.72rem]" aria-label="File address" dir="ltr" onFocus={(e) => e.target.select()} />
            <button
              type="button"
              className="adm-btn adm-btn-secondary adm-btn-icon flex-none"
              aria-label="Copy the address"
              onClick={() => navigator.clipboard.writeText(absolute(item.url)).then(() => toast("success", "Address copied."))}
            >
              <Copy size={14} aria-hidden />
            </button>
          </div>
          <UploadButton
            kind={item.kind}
            replaceId={item.id}
            label="Replace file…"
            onUploaded={(updated) => onChanged(updated)}
          />
          <p className="adm-help">Replacing keeps every use: the new file appears wherever this one is shown, in both languages.</p>
        </div>
        <div className="grid content-start gap-4">
          <label className="grid gap-1">
            <span className="adm-label">Title (dashboard only)</span>
            <input value={values.title} maxLength={200} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} className="adm-input" />
          </label>
          {item.kind === "image" && (
            <>
              <label className="grid gap-1" lang="ar">
                <span className="adm-label">
                  Description for screen readers (alt) — <span className="adm-lang">العربية</span>
                </span>
                <textarea dir="rtl" rows={2} maxLength={400} value={values.alt_ar} onChange={(e) => setValues((v) => ({ ...v, alt_ar: e.target.value }))} className="adm-input" />
              </label>
              <label className="grid gap-1" lang="en">
                <span className="adm-label">
                  Description for screen readers (alt) — <span className="adm-lang">English</span>
                </span>
                <textarea dir="ltr" rows={2} maxLength={400} value={values.alt_en} onChange={(e) => setValues((v) => ({ ...v, alt_en: e.target.value }))} className="adm-input" />
              </label>
              <p className="adm-help">Describe what the image shows. Decorative images can stay empty. A page can override this text for one use.</p>
            </>
          )}
          <div>
            <p className="adm-label">Used in</p>
            {usages.length ? (
              <ul className="mt-1 grid gap-1 text-sm">
                {usages.map((u) => (
                  <li key={`${u.source}-${u.record_id}-${u.field}`}>
                    <Link href={u.href} className="text-brand underline-offset-2 hover:underline">
                      {u.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-muted">Not used anywhere — safe to delete.</p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export function MediaLibrary({ initial, usages, initialItem }: { initial: MediaItem[]; usages: Record<string, MediaUsage[]>; initialItem?: string }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [filters, setFilters] = useState<Filters>({ q: "", kind: "", usage: "", alt: false, source: "" });
  const [openId, setOpenId] = useState<string | null>(initialItem && initial.some((i) => i.id === initialItem) ? initialItem : null);
  const open = items.find((i) => i.id === openId);

  const visible = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return items.filter((item) => {
      if (filters.kind && item.kind !== filters.kind) return false;
      const used = (usages[item.id]?.length ?? 0) > 0;
      if (filters.usage === "used" && !used) return false;
      if (filters.usage === "unused" && used) return false;
      if (filters.alt && !(item.kind === "image" && (!item.alt_ar.trim() || !item.alt_en.trim()))) return false;
      if (filters.source === "uploaded" && !item.bucket) return false;
      if (filters.source === "bundled" && item.bucket) return false;
      return !q || [item.title, item.path, item.alt_ar, item.alt_en].some((v) => v.toLowerCase().includes(q));
    });
  }, [items, filters, usages]);

  const totals = useMemo(() => ({ images: items.filter((i) => i.kind === "image").length, videos: items.filter((i) => i.kind === "video").length }), [items]);

  return (
    <>
      <div className="adm-card mb-4 grid gap-3 p-4 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-52 flex-1">
            <span className="sr-only">Search</span>
            <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
            <input type="search" value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} placeholder="Search by name or alt text" className="adm-input ps-9" />
          </label>
          <select value={filters.kind} onChange={(e) => setFilters((f) => ({ ...f, kind: e.target.value as Filters["kind"] }))} className="adm-input w-auto" aria-label="Type">
            <option value="">Images and videos</option>
            <option value="image">Images ({totals.images})</option>
            <option value="video">Videos ({totals.videos})</option>
          </select>
          <select value={filters.usage} onChange={(e) => setFilters((f) => ({ ...f, usage: e.target.value as Filters["usage"] }))} className="adm-input w-auto" aria-label="Usage">
            <option value="">Used or not</option>
            <option value="used">Used on the website</option>
            <option value="unused">Not used</option>
          </select>
          <select value={filters.source} onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value as Filters["source"] }))} className="adm-input w-auto" aria-label="Source">
            <option value="">All sources</option>
            <option value="uploaded">Uploaded</option>
            <option value="bundled">Bundled with the site</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={filters.alt} onChange={(e) => setFilters((f) => ({ ...f, alt: e.target.checked }))} /> Alt text missing
          </label>
        </div>
        <UploadButton
          kind="any"
          multiple
          label="Upload files"
          className="adm-btn adm-btn-primary"
          onUploaded={(item) => {
            setItems((list) => [item, ...list]);
            router.refresh();
          }}
        />
      </div>
      <p className="mb-3 text-sm text-muted" role="status">
        {visible.length} of {items.length} files
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visible.map((item) => {
          const count = usages[item.id]?.length ?? 0;
          const altMissing = item.kind === "image" && (!item.alt_ar.trim() || !item.alt_en.trim());
          return (
            <li key={item.id}>
              <button type="button" onClick={() => setOpenId(item.id)} className="adm-card grid w-full gap-1.5 p-2 text-start transition hover:ring-2 hover:ring-brand/30">
                <MediaPreview media={item} className="aspect-[4/3] h-auto w-full" />
                <span className="truncate px-0.5 text-xs font-semibold">{mediaName(item)}</span>
                <span className="flex flex-wrap gap-1 px-0.5">
                  <span className={`adm-badge ${count ? "adm-badge-green" : "adm-badge-gray"}`}>{count ? `${count} use${count === 1 ? "" : "s"}` : "unused"}</span>
                  {altMissing && (
                    <span className="adm-badge adm-badge-amber">
                      <AlertTriangle size={10} aria-hidden /> alt
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {visible.length === 0 && <p className="py-12 text-center text-sm text-muted">No files match.</p>}
      {open && (
        <Details
          key={open.id + open.path}
          item={open}
          usages={usages[open.id] ?? []}
          onClose={() => setOpenId(null)}
          onChanged={(updated) => {
            setItems((list) => list.map((i) => (i.id === updated.id ? updated : i)));
            router.refresh();
          }}
          onDeleted={(id) => {
            setItems((list) => list.filter((i) => i.id !== id));
            setOpenId(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
