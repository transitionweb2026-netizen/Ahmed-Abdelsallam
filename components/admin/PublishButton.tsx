"use client";

import { CloudUpload, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getPublishStatus, publishLiveSite, type PublishPhase, type PublishStatus } from "@/app/admin/_actions/publish";
import { PUBLISHING_DISABLED_MESSAGE, PUBLISHING_ENABLED } from "@/lib/cms/admin/publish-config";
import { useConfirm, useToast } from "./Feedback";

const ACTIVE: PublishPhase[] = ["queued", "building", "uploading"];
const LABEL: Record<PublishPhase, string> = {
  idle: "Publish Live Site",
  queued: "Queued…",
  building: "Building…",
  uploading: "Uploading…",
  successful: "Published",
  failed: "Publish failed",
};
const POLL_MS = 4000;

/**
 * Triggers .github/workflows/publish-site.yml (build the static export,
 * upload it to Hostinger, verify, keep a rollback copy) and polls it while
 * active. One admin-visible control for the whole pipeline — see
 * docs/deploy/publish-pipeline.md.
 */
export function PublishButton() {
  if (!PUBLISHING_ENABLED) {
    return (
      <span className="inline-flex items-center gap-2" title={PUBLISHING_DISABLED_MESSAGE}>
        <button type="button" disabled aria-disabled="true" className="adm-btn adm-btn-secondary">
          <CloudUpload size={15} aria-hidden />
          <span className="hidden sm:inline">Publishing unavailable</span>
        </button>
      </span>
    );
  }

  return <ActivePublishButton />;
}

function ActivePublishButton() {
  const [status, setStatus] = useState<PublishStatus>({ phase: "idle", runUrl: null, updatedAt: null });
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const poll = () => {
    timer.current = setTimeout(async () => {
      const result = await getPublishStatus();
      if (!result.ok) return; // transient — the next poll tries again
      setStatus(result.data);
      if (ACTIVE.includes(result.data.phase)) {
        poll();
      } else if (result.data.phase === "successful") {
        toast("success", "The live site has been published.");
      } else if (result.data.phase === "failed") {
        toast("error", "The publish failed and was rolled back. Check the GitHub Actions run for details.");
      }
    }, POLL_MS);
  };

  const onClick = async () => {
    if (!(await confirm({ title: "Publish the live site?", body: "This rebuilds the public website from the current content and uploads it to Hostinger. It takes a few minutes.", confirmLabel: "Publish" }))) {
      return;
    }
    setBusy(true);
    const result = await publishLiveSite();
    setBusy(false);
    if (!result.ok) {
      toast("error", result.error);
      return;
    }
    setStatus(result.data);
    poll();
  };

  const active = busy || ACTIVE.includes(status.phase);

  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" onClick={onClick} disabled={active} className="adm-btn adm-btn-secondary">
        {active ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <CloudUpload size={15} aria-hidden />}
        <span className="hidden sm:inline">{active ? LABEL[busy ? "queued" : status.phase] : LABEL.idle}</span>
      </button>
      {status.runUrl && (status.phase === "failed" || active) ? (
        <a href={status.runUrl} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost adm-btn-icon" aria-label="View run on GitHub">
          <ExternalLink size={14} aria-hidden />
        </a>
      ) : null}
    </span>
  );
}
