/**
 * Interface strings (i18n/dictionary.ts) as flat CMS rows: "header.book",
 * "articles.readingTime.few" … Navigation labels are managed with the
 * navigation items instead, so `nav.*` is not part of this table.
 */
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale, UiStringRow } from "@/lib/cms/types";

type Tree = { [key: string]: string | Tree };

const EXCLUDED_ROOTS = new Set(["nav"]);

export function flattenDictionary(dictionary: Dictionary): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (node: Tree, prefix: string) => {
    for (const [key, value] of Object.entries(node)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (!prefix && EXCLUDED_ROOTS.has(key)) continue;
      if (typeof value === "string") out[path] = value;
      else walk(value, path);
    }
  };
  walk(dictionary as unknown as Tree, "");
  return out;
}

/**
 * The dictionary for one language: the bundled strings, with every
 * non-empty CMS value laid over them. Keys the code no longer uses are
 * ignored; an emptied value falls back to the bundled default.
 */
export function buildDictionary(locale: Locale, rows: UiStringRow[], navLabels: Record<string, string>, fallback: Dictionary): Dictionary {
  const result = structuredClone(fallback) as unknown as Tree;
  for (const row of rows) {
    const value = locale === "ar" ? row.value_ar : row.value_en;
    if (!value) continue;
    const parts = row.key.split(".");
    if (EXCLUDED_ROOTS.has(parts[0])) continue;
    let node: Tree | string | undefined = result;
    for (const part of parts.slice(0, -1)) {
      node = typeof node === "object" ? node[part] : undefined;
    }
    const leaf = parts[parts.length - 1];
    // Only replace strings that exist, or add plural forms next to existing ones.
    if (typeof node === "object" && (typeof node[leaf] === "string" || (node[leaf] === undefined && "other" in node))) {
      node[leaf] = value;
    }
  }
  const nav = (result.nav ?? {}) as Tree;
  for (const key of Object.keys(nav)) {
    if (navLabels[key]) nav[key] = navLabels[key];
  }
  return result as unknown as Dictionary;
}

/** Human group name for the dashboard, from the key's first segment. */
export const uiStringGroups: Record<string, string> = {
  skipToContent: "Accessibility",
  header: "Header and menu",
  language: "Language switch",
  common: "Shared labels",
  socials: "Social networks",
  footer: "Footer",
  cards: "Cards",
  video: "Video player",
  timeline: "Timelines",
  reviews: "Reviews",
  articles: "Articles",
  about: "About page",
  contact: "Contact page",
  form: "Form validation messages",
  notFound: "Page not found (404)",
};
