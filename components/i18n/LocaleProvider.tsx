"use client";

import { createContext, use, useMemo, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import type { SiteData } from "@/lib/cms/source";

/** Site settings Client Components need (all serialisable). */
export type ClientSiteData = Pick<SiteData, "identity" | "contact" | "navigation" | "socials" | "bookingHref" | "logo">;

interface LocaleContextValue {
  locale: Locale;
  t: Dictionary;
  site: ClientSiteData;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Makes the active locale, its interface dictionary and the site settings
 * (from the CMS) available to Client Components. Set once in the root
 * layout from the `[lang]` segment, so the server and the browser always
 * agree (no language detection on the client).
 */
export function LocaleProvider({ locale, t, site, children }: LocaleContextValue & { children: ReactNode }) {
  const value = useMemo(() => ({ locale, t, site }), [locale, t, site]);
  return <LocaleContext value={value}>{children}</LocaleContext>;
}

function useLocaleContext(): LocaleContextValue {
  const value = use(LocaleContext);
  if (!value) throw new Error("useLocale / useDictionary / useSite must be used inside <LocaleProvider>.");
  return value;
}

export function useLocale(): Locale {
  return useLocaleContext().locale;
}

export function useDictionary(): Dictionary {
  return useLocaleContext().t;
}

export function useSite(): ClientSiteData {
  return useLocaleContext().site;
}
