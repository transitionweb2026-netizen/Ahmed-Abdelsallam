"use client";

import { AlertTriangle, ImagePlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { MediaKind } from "@/lib/cms/media-rules";
import { useFormApi } from "../form/FormContext";
import { MediaPicker } from "./MediaPicker";
import { MediaPreview, mediaName, mediaSummary } from "./MediaPreview";

/** A media library item chosen for a field (value: media id). */
export function MediaField({ kind, value, onChange, required, label, invalid }: { kind: MediaKind; value: string | null; onChange: (id: string | null) => void; required?: boolean; label: string; invalid?: boolean }) {
  const { media, rememberMedia } = useFormApi();
  const [open, setOpen] = useState(false);
  const item = value ? media[value] : undefined;
  const altMissing = item?.kind === "image" && (!item.alt_ar.trim() || !item.alt_en.trim());

  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-xl border bg-white p-2.5 ${invalid ? "border-red-400" : "border-line"}`}>
      {value ? (
        <MediaPreview media={item} className="h-20 w-28 flex-none" />
      ) : (
        <div className="grid h-20 w-28 flex-none place-items-center rounded-lg border border-dashed border-[#c5cce8] text-muted">
          <ImagePlus size={20} aria-hidden />
        </div>
      )}
      <div className="grid min-w-0 flex-1 gap-0.5 text-sm">
        {item ? (
          <>
            <span className="truncate font-semibold">{mediaName(item)}</span>
            <span className="truncate text-xs text-muted">{mediaSummary(item)}</span>
            {altMissing && (
              <Link href={`/admin/media?item=${item.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:underline">
                <AlertTriangle size={12} aria-hidden /> Alt text missing in {!item.alt_ar.trim() && !item.alt_en.trim() ? "both languages" : !item.alt_ar.trim() ? "Arabic" : "English"}
              </Link>
            )}
          </>
        ) : (
          <span className="text-muted">{value ? "This file is no longer in the library." : `No ${kind} selected${required ? " (required)" : ""}.`}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => setOpen(true)} aria-label={`${value ? "Change" : "Choose"} ${label}`}>
          {value ? "Change…" : "Choose…"}
        </button>
        {value && !required && (
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => onChange(null)} aria-label={`Remove ${label}`}>
            Remove
          </button>
        )}
      </div>
      <MediaPicker
        open={open}
        kind={kind}
        current={value}
        onClose={() => setOpen(false)}
        onSelect={(selected) => {
          rememberMedia(selected);
          onChange(selected.id);
          setOpen(false);
        }}
      />
    </div>
  );
}
