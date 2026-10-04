"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { preload } from "react-dom";
import { useDictionary, useLocale } from "@/components/i18n/LocaleProvider";
import { fontPreloads } from "@/config/fonts";
import { isPagePath } from "@/config/routes";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localeSettings,
  locales,
  splitLocale,
  switchLocalePath,
  type Locale,
} from "@/i18n/config";
import { cn } from "@/lib/utils";
import styles from "./LanguageToggle.module.css";

/** Matches the thumb transition in LanguageToggle.module.css. */
const SLIDE_MS = 260;

// Keyboard switches return focus to the toggle on the new page (the header
// is re-mounted with the other language's root layout). Stored briefly in
// sessionStorage so it survives that re-mount.
const REFOCUS_KEY = "language-toggle-refocus";
const REFOCUS_WINDOW_MS = 5000;

function markRefocus() {
  try {
    sessionStorage.setItem(REFOCUS_KEY, String(Date.now()));
  } catch {
    // Storage unavailable (private mode): focus simply starts at the top.
  }
}

function consumeRefocus(): boolean {
  try {
    const at = Number(sessionStorage.getItem(REFOCUS_KEY));
    if (!at) return false;
    sessionStorage.removeItem(REFOCUS_KEY);
    return Date.now() - at < REFOCUS_WINDOW_MS;
  } catch {
    return false;
  }
}

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

/** Starts loading the other language's fonts as soon as the visitor reaches for the switch. */
function warmFonts(locale: Locale) {
  for (const href of fontPreloads[locale]) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
}

interface LanguageToggleProps {
  /** Larger touch targets (mobile drawer). */
  size?: "sm" | "md";
  /** Id of a visible label; without it the group is named by `t.language.label`. */
  labelledBy?: string;
  className?: string;
}

/**
 * AR | EN switch. The current language is plain text; the other one is a
 * real link to the same page in that language (works without JavaScript,
 * can be opened in a new tab). With JavaScript the thumb slides first, then
 * a client-side navigation swaps the content — no full reload — keeping the
 * scroll position, query and #section. The choice is saved in a cookie that
 * proxy.ts reads for unprefixed URLs.
 *
 * The other language's page (and fonts) load only when the visitor reaches
 * for the switch (hover, focus, touch), not with every page view.
 *
 * The order never mirrors (`dir="ltr"`), so the control stays put when the
 * page direction flips.
 */
export function LanguageToggle({ size = "sm", labelledBy, className }: LanguageToggleProps) {
  const locale = useLocale();
  const t = useDictionary();
  const pathname = usePathname();
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // Optimistic thumb position while the other language loads.
  const [pending, setPending] = useState<Locale | null>(null);
  const [lastLocale, setLastLocale] = useState(locale);
  if (locale !== lastLocale) {
    setLastLocale(locale);
    setPending(null);
  }
  const active = pending ?? locale;
  // On the 404 page the other language's URL is a 404 too: don't prefetch it.
  const prefetchable = isPagePath(splitLocale(pathname).path);

  const warm = (target: Locale, href: string) => {
    warmFonts(target);
    if (prefetchable) router.prefetch(href);
  };

  useEffect(() => {
    // Only the visible instance (bar or open drawer) takes focus back.
    const link = linkRef.current;
    if (link && link.getClientRects().length > 0 && !link.closest("[inert]") && consumeRefocus()) link.focus();
    return () => window.clearTimeout(timer.current);
  }, []);

  const onSwitch = (event: MouseEvent<HTMLAnchorElement>, target: Locale, href: string) => {
    rememberLocale(target);
    warm(target, href);
    // Modified clicks (new tab or window) keep the browser's default.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (pending) return;

    setPending(target);
    // detail 0: activated from the keyboard (Enter), not a pointer.
    if (event.detail === 0) markRefocus();
    const destination = `${href}${window.location.search}${window.location.hash}`;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => router.push(destination, { scroll: false }), reduceMotion ? 0 : SLIDE_MS);
  };

  return (
    <div
      role="group"
      aria-label={labelledBy ? undefined : t.language.label}
      aria-labelledby={labelledBy}
      dir="ltr"
      className={cn(styles.toggle, styles[size], className)}
      data-active={active}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {locales.map((option) => {
        const { short, nativeName } = localeSettings[option];
        const label = (
          <>
            <span className={styles.short}>{short}</span>
            <span lang={option} className="sr-only">
              {" "}
              {nativeName}
            </span>
          </>
        );

        if (option === locale) {
          return (
            <span key={option} className={styles.option} data-on={option === active} aria-current="true">
              {label}
            </span>
          );
        }

        const href = switchLocalePath(pathname, option);
        return (
          <Link
            key={option}
            ref={linkRef}
            href={href}
            hrefLang={option}
            prefetch={false}
            className={styles.option}
            data-on={option === active}
            onPointerEnter={() => warm(option, href)}
            onFocus={() => warm(option, href)}
            onTouchStart={() => warm(option, href)}
            onClick={(event) => onSwitch(event, option, href)}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
