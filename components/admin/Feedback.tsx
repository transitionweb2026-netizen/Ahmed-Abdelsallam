"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/* ---- Toasts ------------------------------------------------------------------- */

type Toast = { id: number; kind: "success" | "error" | "info"; message: string };
type ToastApi = (kind: Toast["kind"], message: string) => void;

const ToastContext = createContext<ToastApi>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

/* ---- Confirmation dialog -------------------------------------------------------- */

export interface ConfirmOptions {
  title: string;
  body?: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
}

type ConfirmApi = (options: ConfirmOptions) => Promise<boolean>;
const ConfirmContext = createContext<ConfirmApi>(async () => false);

/** `if (await confirm({ title: "Delete?", danger: true })) …` */
export function useConfirm() {
  return useContext(ConfirmContext);
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pending, setPending] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);

  const push = useCallback<ToastApi>((kind, message) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, kind, message }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), kind === "error" ? 8000 : 3500);
  }, []);

  const confirm = useCallback<ConfirmApi>((options) => new Promise((resolve) => setPending({ ...options, resolve })), []);

  const close = (ok: boolean) => {
    pending?.resolve(ok);
    setPending(null);
  };

  return (
    <ToastContext.Provider value={push}>
      <ConfirmContext.Provider value={confirm}>
        {children}
        <Dialog
          open={Boolean(pending)}
          onClose={() => close(false)}
          title={pending?.title ?? ""}
          footer={
            <>
              <button type="button" className="adm-btn adm-btn-secondary" onClick={() => close(false)}>
                Cancel
              </button>
              <button type="button" className={`adm-btn ${pending?.danger ? "adm-btn-danger-solid" : "adm-btn-primary"}`} onClick={() => close(true)} autoFocus>
                {pending?.confirmLabel ?? "Confirm"}
              </button>
            </>
          }
        >
          {pending?.body && <div className="text-sm leading-relaxed text-[#3a4472]">{pending.body}</div>}
        </Dialog>
        <div aria-live="polite" className="pointer-events-none fixed inset-x-3 bottom-3 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-5 sm:bottom-5 sm:items-end">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role={toast.kind === "error" ? "alert" : "status"}
              className={`pointer-events-auto flex max-w-sm animate-[adm-slide-in_0.25s_ease-out] items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
                toast.kind === "error" ? "bg-red-700 text-white" : toast.kind === "success" ? "bg-brand-dark text-white" : "bg-white text-ink ring-1 ring-black/10"
              }`}
            >
              {toast.kind === "error" ? <XCircle size={18} className="mt-px flex-none" aria-hidden /> : toast.kind === "success" ? <CheckCircle2 size={18} className="mt-px flex-none" aria-hidden /> : <Info size={18} className="mt-px flex-none" aria-hidden />}
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}

/* ---- Dialog ----------------------------------------------------------------------- */

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "lg" | "xl";
};

/** Native <dialog> modal: focus trap, Escape and backdrop click to close. */
export function Dialog({ open, onClose, title, children, footer, size = "sm" }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && dialog && !dialog.open) dialog.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  if (!open) return null;
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
      className={`m-auto w-[calc(100%-1.5rem)] rounded-2xl bg-white p-0 text-ink shadow-2xl backdrop:bg-[#0b1233]/45 ${size === "xl" ? "max-w-6xl" : size === "lg" ? "max-w-3xl" : "max-w-md"}`}
    >
      <div className="flex max-h-[88dvh] flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="text-base font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="adm-btn adm-btn-ghost adm-btn-icon">
            <X size={18} aria-hidden />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">{footer}</footer>}
      </div>
    </dialog>
  );
}

/* ---- Unsaved changes ---------------------------------------------------------------- */

const LEAVE_MESSAGE = "You have unsaved changes. Leave this page without saving?";

/**
 * Warns before leaving a form with unsaved changes: closing or reloading
 * the tab, and following links inside the dashboard.
 */
export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    // Capture phase on document runs before Next.js <Link> handles the click.
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      if (!window.confirm(LEAVE_MESSAGE)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", click, true);
    };
  }, [dirty]);
}

/* ---- Small controls ------------------------------------------------------------------ */

export function Switch({ checked, onChange, label, disabled, id }: { checked: boolean; onChange: (value: boolean) => void; label: string; disabled?: boolean; id?: string }) {
  return (
    <button type="button" id={id} role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)} className="adm-switch disabled:opacity-50">
      <span />
    </button>
  );
}

export function StatusBadge({ status }: { status: "draft" | "published" | "hidden" | "visible" | string }) {
  const map: Record<string, [string, string]> = {
    published: ["adm-badge-green", "Published"],
    visible: ["adm-badge-green", "Visible"],
    draft: ["adm-badge-amber", "Draft"],
    hidden: ["adm-badge-gray", "Hidden"],
  };
  const [cls, label] = map[status] ?? ["adm-badge-gray", status];
  return <span className={`adm-badge ${cls}`}>{label}</span>;
}
