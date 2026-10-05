"use client";

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import type { MediaItem } from "@/lib/cms/admin/types";
import { MEDIA_RULES, type MediaKind } from "@/lib/cms/media-rules";
import { kindOf, uploadMedia, validateFile, type UploadHandle } from "@/lib/cms/upload";
import { useToast } from "../Feedback";

type Job = { id: number; name: string; percent: number; handle: UploadHandle };

let nextJobId = 1;

/**
 * File chooser + resumable upload with progress and cancel. `kind` limits
 * what can be chosen; "any" accepts images and videos (media library).
 */
export function UploadButton({
  kind,
  onUploaded,
  multiple,
  replaceId,
  label,
  className = "adm-btn adm-btn-secondary",
}: {
  kind: MediaKind | "any";
  onUploaded: (item: MediaItem) => void;
  multiple?: boolean;
  replaceId?: string;
  label?: string;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const toast = useToast();
  const accept = (kind === "any" ? [...MEDIA_RULES.image.extensions, ...MEDIA_RULES.video.extensions] : MEDIA_RULES[kind].extensions).map((e) => `.${e}`).join(",");

  const start = (file: File) => {
    const fileKind = kind === "any" ? kindOf(file) : kind;
    const problem = fileKind ? validateFile(file, fileKind) : `“${file.name}” is not an image or video.`;
    if (problem || !fileKind) {
      toast("error", problem ?? "Unsupported file.");
      return;
    }
    const handle = uploadMedia(file, fileKind, (percent) => setJobs((list) => list.map((job) => (job.handle === handle ? { ...job, percent } : job))), replaceId);
    setJobs((list) => [...list, { id: nextJobId++, name: file.name, percent: 0, handle }]);
    handle.promise
      .then((item) => {
        toast("success", replaceId ? "File replaced." : `“${file.name}” uploaded.`);
        onUploaded(item);
      })
      .catch((error: Error) => {
        if (error.message !== "Upload cancelled.") toast("error", error.message);
      })
      .finally(() => setJobs((list) => list.filter((job) => job.handle !== handle)));
  };

  return (
    <div className="grid gap-2">
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          for (const file of Array.from(e.target.files ?? [])) start(file);
          e.target.value = "";
        }}
      />
      <button type="button" className={`${className} justify-self-start`} onClick={() => input.current?.click()}>
        <Upload size={15} aria-hidden />
        {label ?? (replaceId ? "Replace file" : "Upload")}
      </button>
      <p className="adm-help">{kind === "any" ? `${MEDIA_RULES.image.label}; ${MEDIA_RULES.video.label}.` : `${MEDIA_RULES[kind].label}.`}</p>
      {jobs.map((job) => (
        <div key={job.id} className="flex items-center gap-2 text-xs" role="status">
          <span className="min-w-0 flex-1 truncate">{job.name}</span>
          <progress max={100} value={job.percent} className="h-2 w-28 accent-[#33458f]" aria-label={`Uploading ${job.name}`} />
          <span className="w-9 text-end tabular-nums">{job.percent}%</span>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" onClick={() => job.handle.abort()} aria-label={`Cancel upload of ${job.name}`}>
            <X size={14} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
