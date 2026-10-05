import * as tus from "tus-js-client";
import { registerMedia, replaceMediaFile, type UploadedFile } from "@/app/admin/_actions/media";
import type { MediaItem } from "@/lib/cms/admin/types";
import { checkFile, mimeFor, storagePathFor, type MediaKind } from "@/lib/cms/media-rules";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { MEDIA_BUCKET, supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

/** Kind of media a file is, from its type (null = not accepted). */
export function kindOf(file: File): MediaKind | null {
  const mime = mimeFor(file.name, file.type);
  return mime.startsWith("image/") ? "image" : mime.startsWith("video/") ? "video" : null;
}

/** An error message when the file cannot be uploaded as this kind, or null. */
export function validateFile(file: File, kind: MediaKind): string | null {
  return checkFile(kind, file.name, mimeFor(file.name, file.type), file.size);
}

/** Dimensions (and duration) read in the browser before uploading. */
async function probe(file: File, mime: string): Promise<{ width?: number; height?: number; duration?: number }> {
  const url = URL.createObjectURL(file);
  try {
    if (mime.startsWith("image/")) {
      const img = new Image();
      img.src = url;
      await img.decode();
      return { width: img.naturalWidth || undefined, height: img.naturalHeight || undefined };
    }
    if (mime.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = url;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("unreadable"));
      });
      return { width: video.videoWidth || undefined, height: video.videoHeight || undefined, duration: Number.isFinite(video.duration) ? video.duration : undefined };
    }
  } catch {
    // Metadata is a nice-to-have; the upload still proceeds.
  } finally {
    URL.revokeObjectURL(url);
  }
  return {};
}

export type UploadHandle = { promise: Promise<MediaItem>; abort: () => void };

/**
 * Uploads a file straight from the browser to Supabase Storage (resumable
 * TUS upload in 6 MB chunks, with progress), then records it in the media
 * library — or, with `replaceId`, swaps the file of an existing item.
 * Storage only accepts the upload from a signed-in administrator (policies
 * in supabase/migrations/*_cms_storage.sql).
 */
export function uploadMedia(file: File, kind: MediaKind, onProgress: (percent: number) => void, replaceId?: string): UploadHandle {
  let upload: tus.Upload | null = null;
  let aborted = false;

  const promise = (async () => {
    const problem = validateFile(file, kind);
    if (problem) throw new Error(problem);

    const { data } = await getSupabaseBrowserClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Your session has expired. Please sign in again.");

    const mime = mimeFor(file.name, file.type);
    const path = storagePathFor(kind, file.name, crypto.randomUUID().replace(/-/g, ""));
    const meta = await probe(file, mime);

    await new Promise<void>((resolve, reject) => {
      upload = new tus.Upload(file, {
        endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
        retryDelays: [0, 2000, 5000, 10000],
        headers: { authorization: `Bearer ${token}`, apikey: supabasePublishableKey, "x-upsert": "false" },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: 6 * 1024 * 1024, // Supabase requires exactly 6 MB chunks
        metadata: { bucketName: MEDIA_BUCKET, objectName: path, contentType: mime, cacheControl: "31536000" },
        onProgress: (sent, total) => onProgress(total ? Math.round((sent / total) * 100) : 0),
        onError: (error) => {
          const body = (error as tus.DetailedError).originalResponse?.getBody?.() ?? "";
          reject(
            new Error(
              aborted
                ? "Upload cancelled."
                : /exceeded|too large|413/i.test(body + error.message)
                  ? "The file is larger than the storage limit allows (see the project's upload limit in Supabase)."
                  : /mime|type/i.test(body)
                    ? "Storage does not accept this file type."
                    : /403|unauthori|row-level/i.test(body + error.message)
                      ? "Storage refused the upload: this account is not an administrator, or the session expired."
                      : `Upload failed: ${error.message}`,
            ),
          );
        },
        onSuccess: () => resolve(),
      });
      upload.findPreviousUploads().then((previous) => {
        if (previous.length) upload?.resumeFromPreviousUpload(previous[0]);
        upload?.start();
      });
    });

    const registration: UploadedFile = {
      kind,
      path,
      width: meta.width ?? null,
      height: meta.height ?? null,
      duration: meta.duration ?? null,
      title: file.name.replace(/\.[^.]+$/, ""),
    };
    const result = replaceId ? await replaceMediaFile(replaceId, registration) : await registerMedia(registration);
    if (!result.ok) throw new Error(result.error);
    return result.data;
  })();

  return {
    promise,
    abort: () => {
      aborted = true;
      void (upload as tus.Upload | null)?.abort(true);
    },
  };
}
