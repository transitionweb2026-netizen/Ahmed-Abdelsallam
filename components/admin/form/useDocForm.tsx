"use client";

import { Loader2, RotateCcw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { FieldError } from "@/lib/cms/fields";
import { useUnsavedChanges } from "../Feedback";

/** Stable comparison of two JSON documents (key order ignored). */
function canonical(value: unknown): string {
  return JSON.stringify(value, (_, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(
          Object.keys(v)
            .filter((k) => v[k] !== undefined)
            .sort()
            .map((k) => [k, v[k]]),
        )
      : v,
  );
}

/** Form state with a saved baseline: dirty tracking, errors and the leave-page warning. */
export function useDocForm<T>(initial: T) {
  const [doc, setDocState] = useState<T>(initial);
  const [base, setBase] = useState<string>(() => canonical(initial));
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [saving, setSaving] = useState(false);
  const dirty = useMemo(() => canonical(doc) !== base, [doc, base]);
  useUnsavedChanges(dirty);

  const setDoc = useCallback((updater: (doc: T) => T) => setDocState((current) => updater(current)), []);
  const markSaved = useCallback((saved: T) => {
    setBase(canonical(saved));
    setErrors([]);
  }, []);
  const reset = useCallback(() => {
    setDocState(JSON.parse(base) as T);
    setErrors([]);
  }, [base]);
  return { doc, setDoc, setDocState, dirty, errors, setErrors, saving, setSaving, markSaved, reset };
}

/** Sticky bar with the save button; Ctrl/⌘ + S saves. */
export function SaveBar({
  dirty,
  saving,
  onSave,
  onReset,
  extra,
  label = "Save changes",
  variant = "page",
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onReset?: () => void;
  extra?: ReactNode;
  label?: string;
  /** "card": at the bottom of a card (several forms on one page). */
  variant?: "page" | "card";
}) {
  const latest = useRef({ onSave, dirty, saving });
  useEffect(() => {
    latest.current = { onSave, dirty, saving };
  }, [onSave, dirty, saving]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        // Only forms with changes save (a page can hold several forms).
        if (latest.current.dirty && !latest.current.saving) latest.current.onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div
      className={`sticky bottom-0 z-30 border-t border-line bg-white/95 py-3 backdrop-blur ${
        variant === "card" ? "-mx-5 -mb-5 mt-5 rounded-b-2xl px-5 sm:-mx-6 sm:-mb-6 sm:px-6" : "-mx-4 mt-8 px-4 sm:-mx-6 sm:px-6"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className={`text-sm ${dirty ? "font-semibold text-amber-700" : "text-muted"}`} role="status">
          {saving ? "Saving…" : dirty ? "Unsaved changes" : "All changes saved"}
        </span>
        {extra}
        <div className="ms-auto flex gap-2">
          {onReset && dirty && (
            <button type="button" className="adm-btn adm-btn-ghost" onClick={onReset} disabled={saving}>
              <RotateCcw size={15} aria-hidden /> Discard
            </button>
          )}
          <button type="button" className="adm-btn adm-btn-primary" onClick={onSave} disabled={saving || !dirty}>
            {saving ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Save size={15} aria-hidden />}
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
