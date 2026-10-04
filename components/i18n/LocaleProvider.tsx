"use client";

import { createContext, use, useMemo, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";

interface LocaleContextValue {
  locale: Locale;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Makes the active locale and its interface dictionary available to Client
 * Components. Set once in the root layout from the `[lang]` segment, so the
 * server and the browser always agree (no language detection on the client).
 */
export function LocaleProvider({ locale, t, children }: LocaleContextValue & { children: ReactNode }) {
  const value = useMemo(() => ({ locale, t }), [locale, t]);
  return <LocaleContext value={value}>{children}</LocaleContext>;
}

function useLocaleContext(): LocaleContextValue {
  const value = use(LocaleContext);
  if (!value) throw new Error("useLocale / useDictionary must be used inside <LocaleProvider>.");
  return value;
}

export function useLocale(): Locale {
  return useLocaleContext().locale;
}

export function useDictionary(): Dictionary {
  return useLocaleContext().t;
}
