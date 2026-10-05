"use client";

import { Check, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listMedia } from "@/app/admin/_actions/media";
import type { MediaItem } from "@/lib/cms/admin/types";
import type { MediaKind } from "@/lib/cms/media-rules";
import { Dialog } from "../Feedback";
import { MediaPreview, mediaName, mediaSummary } from "./MediaPreview";
import { UploadButton } from "./UploadButton";

/** Choose an existing file from the library, or upload a new one. */
export function MediaPicker({ open, kind, current, onClose, onSelect }: { open: boolean; kind: MediaKind; current: string | null; onClose: () => void; onSelect: (item: MediaItem) => void }) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    listMedia(kind).then((result) => {
      if (cancelled) return;
      if (result.ok) setItems(result.data);
      else setError(result.error);
    });
    return () => {
      cancelled = true;
    };
  }, [open, kind]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!items) return [];
    return q ? items.filter((item) => [item.title, item.path, item.alt_ar, item.alt_en].some((v) => v?.toLowerCase().includes(q))) : items;
  }, [items, query]);

  return (
    <Dialog open={open} onClose={onClose} title={kind === "image" ? "Choose an image" : "Choose a video"} size="xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <label className="relative min-w-60 flex-1">
          <span className="sr-only">Search the library</span>
          <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or alt text" className="adm-input ps-9" />
        </label>
        <UploadButton
          kind={kind}
          label={`Upload new ${kind}`}
          className="adm-btn adm-btn-primary"
          onUploaded={(item) => {
            setItems((list) => [item, ...(list ?? [])]);
            onSelect(item);
          }}
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {!items && !error && <p className="py-10 text-center text-sm text-muted">Loading the library…</p>}
      {items && filtered.length === 0 && <p className="py-10 text-center text-sm text-muted">{query ? "Nothing matches your search." : `No ${kind}s in the library yet — upload one.`}</p>}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {filtered.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              aria-pressed={item.id === current}
              className={`group grid w-full gap-1.5 rounded-xl p-1.5 text-start transition ${item.id === current ? "bg-brand-soft ring-2 ring-brand" : "hover:bg-[#f1f3fb]"}`}
            >
              <span className="relative block">
                <MediaPreview media={item} className="aspect-[4/3] h-auto w-full" />
                {item.id === current && (
                  <span className="absolute end-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-brand text-white">
                    <Check size={14} aria-hidden />
                  </span>
                )}
              </span>
              <span className="truncate text-xs font-semibold">{mediaName(item)}</span>
              <span className="truncate text-[0.68rem] text-muted">{mediaSummary(item)}</span>
            </button>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
