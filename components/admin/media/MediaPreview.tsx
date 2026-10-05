/* eslint-disable @next/next/no-img-element -- dashboard thumbnails of arbitrary uploads; next/image would need every storage host configured */
import { Film } from "lucide-react";
import type { MediaItem } from "@/lib/cms/admin/types";

export function MediaPreview({ media, className = "", fit = "cover" }: { media: MediaItem | undefined; className?: string; fit?: "cover" | "contain" }) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  if (!media) return <div className={`grid place-items-center rounded-lg bg-[#eceffa] text-xs text-muted ${className}`}>Missing</div>;
  if (media.kind === "video") {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-[#0b1233] ${className}`}>
        <video src={`${media.url}#t=0.5`} preload="metadata" muted playsInline className={`h-full w-full ${fitClass}`} aria-hidden />
        <span className="absolute start-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-md bg-black/55 text-white">
          <Film size={14} aria-hidden />
        </span>
      </div>
    );
  }
  return <img src={media.url} alt="" loading="lazy" decoding="async" className={`rounded-lg bg-[#eceffa] ${fitClass} ${className}`} />;
}

export function mediaSummary(media: MediaItem): string {
  const parts: string[] = [];
  if (media.width && media.height) parts.push(`${media.width} × ${media.height}`);
  if (media.duration_seconds) {
    const s = Math.round(Number(media.duration_seconds));
    parts.push(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);
  }
  if (media.size_bytes) parts.push(media.size_bytes < 1024 * 1024 ? `${Math.round(media.size_bytes / 1024)} KB` : `${(media.size_bytes / 1024 / 1024).toFixed(1)} MB`);
  parts.push(media.bucket ? "uploaded" : "bundled with the site");
  return parts.join(" · ");
}

export function mediaName(media: MediaItem): string {
  return media.title || media.path.split("/").pop() || media.path;
}
