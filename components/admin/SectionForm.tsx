"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { saveSection } from "@/app/admin/_actions/content";
import type { MediaMap, SlotValue, VideoOption } from "@/lib/cms/admin/types";
import { missingTranslations, pruneDoc, validateDoc } from "@/lib/cms/fields";
import { sectionTypes, type SlotDef } from "@/lib/cms/registry";
import type { SectionType } from "@/lib/cms/section-docs";
import { useToast } from "./Feedback";
import { FieldList, FieldShell } from "./form/FieldEditor";
import { focusFirstError, FormProvider, LangSwitch, useErrors, useFormApi } from "./form/FormContext";
import { SaveBar, useDocForm } from "./form/useDocForm";
import { MediaField } from "./media/MediaField";

type Slots = Record<string, SlotValue | null>;
type State = { content: Record<string, unknown>; slots: Slots; videoId: string | null };

const POSITIONS = ["center", "center top", "center 20%", "center 30%", "center bottom", "left center", "right center"];

function SlotEditor({ slot, slotKey, value, onChange, english }: { slot: SlotDef; slotKey: string; value: SlotValue | null; onChange: (v: SlotValue | null) => void; english?: boolean }) {
  const { media } = useFormApi();
  const errors = useErrors(["slots", slotKey]);
  const item = value ? media[value.media_id] : undefined;
  const set = (patch: Partial<SlotValue>) => value && onChange({ ...value, ...patch });
  return (
    <FieldShell label={english ? `${slot.label} — English page` : slot.label} help={english ? "Shown on the English page instead of the image above." : slot.help} required={slot.required && !english} errors={errors}>
      <MediaField
        kind="image"
        label={slot.label}
        value={value?.media_id ?? null}
        required={slot.required && !english}
        invalid={errors.length > 0}
        onChange={(id) => onChange(id ? { media_id: id, object_position: value?.object_position ?? null, alt_ar: value?.alt_ar ?? null, alt_en: value?.alt_en ?? null } : null)}
      />
      {value && (
        <div className="grid gap-3 sm:grid-cols-2">
          {slot.position && (
            <label className="grid gap-1">
              <span className="adm-label">Focal point</span>
              <input
                list={`positions-${slotKey}`}
                value={value.object_position ?? ""}
                onChange={(e) => set({ object_position: e.target.value || null })}
                placeholder="center"
                dir="ltr"
                className="adm-input font-mono text-[0.82rem]"
              />
              <datalist id={`positions-${slotKey}`}>
                {POSITIONS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
              <span className="adm-help">Which part stays visible when the image is cropped, e.g. “center 30%”.</span>
            </label>
          )}
          <details className="sm:col-span-2" open={Boolean(value.alt_ar || value.alt_en)}>
            <summary className="text-sm font-medium text-muted">Alt text for this use (optional)</summary>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <label className="grid gap-1" lang="ar">
                <span className="adm-lang justify-self-start">العربية</span>
                <input dir="rtl" value={value.alt_ar ?? ""} onChange={(e) => set({ alt_ar: e.target.value || null })} maxLength={400} placeholder={item?.alt_ar || "Same as the media library"} className="adm-input" aria-label="Alt text for this use (Arabic)" />
              </label>
              <label className="grid gap-1" lang="en">
                <span className="adm-lang justify-self-start">English</span>
                <input dir="ltr" value={value.alt_en ?? ""} onChange={(e) => set({ alt_en: e.target.value || null })} maxLength={400} placeholder={item?.alt_en || "Same as the media library"} className="adm-input" aria-label="Alt text for this use (English)" />
              </label>
              <p className="adm-help sm:col-span-2">Leave empty to use the image&apos;s own description from the media library.</p>
            </div>
          </details>
        </div>
      )}
    </FieldShell>
  );
}

export function SectionForm({
  pageKey,
  sectionKey,
  type,
  initial,
  media,
  videoOptions,
}: {
  pageKey: string;
  sectionKey: string;
  type: SectionType;
  initial: State;
  media: MediaMap;
  videoOptions: VideoOption[];
}) {
  const def = sectionTypes[type];
  const router = useRouter();
  const toast = useToast();
  const form = useDocForm<State>(initial);
  const { content, slots, videoId } = form.doc;
  const setState = form.setDoc;
  const setContent = useCallback((updater: (d: Record<string, unknown>) => Record<string, unknown>) => setState((s) => ({ ...s, content: updater(s.content) })), [setState]);
  const setSlot = (key: string, value: SlotValue | null) => setState((s) => ({ ...s, slots: { ...s.slots, [key]: value } }));
  const missing = missingTranslations(def.fields, content);

  const save = async () => {
    if (form.saving) return;
    const errors = validateDoc(def.fields, pruneDoc(def.fields, content));
    for (const slot of def.slots ?? []) if (slot.required && !slots[slot.key]) errors.push({ path: `slots.${slot.key}`, message: `${slot.label}: an image is required.` });
    if (errors.length) {
      form.setErrors(errors);
      toast("error", "Please correct the highlighted fields.");
      focusFirstError();
      return;
    }
    form.setSaving(true);
    const result = await saveSection(pageKey, sectionKey, { doc: content, slots, videoId: def.video ? videoId : undefined });
    form.setSaving(false);
    if (!result.ok) {
      form.setErrors(result.fieldErrors ?? []);
      toast("error", result.error);
      if (result.fieldErrors?.length) focusFirstError();
      return;
    }
    form.markSaved(form.doc);
    toast("success", "Saved — the page is updated in both languages.");
    router.refresh();
  };

  return (
    <FormProvider doc={content} onChange={setContent} errors={form.errors} media={media}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <LangSwitch />
        {missing.length > 0 && <span className="adm-badge adm-badge-amber">{missing.length} text{missing.length === 1 ? "" : "s"} in one language only</span>}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {(def.slots?.length || def.video) && (
          <section className="adm-card grid grid-cols-1 gap-5 p-5 sm:p-6" aria-label="Images and video">
            <h2 className="text-sm font-bold">{def.video && !def.slots?.length ? "Video" : "Images"}</h2>
            {def.slots?.map((slot) => (
              <div key={slot.key} className="grid gap-4">
                <SlotEditor slot={slot} slotKey={slot.key} value={slots[slot.key] ?? null} onChange={(v) => setSlot(slot.key, v)} />
                {slot.englishOverride && (
                  <div className="grid gap-3 border-s-2 border-line ps-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(slots[`${slot.key}En`])}
                        onChange={(e) => setSlot(`${slot.key}En`, e.target.checked && slots[slot.key] ? { ...slots[slot.key]! } : null)}
                        disabled={!slots[slot.key]}
                      />
                      Use a different image on the English page
                    </label>
                    {slots[`${slot.key}En`] && <SlotEditor slot={slot} slotKey={`${slot.key}En`} value={slots[`${slot.key}En`] ?? null} onChange={(v) => setSlot(`${slot.key}En`, v)} english />}
                  </div>
                )}
              </div>
            ))}
            {def.video && (
              <FieldShell label="Video" help="Videos are managed under Videos (files, posters, subtitles per language)." errors={[]} htmlFor="section-video">
                <select id="section-video" value={videoId ?? ""} onChange={(e) => setState((s) => ({ ...s, videoId: e.target.value || null }))} className="adm-input max-w-md">
                  <option value="">— No video —</option>
                  {videoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                      {option.status === "draft" ? " (draft — not shown)" : ""}
                    </option>
                  ))}
                </select>
              </FieldShell>
            )}
          </section>
        )}

        {def.fields.length > 0 && (
          <section className="adm-card p-5 sm:p-6" aria-label="Text">
            <FieldList fields={def.fields} path={[]} />
          </section>
        )}
      </div>

      <SaveBar dirty={form.dirty} saving={form.saving} onSave={save} onReset={form.reset} />
    </FormProvider>
  );
}
