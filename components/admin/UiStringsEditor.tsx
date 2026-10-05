"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { saveUiStrings } from "@/app/admin/_actions/content";
import { useToast } from "./Feedback";
import { SaveBar, useDocForm } from "./form/useDocForm";

export interface UiStringItem {
  key: string;
  group: string;
  defaultAr: string;
  defaultEn: string;
}

type Values = Record<string, { ar: string; en: string }>;

/**
 * Short texts of the interface (buttons, labels, accessible names, form
 * messages). An empty value uses the built-in wording.
 */
export function UiStringsEditor({ items, initial, initialQuery }: { items: UiStringItem[]; initial: Values; initialQuery: string }) {
  const router = useRouter();
  const toast = useToast();
  const form = useDocForm<Values>(initial);
  const [query, setQuery] = useState(initialQuery);
  const [group, setGroup] = useState("all");
  const [changedOnly, setChangedOnly] = useState(false);
  const groups = useMemo(() => [...new Set(items.map((i) => i.group))], [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (group !== "all" && item.group !== group) return false;
      const value = form.doc[item.key] ?? { ar: "", en: "" };
      // Customised = differs from the built-in wording (an empty value uses it).
      if (changedOnly && (value.ar || item.defaultAr) === item.defaultAr && (value.en || item.defaultEn) === item.defaultEn) return false;
      return !q || [item.key, item.defaultAr, item.defaultEn, value.ar, value.en].some((v) => v.toLowerCase().includes(q));
    });
  }, [items, group, query, changedOnly, form.doc]);

  const save = async () => {
    const changed = Object.keys(form.doc).filter((key) => JSON.stringify(form.doc[key]) !== JSON.stringify(initial[key] ?? { ar: "", en: "" }));
    form.setSaving(true);
    const result = await saveUiStrings(changed.map((key) => ({ key, value_ar: form.doc[key].ar, value_en: form.doc[key].en })));
    form.setSaving(false);
    if (!result.ok) return toast("error", result.fieldErrors?.[0]?.message ?? result.error);
    form.markSaved(form.doc);
    toast("success", "Interface text saved.");
    router.refresh();
  };

  const set = (key: string, lang: "ar" | "en", text: string) => form.setDoc((values) => ({ ...values, [key]: { ...(values[key] ?? { ar: "", en: "" }), [lang]: text } }));

  return (
    <>
      <div className="adm-card mb-4 flex flex-wrap items-center gap-3 p-3">
        <label className="relative min-w-52 flex-1">
          <span className="sr-only">Search</span>
          <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search in both languages or by key" className="adm-input ps-9" />
        </label>
        <select value={group} onChange={(e) => setGroup(e.target.value)} className="adm-input w-auto" aria-label="Group">
          <option value="all">All groups</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={changedOnly} onChange={(e) => setChangedOnly(e.target.checked)} /> Customised only
        </label>
        <span className="text-xs text-muted">{visible.length} texts</span>
      </div>
      <ul className="adm-card divide-y divide-[#eef0f8]">
        {visible.slice(0, 300).map((item) => {
          const value = form.doc[item.key] ?? { ar: "", en: "" };
          return (
            <li key={item.key} className="grid gap-2 p-3 md:grid-cols-[14rem_1fr_1fr] md:items-start">
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-semibold" title={item.key}>
                  {item.key}
                </p>
                <p className="text-[0.7rem] text-muted">{item.group}</p>
              </div>
              <label className="grid gap-1" lang="ar">
                <span className="adm-lang justify-self-start">العربية</span>
                <input dir="rtl" value={value.ar} maxLength={600} placeholder={item.defaultAr} onChange={(e) => set(item.key, "ar", e.target.value)} className="adm-input" aria-label={`${item.key} (Arabic)`} />
              </label>
              <label className="grid gap-1" lang="en">
                <span className="adm-lang justify-self-start">English</span>
                <input dir="ltr" value={value.en} maxLength={600} placeholder={item.defaultEn} onChange={(e) => set(item.key, "en", e.target.value)} className="adm-input" aria-label={`${item.key} (English)`} />
              </label>
            </li>
          );
        })}
        {visible.length > 300 && <li className="p-3 text-center text-sm text-muted">Showing the first 300 — refine the search to see more.</li>}
        {visible.length === 0 && <li className="p-6 text-center text-sm text-muted">No interface text matches.</li>}
      </ul>
      <SaveBar dirty={form.dirty} saving={form.saving} onSave={save} onReset={form.reset} />
    </>
  );
}
