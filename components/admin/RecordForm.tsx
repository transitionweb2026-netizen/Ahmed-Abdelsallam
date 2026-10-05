"use client";

import { AlertTriangle, ExternalLink, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { deleteRecord, saveRecord } from "@/app/admin/_actions/content";
import type { MediaMap, ReferenceOptions } from "@/lib/cms/admin/types";
import { missingTranslations, pruneDoc, validateDoc } from "@/lib/cms/fields";
import { collectionDef } from "@/lib/cms/registry";
import { useConfirm, useToast } from "./Feedback";
import { FieldList } from "./form/FieldEditor";
import { focusFirstError, FormProvider, LangSwitch } from "./form/FormContext";
import { SaveBar, useDocForm } from "./form/useDocForm";

type State = { doc: Record<string, unknown>; status: "draft" | "published" };

export function RecordForm({
  collectionKey,
  id,
  initialDoc,
  initialStatus,
  media,
  references,
  listHref,
}: {
  collectionKey: string;
  id: string | null;
  initialDoc: Record<string, unknown>;
  initialStatus: "draft" | "published";
  media: MediaMap;
  references: ReferenceOptions;
  listHref: string;
}) {
  const def = collectionDef(collectionKey)!;
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const form = useDocForm<State>({ doc: initialDoc, status: initialStatus });
  const { doc, status } = form.doc;
  const setState = form.setDoc;
  const setDoc = useCallback((updater: (d: Record<string, unknown>) => Record<string, unknown>) => setState((s) => ({ ...s, doc: updater(s.doc) })), [setState]);

  const missing = missingTranslations(def.fields, doc);
  const placeholderWarning = collectionKey === "reviews" && doc.is_placeholder === true && status === "published";

  const save = async () => {
    if (form.saving) return;
    const errors = validateDoc(def.fields, pruneDoc(def.fields, doc));
    if (errors.length) {
      form.setErrors(errors);
      toast("error", "Please correct the highlighted fields.");
      focusFirstError();
      return;
    }
    form.setSaving(true);
    const result = await saveRecord(collectionKey, id, { doc, status });
    form.setSaving(false);
    if (!result.ok) {
      form.setErrors(result.fieldErrors ?? []);
      toast("error", result.error);
      if (result.fieldErrors?.length) focusFirstError();
      return;
    }
    form.markSaved(form.doc);
    toast("success", status === "published" || !def.hasStatus ? "Saved — the website is updated." : "Saved as draft (not visible on the website).");
    if (!id) router.replace(`/admin/c/${collectionKey}/${result.data.id}`);
    router.refresh();
  };

  const remove = async () => {
    if (!id) return;
    const ok = await confirm({
      title: `Delete this ${def.singular.toLowerCase()}?`,
      body: (
        <>
          It is removed from the website and from the dashboard. This cannot be undone.
          {def.hasStatus && <> To hide it temporarily, set it to <strong>Draft</strong> instead.</>}
        </>
      ),
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    const result = await deleteRecord(collectionKey, id);
    if (!result.ok) return toast("error", result.error);
    form.markSaved(form.doc);
    toast("success", `${def.singular} deleted.`);
    router.push(listHref);
    router.refresh();
  };

  return (
    <FormProvider doc={doc} onChange={setDoc} errors={form.errors} media={media} references={references} locked={id ? [def.naturalKey] : []}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <LangSwitch />
        <div className="flex flex-wrap items-center gap-2">
          {def.hasStatus && (
            <label className="flex items-center gap-2 text-sm">
              <span className="font-semibold">Status</span>
              <select value={status} onChange={(e) => form.setDoc((s) => ({ ...s, status: e.target.value as State["status"] }))} className="adm-input w-auto py-1.5">
                <option value="published">Published</option>
                <option value="draft">Draft (hidden from the website)</option>
              </select>
            </label>
          )}
          {id && (
            <a href={`/ar${def.previewPath === "/" ? "" : def.previewPath}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-secondary adm-btn-sm">
              <ExternalLink size={14} aria-hidden /> View on site
            </a>
          )}
        </div>
      </div>

      {placeholderWarning && (
        <p className="mb-5 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
          <AlertTriangle size={18} className="flex-none" aria-hidden />
          This review is marked as a placeholder but is published. Publish only genuine reviews, with the patient&apos;s consent — set it to Draft, or replace the text with a real review and turn off “Placeholder”.
        </p>
      )}

      {missing.length > 0 && (
        <details className="mb-5 rounded-xl bg-[#fdf8ec] p-3 text-sm ring-1 ring-amber-200">
          <summary className="font-semibold text-amber-900">
            {missing.length} text{missing.length === 1 ? "" : "s"} filled in one language only
          </summary>
          <ul className="mt-2 grid gap-1 text-amber-900">
            {missing.map((m) => (
              <li key={m.path}>
                {m.label} — missing in {m.missing === "ar" ? "Arabic" : "English"}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="adm-card p-5 sm:p-6">
        <FieldList fields={def.fields} path={[]} />
      </div>

      <SaveBar
        dirty={form.dirty || !id}
        saving={form.saving}
        onSave={save}
        onReset={id ? form.reset : undefined}
        label={id ? "Save changes" : `Create ${def.singular.toLowerCase()}`}
        extra={
          id ? (
            <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={remove}>
              <Trash2 size={14} aria-hidden /> Delete
            </button>
          ) : null
        }
      />
    </FormProvider>
  );
}
