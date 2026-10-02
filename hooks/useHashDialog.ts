import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

/** Fired after this hook changes the URL, since pushState emits no event. */
const HASH_EVENT = "site:hash";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener(HASH_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(HASH_EVENT, onChange);
  };
}

const readHash = () => decodeURIComponent(window.location.hash.slice(1));
const serverHash = () => "";
const notify = () => window.dispatchEvent(new Event(HASH_EVENT));

/**
 * Dialog selection stored in the URL hash (e.g. `/services#fractures`).
 * Shared links and cross-page links open the matching dialog, opening
 * pushes a history entry so the browser Back button closes it, and
 * closing restores the plain URL.
 */
export function useHashDialog(ids: readonly string[]) {
  const hash = useSyncExternalStore(subscribe, readHash, serverHash);
  const activeId = hash && ids.includes(hash) ? hash : null;
  // True while the open dialog owns a history entry we pushed.
  const pushed = useRef(false);

  // Closed some other way (Back button, link): forget the entry.
  useEffect(() => {
    if (!activeId) pushed.current = false;
  }, [activeId]);

  const open = useCallback((id: string) => {
    window.history.pushState(null, "", `#${encodeURIComponent(id)}`);
    pushed.current = true;
    notify();
  }, []);

  /** Switches the open dialog to another item without adding history. */
  const select = useCallback((id: string) => {
    window.history.replaceState(null, "", `#${encodeURIComponent(id)}`);
    notify();
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
      return;
    }
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    notify();
  }, []);

  return { activeId, open, select, close };
}
