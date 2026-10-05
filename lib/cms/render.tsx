import { Fragment, type ReactNode } from "react";
import { pageDef } from "@/lib/cms/pages";

/** Anchor of the first visible section after the hero (the hero's scroll cue target). */
export function scrollTargetAfterHero(page: string, order: string[]): string | undefined {
  const sections = pageDef(page)?.sections ?? [];
  for (const key of order) {
    if (key === "hero") continue;
    const anchor = sections.find((section) => section.key === key)?.anchor;
    if (anchor) return `#${anchor}`;
  }
  return undefined;
}

/**
 * Renders a page's sections in the order (and with the visibility) set in
 * the CMS. Hidden sections are simply not rendered: every section carries
 * its own spacing, so no gap is left behind.
 */
export function renderSections(order: string[], renderers: Record<string, (() => ReactNode) | undefined>): ReactNode {
  return order.map((key) => <Fragment key={key}>{renderers[key]?.()}</Fragment>);
}
