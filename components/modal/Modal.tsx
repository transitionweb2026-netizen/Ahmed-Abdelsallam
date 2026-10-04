"use client";

import { X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDictionary } from "@/components/i18n/LocaleProvider";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useIsClient, useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/utils";
import styles from "./Modal.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog (usually its heading). */
  labelledBy: string;
  describedBy?: string;
  size?: "md" | "lg" | "xl";
  /** Accessible name of the close button (default: the dictionary's "close"). */
  closeLabel?: string;
  /** Focus target after closing when the opener is gone (e.g. deep links). */
  returnFocus?: () => HTMLElement | null | undefined;
  /** Scrolls the content back to the top whenever this value changes. */
  contentKey?: string;
  className?: string;
  children: ReactNode;
}

/**
 * The site's one dialog implementation (services, conditions, articles,
 * videos). A centred liquid-glass panel on desktop and a bottom sheet on
 * phones, portalled to <body>:
 * - aria-modal dialog labelled by its heading; the page behind is `inert`
 * - focus moves in on open, Tab is trapped, focus returns to the opener
 * - Escape, the close button and the backdrop all close it
 * - page scroll is locked while the content area scrolls on its own
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  describedBy,
  size = "lg",
  closeLabel,
  returnFocus,
  contentKey,
  className,
  children,
}: ModalProps) {
  const t = useDictionary();
  const isClient = useIsClient();
  const sheet = useMediaQuery("(max-width: 639px)");
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const pressedOutside = useRef(false);

  // Latest callbacks, read by the long-lived open/close effect.
  const onCloseRef = useRef(onClose);
  const returnFocusRef = useRef(returnFocus);
  useEffect(() => {
    onCloseRef.current = onClose;
    returnFocusRef.current = returnFocus;
  });

  useScrollLock(open);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open || !isClient) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Everything outside the dialog becomes non-interactive and hidden
    // from assistive technology.
    const inerted: HTMLElement[] = [];
    for (const el of Array.from(document.body.children)) {
      if (el instanceof HTMLElement && el !== rootRef.current && !el.inert && el.tagName !== "SCRIPT") {
        el.inert = true;
        inerted.push(el);
      }
    }

    // Children may already have placed focus (e.g. an autoplaying video).
    const dialog = dialogRef.current;
    if (dialog && !dialog.contains(document.activeElement)) dialog.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        onCloseRef.current();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      inerted.forEach((el) => {
        el.inert = false;
      });
      const target =
        opener && opener.isConnected && opener !== document.body ? opener : returnFocusRef.current?.();
      target?.focus({ preventScroll: opener === target });
    };
  }, [open, isClient]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [contentKey]);

  if (!isClient) return null;

  // Close on a click that both starts and ends on the backdrop area, so
  // selecting text inside the dialog and releasing outside never closes it.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pressedOutside.current = event.target === event.currentTarget;
  };
  const onViewportClick = (event: MouseEvent<HTMLDivElement>) => {
    if (pressedOutside.current && event.target === event.currentTarget) onClose();
    pressedOutside.current = false;
  };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div ref={rootRef} key="modal" className={styles.root}>
          <m.div
            className={styles.backdrop}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          />
          <div className={styles.viewport} onPointerDown={onPointerDown} onClick={onViewportClick}>
            <m.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              aria-describedby={describedBy}
              tabIndex={-1}
              className={cn(styles.dialog, styles[size], className)}
              initial={sheet ? { y: "100%" } : { opacity: 0, y: 28, scale: 0.97 }}
              animate={sheet ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
              exit={sheet ? { y: "100%" } : { opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: sheet ? 0.5 : 0.45, ease: EASE }}
            >
              <span className={styles.handle} aria-hidden="true" />
              <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel ?? t.common.close}>
                <X size={20} strokeWidth={2.2} aria-hidden="true" />
              </button>
              <div ref={bodyRef} className={styles.body}>
                {children}
              </div>
            </m.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
