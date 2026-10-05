/**
 * Types shared by the dashboard's Server Actions and its client components.
 */
import type { FieldError } from "@/lib/cms/fields";
import type { MediaRow } from "@/lib/cms/types";
import { storagePublicBaseUrl } from "@/lib/supabase/env";

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string; fieldErrors?: FieldError[] };

/** A media library row with its public URL. */
export type MediaItem = MediaRow & { url: string };

/** Media items by id (what a form needs to preview its images and videos). */
export type MediaMap = Record<string, MediaItem>;

export function mediaUrl(row: Pick<MediaRow, "bucket" | "path">): string {
  if (!row.bucket) return row.path;
  const path = row.path.split("/").map(encodeURIComponent).join("/");
  return `${storagePublicBaseUrl ?? ""}/${row.bucket}/${path}`;
}

export function withUrl(row: MediaRow): MediaItem {
  return { ...row, url: mediaUrl(row) };
}

/** Where a media item is used (public.media_usages). */
export interface MediaUsage {
  source: string;
  record_id: string;
  record_key: string;
  field: string;
  /** Dashboard page that edits the record. */
  href: string;
  label: string;
}

/** Options of a reference field (another record). */
export type ReferenceOptions = Record<string, { value: string; label: string }[]>;

/** Videos a section can show. */
export type VideoOption = { value: string; label: string; status: string };

export interface SlotValue {
  media_id: string;
  object_position: string | null;
  alt_ar: string | null;
  alt_en: string | null;
}
