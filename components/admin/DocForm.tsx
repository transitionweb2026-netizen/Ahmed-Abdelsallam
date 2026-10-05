"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { savePageSeo, saveSettings } from "@/app/admin/_actions/content";
import { siteConfig } from "@/config/site";
import type { MediaMap } from "@/lib/cms/admin/types";
import { pruneDoc, validateDoc, type Field } from "@/lib/cms/fields";
import { pageSeoFields, settingsGroups } from "@/lib/cms/registry";
import { useToast } from "./Feedback";
import { FieldList } from "./form/FieldEditor";
import { focusFirstError, FormProvider, LangSwitch } from "./form/FormContext";
import { SaveBar, useDocForm } from "./form/useDocForm";

type Target = { kind: "settings" } | { kind: "seo"; page: string; path: string; siteName: { ar: string; en: string }; defaults: { title: { ar: string; en: string }; description: { ar: string; en: string } } };

const str = (v: unknown) => (typeof v === "string" ? v : "");
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** How the page could look in search results (both languages). */
function SearchPreview({ doc, target }: { doc: Record<string, unknown>; target: Extract<Target, { kind: "seo" }> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {(["ar", "en"] as const).map((lang) => {
        const title = str((doc.seo_title as Record<string, unknown>)?.[lang]) || target.defaults.title[lang];
        const description = str((doc.seo_description as Record<string, unknown>)?.[lang]) || target.defaults.description[lang];
        const fill = (text: string) => text.replaceAll("{doctorName}", target.siteName[lang]);
        const full = fill(target.path === "/" ? title : `${title} | ${target.siteName[lang]}`);
        return (
          <div key={lang} className="rounded-xl border border-line bg-white p-3" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
            <p className="truncate text-xs text-[#4d5156]" dir="ltr">
              {siteConfig.url}/{lang}
              {target.path === "/" ? "" : target.path}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[1.05rem] text-[#1a0dab]">{full}</p>
            <p className="mt-0.5 line-clamp-2 text-[0.82rem] text-[#4d5156]">{fill(description)}</p>
            {full.length > 65 && <p className="mt-1 text-[0.7rem] text-amber-700">Long titles are cut off in search results (~60 characters).</p>}
          </div>
        );
      })}
    </div>
  );
}

export function DocForm({ target, initialDoc, media }: { target: Target; initialDoc: Record<string, unknown>; media: MediaMap }) {
  const router = useRouter();
  const toast = useToast();
  const form = useDocForm<Record<string, unknown>>(initialDoc);
  const fields: Field[] = target.kind === "settings" ? settingsGroups.flatMap((g) => g.fields) : pageSeoFields;
  const setState = form.setDoc;
  const onChange = useCallback((updater: (d: Record<string, unknown>) => Record<string, unknown>) => setState(updater), [setState]);

  const save = async () => {
    if (form.saving) return;
    const errors = validateDoc(fields, pruneDoc(fields, form.doc));
    if (errors.length) {
      form.setErrors(errors);
      toast("error", "Please correct the highlighted fields.");
      focusFirstError();
      return;
    }
    form.setSaving(true);
    const result = target.kind === "settings" ? await saveSettings(form.doc) : await savePageSeo(target.page, form.doc);
    form.setSaving(false);
    if (!result.ok) {
      form.setErrors(result.fieldErrors ?? []);
      toast("error", result.error);
      if (result.fieldErrors?.length) focusFirstError();
      return;
    }
    form.markSaved(form.doc);
    toast("success", "Saved — the website is updated.");
    router.refresh();
  };

  return (
    <FormProvider doc={form.doc} onChange={onChange} errors={form.errors} media={media}>
      {target.kind === "settings" ? (
        <>
          <div className="mb-5">
            <LangSwitch />
          </div>
          <div className="grid grid-cols-1 gap-6">
            {settingsGroups.map((group) => (
              <section key={group.title} className="adm-card p-5 sm:p-6" aria-labelledby={`group-${slug(group.title)}`}>
                <h2 id={`group-${slug(group.title)}`} className="text-base font-bold">
                  {group.title}
                </h2>
                {group.description && <p className="mb-4 mt-1 text-sm text-muted">{group.description}</p>}
                <div className={group.description ? "" : "mt-4"}>
                  <FieldList fields={group.fields} path={[]} />
                </div>
              </section>
            ))}
          </div>
          <SaveBar dirty={form.dirty} saving={form.saving} onSave={save} onReset={form.reset} />
        </>
      ) : (
        <div className="grid gap-5">
          <SearchPreview doc={form.doc} target={target} />
          <FieldList fields={pageSeoFields} path={[]} />
          <div className="flex items-center justify-end gap-3">
            <span className={`text-sm ${form.dirty ? "font-semibold text-amber-700" : "text-muted"}`} role="status">
              {form.saving ? "Saving…" : form.dirty ? "Unsaved changes" : ""}
            </span>
            {form.dirty && (
              <button type="button" className="adm-btn adm-btn-ghost" onClick={form.reset}>
                Discard
              </button>
            )}
            <button type="button" className="adm-btn adm-btn-primary" onClick={save} disabled={!form.dirty || form.saving}>
              Save SEO
            </button>
          </div>
        </div>
      )}
    </FormProvider>
  );
}
