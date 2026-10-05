"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveNavigation, saveSocials } from "@/app/admin/_actions/content";
import { isSafeHref, type FieldError } from "@/lib/cms/fields";
import { SOCIAL_PLATFORMS } from "@/lib/cms/registry";
import { Switch, useConfirm, useToast } from "./Feedback";
import { SaveBar, useDocForm } from "./form/useDocForm";

export interface NavItemState {
  id?: string;
  key: string;
  label: { ar: string; en: string };
  href: string;
  visible: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
}

export interface SocialState {
  platform: string;
  url: string;
  visible: boolean;
}

function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}

function Errors({ errors, prefix }: { errors: FieldError[]; prefix: string }) {
  const list = errors.filter((e) => e.path === prefix || e.path.startsWith(`${prefix}.`));
  if (!list.length) return null;
  return (
    <ul role="alert" className="grid gap-0.5 sm:col-span-full">
      {list.map((e) => (
        <li key={e.path + e.message} className="text-xs font-medium text-red-700">
          {e.message}
        </li>
      ))}
    </ul>
  );
}

export function NavigationEditor({ initial }: { initial: NavItemState[] }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const form = useDocForm<NavItemState[]>(initial);
  const items = form.doc;
  const update = (i: number, patch: Partial<NavItemState>) => form.setDoc((list) => list.map((item, j) => (j === i ? { ...item, ...patch } : item)));

  const save = async () => {
    form.setSaving(true);
    const result = await saveNavigation(items.map((item) => ({ id: item.id, key: item.key, doc: { label: item.label, href: item.href, visible: item.visible, show_in_header: item.show_in_header, show_in_footer: item.show_in_footer } })));
    form.setSaving(false);
    if (!result.ok) {
      form.setErrors(result.fieldErrors ?? []);
      return toast("error", result.fieldErrors?.[0]?.message ?? result.error);
    }
    form.markSaved(items);
    toast("success", "Menu saved — the header and footer are updated.");
    router.refresh();
  };

  return (
    <section className="adm-card p-5 sm:p-6" aria-labelledby="nav-title">
      <h2 id="nav-title" className="text-base font-bold">
        Main menu
      </h2>
      <p className="mb-4 mt-1 text-sm text-muted">Links in the header, the mobile menu and the footer, in this order.</p>
      <ol className="grid gap-3">
        {items.map((item, i) => (
          <li key={item.id ?? `new-${i}`} className="grid gap-3 rounded-xl border border-line bg-[#fbfcff] p-3 sm:grid-cols-[auto_1fr_1fr_1fr] sm:items-end">
            <div className="flex gap-0.5 sm:flex-col">
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" disabled={i === 0} onClick={() => form.setDoc((l) => move(l, i, i - 1))} aria-label={`Move ${item.label.en || item.key} up`}>
                <ArrowUp size={14} aria-hidden />
              </button>
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" disabled={i === items.length - 1} onClick={() => form.setDoc((l) => move(l, i, i + 1))} aria-label={`Move ${item.label.en || item.key} down`}>
                <ArrowDown size={14} aria-hidden />
              </button>
            </div>
            <label className="grid gap-1" lang="ar">
              <span className="adm-lang justify-self-start">العربية</span>
              <input dir="rtl" value={item.label.ar} maxLength={80} onChange={(e) => update(i, { label: { ...item.label, ar: e.target.value } })} className="adm-input" aria-label={`Menu item ${i + 1} label (Arabic)`} />
            </label>
            <label className="grid gap-1" lang="en">
              <span className="adm-lang justify-self-start">English</span>
              <input dir="ltr" value={item.label.en} maxLength={80} onChange={(e) => update(i, { label: { ...item.label, en: e.target.value } })} className="adm-input" aria-label={`Menu item ${i + 1} label (English)`} />
            </label>
            <label className="grid gap-1">
              <span className="adm-label">Link</span>
              <input dir="ltr" value={item.href} onChange={(e) => update(i, { href: e.target.value.trim() })} className="adm-input font-mono text-[0.82rem]" aria-invalid={!isSafeHref(item.href) || undefined} aria-label={`Menu item ${i + 1} link`} />
            </label>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:col-span-full sm:ps-10">
              {item.id ? (
                <span className="font-mono text-xs text-muted">{item.key}</span>
              ) : (
                <label className="flex items-center gap-2">
                  <span className="text-xs text-muted">Identifier</span>
                  <input dir="ltr" value={item.key} onChange={(e) => update(i, { key: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className="adm-input w-36 py-1 font-mono text-xs" aria-label={`Menu item ${i + 1} identifier`} />
                </label>
              )}
              <label className="flex items-center gap-2">
                <Switch checked={item.visible} onChange={(v) => update(i, { visible: v })} label={`Show ${item.label.en || item.key}`} /> Visible
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={item.show_in_header} onChange={(v) => update(i, { show_in_header: v })} label={`${item.label.en || item.key} in the header`} /> Header & menu
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={item.show_in_footer} onChange={(v) => update(i, { show_in_footer: v })} label={`${item.label.en || item.key} in the footer`} /> Footer
              </label>
              <button
                type="button"
                className="adm-btn adm-btn-ghost adm-btn-sm ms-auto text-red-700"
                onClick={async () => {
                  if (await confirm({ title: `Remove “${item.label.en || item.key}” from the menu?`, body: "The page itself is not deleted. The change is applied when you save.", confirmLabel: "Remove", danger: true })) {
                    form.setDoc((l) => l.filter((_, j) => j !== i));
                  }
                }}
              >
                <Trash2 size={14} aria-hidden /> Remove
              </button>
            </div>
            <Errors errors={form.errors} prefix={String(i)} />
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="adm-btn adm-btn-secondary adm-btn-sm mt-3"
        onClick={() => form.setDoc((l) => [...l, { key: `link-${l.length + 1}`, label: { ar: "", en: "" }, href: "/", visible: true, show_in_header: true, show_in_footer: true }])}
      >
        <Plus size={14} aria-hidden /> Add menu item
      </button>
      <SaveBar dirty={form.dirty} saving={form.saving} onSave={save} onReset={form.reset} label="Save menu" variant="card" />
    </section>
  );
}

export function SocialsEditor({ initial }: { initial: SocialState[] }) {
  const router = useRouter();
  const toast = useToast();
  const form = useDocForm<SocialState[]>(initial);
  const items = form.doc;
  const used = new Set(items.map((i) => i.platform));
  const update = (i: number, patch: Partial<SocialState>) => form.setDoc((list) => list.map((item, j) => (j === i ? { ...item, ...patch } : item)));

  const save = async () => {
    form.setSaving(true);
    const result = await saveSocials(items);
    form.setSaving(false);
    if (!result.ok) {
      form.setErrors(result.fieldErrors ?? []);
      return toast("error", result.fieldErrors?.[0]?.message ?? result.error);
    }
    form.markSaved(items);
    toast("success", "Social links saved.");
    router.refresh();
  };

  return (
    <section className="adm-card p-5 sm:p-6" aria-labelledby="social-title">
      <h2 id="social-title" className="text-base font-bold">
        Social media
      </h2>
      <p className="mb-4 mt-1 text-sm text-muted">Shown in the footer and the contact page, and listed in the search-engine profile of the doctor. Use the full address of each real profile.</p>
      <ol className="grid gap-3">
        {items.map((item, i) => (
          <li key={i} className="grid gap-3 rounded-xl border border-line bg-[#fbfcff] p-3 sm:grid-cols-[auto_10rem_1fr_auto_auto] sm:items-center">
            <div className="flex gap-0.5">
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" disabled={i === 0} onClick={() => form.setDoc((l) => move(l, i, i - 1))} aria-label={`Move ${item.platform} up`}>
                <ArrowUp size={14} aria-hidden />
              </button>
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon" disabled={i === items.length - 1} onClick={() => form.setDoc((l) => move(l, i, i + 1))} aria-label={`Move ${item.platform} down`}>
                <ArrowDown size={14} aria-hidden />
              </button>
            </div>
            <select value={item.platform} onChange={(e) => update(i, { platform: e.target.value })} className="adm-input" aria-label={`Link ${i + 1} platform`}>
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p.value} value={p.value} disabled={p.value !== item.platform && used.has(p.value)}>
                  {p.label}
                </option>
              ))}
            </select>
            <input dir="ltr" type="url" value={item.url} onChange={(e) => update(i, { url: e.target.value.trim() })} placeholder="https://" className="adm-input font-mono text-[0.82rem]" aria-label={`Link ${i + 1} address`} />
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={item.visible} onChange={(v) => update(i, { visible: v })} label={`Show ${item.platform}`} /> Visible
            </label>
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon text-red-700" onClick={() => form.setDoc((l) => l.filter((_, j) => j !== i))} aria-label={`Remove ${item.platform}`}>
              <Trash2 size={15} aria-hidden />
            </button>
            <Errors errors={form.errors} prefix={String(i)} />
          </li>
        ))}
      </ol>
      {items.length < SOCIAL_PLATFORMS.length && (
        <button
          type="button"
          className="adm-btn adm-btn-secondary adm-btn-sm mt-3"
          onClick={() => form.setDoc((l) => [...l, { platform: SOCIAL_PLATFORMS.find((p) => !used.has(p.value))!.value, url: "", visible: true }])}
        >
          <Plus size={14} aria-hidden /> Add social link
        </button>
      )}
      <SaveBar dirty={form.dirty} saving={form.saving} onSave={save} onReset={form.reset} label="Save social links" variant="card" />
    </section>
  );
}
