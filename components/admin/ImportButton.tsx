"use client";

import { Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { importBundledContent } from "@/app/admin/_actions/content";
import { useConfirm, useToast } from "./Feedback";

/** Copies the content bundled with the code into the database (never overwrites). */
export function ImportButton({ empty }: { empty: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    const ok = await confirm({
      title: empty ? "Import the website's current content?" : "Fill in missing content?",
      body: empty
        ? "Copies every page, item, setting and text of the current website into the CMS, so you can edit it here."
        : "Adds only what is missing in the CMS (for example a section added to the website after the first import). Nothing you have edited is changed.",
      confirmLabel: "Import",
    });
    if (!ok) return;
    setBusy(true);
    const result = await importBundledContent();
    setBusy(false);
    if (!result.ok) return toast("error", result.error);
    toast("success", result.data.inserted ? `Imported ${result.data.inserted} records.` : "Nothing was missing — the CMS already has everything.");
    router.refresh();
  };

  return (
    <button type="button" className={`adm-btn ${empty ? "adm-btn-primary" : "adm-btn-secondary"}`} onClick={run} disabled={busy}>
      {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Download size={15} aria-hidden />}
      {empty ? "Import content" : "Fill in missing content"}
    </button>
  );
}
