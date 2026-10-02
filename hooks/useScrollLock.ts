import { useEffect } from "react";

// Reference-counted so overlapping overlays (drawer → dialog) never unlock
// the page early or restore a stale value.
let locks = 0;
let previous = { overflow: "", scrollbarGutter: "" };

/**
 * Locks page scrolling while `active` is true. Where the page shows a
 * classic scrollbar, its gutter is kept reserved during the lock so the
 * layout does not jump sideways when the scrollbar disappears.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    if (locks === 0) {
      previous = { overflow: root.style.overflow, scrollbarGutter: root.style.scrollbarGutter };
      const hasScrollbar = window.innerWidth - root.clientWidth > 0;
      if (hasScrollbar) root.style.scrollbarGutter = "stable";
      root.style.overflow = "hidden";
    }
    locks += 1;
    return () => {
      locks -= 1;
      if (locks === 0) {
        root.style.overflow = previous.overflow;
        root.style.scrollbarGutter = previous.scrollbarGutter;
      }
    };
  }, [active]);
}
