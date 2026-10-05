"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { loadAllMedia, loadMediaUsages } from "@/lib/cms/admin/data";
import { ActionError, check, requireAdmin, revalidateSite, run } from "@/lib/cms/admin/session";
import { withUrl, type ActionResult, type MediaItem, type MediaUsage } from "@/lib/cms/admin/types";
import { checkFile, isValidStoragePath, type MediaKind } from "@/lib/cms/media-rules";
import type { MediaRow } from "@/lib/cms/types";
import { MEDIA_BUCKET } from "@/lib/supabase/env";

export interface UploadedFile {
  kind: MediaKind;
  /** Storage path the browser uploaded to (see lib/cms/upload.ts). */
  path: string;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  title?: string;
}

const positiveInt = (value: unknown, max: number) => (typeof value === "number" && Number.isFinite(value) && value > 0 && value <= max ? Math.round(value) : null);

/**
 * Confirms the upload with Storage itself (it exists, and its real type and
 * size are allowed) instead of trusting what the browser reports.
 */
async function verifyUpload(supabase: SupabaseClient, file: UploadedFile) {
  if (file.kind !== "image" && file.kind !== "video") throw new ActionError("Unknown media type.");
  if (!isValidStoragePath(file.kind, file.path)) throw new ActionError("Invalid upload path.");
  const slash = file.path.lastIndexOf("/");
  const folder = file.path.slice(0, slash);
  const name = file.path.slice(slash + 1);
  const listed = check(await supabase.storage.from(MEDIA_BUCKET).list(folder, { search: name, limit: 10 })) as { name: string; metadata?: { size?: number; mimetype?: string } }[];
  const object = listed?.find((entry) => entry.name === name);
  if (!object) throw new ActionError("The upload could not be found in storage. Please try again.");
  const size = Number(object.metadata?.size ?? 0);
  const mime = String(object.metadata?.mimetype ?? "");
  const problem = checkFile(file.kind, name, mime, size);
  if (problem) {
    await supabase.storage.from(MEDIA_BUCKET).remove([file.path]);
    throw new ActionError(problem);
  }
  return {
    kind: file.kind,
    bucket: MEDIA_BUCKET,
    path: file.path,
    mime_type: mime,
    size_bytes: size,
    width: positiveInt(file.width, 20000),
    height: positiveInt(file.height, 20000),
    duration_seconds: typeof file.duration === "number" && Number.isFinite(file.duration) && file.duration >= 0 && file.duration < 86400 ? Math.round(file.duration * 1000) / 1000 : null,
  };
}

/** Records a file the browser has just uploaded to Storage in the media library. */
export async function registerMedia(file: UploadedFile): Promise<ActionResult<MediaItem>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const values = await verifyUpload(supabase, file);
    const title = String(file.title ?? "").slice(0, 200);
    const { data, error } = await supabase.from("media").insert({ ...values, title }).select("*").single();
    if (error) {
      await supabase.storage.from(MEDIA_BUCKET).remove([file.path]);
      throw error;
    }
    return withUrl(data as MediaRow);
  });
}

/** Swaps the file behind a media item; every page using it shows the new file. */
export async function replaceMediaFile(id: string, file: UploadedFile): Promise<ActionResult<MediaItem>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const current = check(await supabase.from("media").select("*").eq("id", id).maybeSingle()) as MediaRow | null;
    if (!current) throw new ActionError("This media item no longer exists.");
    if (current.kind !== file.kind) throw new ActionError(`Replace a ${current.kind} with another ${current.kind}.`);
    const values = await verifyUpload(supabase, file);
    const { data, error } = await supabase.from("media").update(values).eq("id", id).select("*").single();
    if (error) {
      await supabase.storage.from(MEDIA_BUCKET).remove([file.path]);
      throw error;
    }
    // The old object is no longer referenced (files shipped with the site stay in /public).
    if (current.bucket) await supabase.storage.from(current.bucket).remove([current.path]);
    revalidateSite();
    return withUrl(data as MediaRow);
  });
}

export async function updateMediaDetails(id: string, input: { title: string; alt_ar: string; alt_en: string }): Promise<ActionResult<MediaItem>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
    const values = { title: clean(input.title, 200), alt_ar: clean(input.alt_ar, 400), alt_en: clean(input.alt_en, 400) };
    const data = check(await supabase.from("media").update(values).eq("id", id).select("*").maybeSingle()) as MediaRow | null;
    if (!data) throw new ActionError("This media item no longer exists.");
    revalidateSite();
    return withUrl(data);
  });
}

export async function getMediaUsage(id: string): Promise<ActionResult<MediaUsage[]>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    return (await loadMediaUsages(supabase, id))[id] ?? [];
  });
}

/** Deletes a media item that nothing uses (the database refuses otherwise, too). */
export async function deleteMedia(id: string): Promise<ActionResult<undefined>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const usages = (await loadMediaUsages(supabase, id))[id] ?? [];
    if (usages.length) {
      throw new ActionError(`Still used in ${usages.length} place${usages.length === 1 ? "" : "s"} (${usages.slice(0, 3).map((u) => u.label).join("; ")}${usages.length > 3 ? " …" : ""}). Choose another file there first.`);
    }
    const deleted = check(await supabase.from("media").delete().eq("id", id).select("*")) as MediaRow[];
    if (!deleted.length) throw new ActionError("This media item no longer exists.");
    if (deleted[0].bucket) await supabase.storage.from(deleted[0].bucket).remove([deleted[0].path]);
    return undefined;
  });
}

/** The library for the media picker. */
export async function listMedia(kind?: MediaKind): Promise<ActionResult<MediaItem[]>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const all = await loadAllMedia(supabase);
    return kind ? all.filter((item) => item.kind === kind) : all;
  });
}
