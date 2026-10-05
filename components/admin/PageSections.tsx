"use client";

import { ArrowDown, ArrowUp, Lock, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { reorderSections, setSectionVisible } from "@/app/admin/_actions/content";
import { StatusBadge, Switch, useToast } from "./Feedback";

export interface SectionListItem {
  key: string;
  label: string;
  typeLabel: string;
  visible: boolean;
  pinned: boolean;
  required: boolean;
  copyOnly: boolean;
  missing: number;
  saved: boolean;
}

/** A page's sections in website order: reorder, show/hide, edit. */
export function PageSections({ pageKey, items: initial }: { pageKey: string; items: SectionListItem[] }) {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState(false);
  const blocks = items.filter((item) => !item.copyOnly);
  const movable = blocks.filter((item) => !item.pinned);
  const copy = items.filter((item) => item.copyOnly);

  const move = async (key: string, delta: -1 | 1) => {
    const order = movable.map((item) => item.key);
    const from = order.indexOf(key);
    const to = from + delta;
    if (to < 0 || to >= order.length) return;
    order.splice(to, 0, order.splice(from, 1)[0]);
    const previous = items;
    setItems([...items.filter((i) => i.pinned), ...order.map((k) => items.find((i) => i.key === k)!), ...copy]);
    setBusy(true);
    const result = await reorderSections(pageKey, order);
    setBusy(false);
    if (!result.ok) {
      setItems(previous);
      toast("error", result.error);
    } else {
      toast("success", "Order saved — the page is updated.");
      router.refresh();
    }
  };

  const toggle = async (key: string, visible: boolean) => {
    setItems((list) => list.map((i) => (i.key === key ? { ...i, visible } : i)));
    const result = await setSectionVisible(pageKey, key, visible);
    if (!result.ok) {
      setItems((list) => list.map((i) => (i.key === key ? { ...i, visible: !visible } : i)));
      return toast("error", result.error);
    }
    toast("success", visible ? "Section shown on the website." : "Section hidden from the website.");
    router.refresh();
  };

  const row = (item: SectionListItem, index: number) => (
    <li key={item.key} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap">
      {!item.copyOnly && (
        <div className="flex w-8 flex-none flex-col items-center">
          {item.pinned ? (
            <Lock size={14} className="text-muted" aria-label="Always first" />
          ) : (
            <>
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon h-6 min-h-0" disabled={busy || index === 0} onClick={() => move(item.key, -1)} aria-label={`Move ${item.label} up`}>
                <ArrowUp size={14} aria-hidden />
              </button>
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-icon h-6 min-h-0" disabled={busy || index === movable.length - 1} onClick={() => move(item.key, 1)} aria-label={`Move ${item.label} down`}>
                <ArrowDown size={14} aria-hidden />
              </button>
            </>
          )}
        </div>
      )}
      <Link href={`/admin/pages/${pageKey}/${item.key}`} className="grid min-w-0 flex-1 gap-0.5 hover:text-brand">
        <span className="truncate text-sm font-semibold">{item.label}</span>
        <span className="truncate text-xs text-muted">{item.typeLabel}</span>
      </Link>
      <div className="flex flex-none flex-wrap items-center gap-2">
        {!item.saved && <span className="adm-badge adm-badge-gray">Default content</span>}
        {item.missing > 0 && <span className="adm-badge adm-badge-amber">{item.missing} untranslated</span>}
        {!item.copyOnly && <StatusBadge status={item.visible ? "visible" : "hidden"} />}
        {!item.copyOnly && !item.required && item.saved && <Switch checked={item.visible} onChange={(v) => toggle(item.key, v)} label={`Show ${item.label}`} />}
        <Link href={`/admin/pages/${pageKey}/${item.key}`} className="adm-btn adm-btn-secondary adm-btn-sm">
          <Pencil size={14} aria-hidden /> Edit
        </Link>
      </div>
    </li>
  );

  return (
    <div className="grid gap-6">
      {blocks.length > 0 && (
        <section className="adm-card overflow-hidden" aria-labelledby="blocks-title">
          <h2 id="blocks-title" className="border-b border-line px-4 py-3 text-sm font-bold">
            Sections, in website order
          </h2>
          <ul className="divide-y divide-[#eef0f8]">{blocks.map((item) => row(item, movable.indexOf(item)))}</ul>
        </section>
      )}
      {copy.length > 0 && (
        <section className="adm-card overflow-hidden" aria-labelledby="copy-title">
          <h2 id="copy-title" className="border-b border-line px-4 py-3 text-sm font-bold">
            {blocks.length ? "Other text on this page" : "Blocks"}
          </h2>
          <ul className="divide-y divide-[#eef0f8]">{copy.map((item, i) => row(item, i))}</ul>
        </section>
      )}
    </div>
  );
}
