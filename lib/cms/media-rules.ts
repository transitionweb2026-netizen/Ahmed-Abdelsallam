/**
 * Accepted media files — checked in the browser before uploading, again by
 * the server when the file is registered, and by the Storage bucket itself
 * (supabase/migrations/*_cms_storage.sql).
 */
export type MediaKind = "image" | "video";

export const MEDIA_RULES: Record<MediaKind, { mime: string[]; extensions: string[]; maxBytes: number; label: string }> = {
  image: {
    mime: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/x-icon", "image/vnd.microsoft.icon"],
    extensions: ["jpg", "jpeg", "png", "webp", "avif", "gif", "ico"],
    maxBytes: 10 * 1024 * 1024,
    label: "JPG, PNG, WebP, AVIF, GIF or ICO, up to 10 MB",
  },
  video: {
    mime: ["video/mp4", "video/webm"],
    extensions: ["mp4", "webm"],
    maxBytes: 200 * 1024 * 1024,
    label: "MP4 or WebM, up to 200 MB",
  },
};

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  ico: "image/x-icon",
  mp4: "video/mp4",
  webm: "video/webm",
};

export function extensionOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

/** The file's MIME type, falling back to its extension (some browsers leave it empty). */
export function mimeFor(name: string, type?: string): string {
  return type || MIME_BY_EXTENSION[extensionOf(name)] || "";
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** An error message when the file is not acceptable, or null. */
export function checkFile(kind: MediaKind, name: string, mime: string, size: number): string | null {
  const rules = MEDIA_RULES[kind];
  if (!rules.mime.includes(mime) || !rules.extensions.includes(extensionOf(name))) {
    return `“${name}” is not an accepted file type. Allowed: ${rules.label}.`;
  }
  if (size > rules.maxBytes) return `“${name}” is ${formatBytes(size)} — the limit is ${formatBytes(rules.maxBytes)}.`;
  return null;
}

/** Storage path for a new upload: <kind>s/YYYY/MM/<random>-<name>.<ext> (unique, so caches never show an old file). */
export function storagePathFor(kind: MediaKind, filename: string, random: string): string {
  const now = new Date();
  const ext = extensionOf(filename);
  const base =
    filename
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "file";
  return `${kind}s/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${random.slice(0, 8)}-${base}.${ext}`;
}

/** Paths the server accepts when registering an upload (no traversal, our folder layout). */
export function isValidStoragePath(kind: MediaKind, path: string): boolean {
  return new RegExp(`^${kind}s/\\d{4}/\\d{2}/[a-z0-9]{8}-[a-z0-9-]{1,50}\\.[a-z0-9]{2,5}$`).test(path);
}
