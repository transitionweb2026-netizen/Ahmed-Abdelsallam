"use client";

import { ArrowLeft } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Orb, GlassRing } from "@/components/ui/Decor";
import buttonStyles from "@/components/ui/GlassButton.module.css";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

/**
 * Root 404 (the "/404.html" static export generates, served by Hostinger's
 * ErrorDocument for any unknown path — a real 404 status, not a 200, since
 * it's only served when the requested file genuinely doesn't exist).
 *
 * On the Vercel deployment every page lives under /[lang], which has its
 * own not-found.tsx with the correct language already known; this root one
 * only renders there for a path with no language segment at all.
 *
 * There is no request to read server-side here, so it renders the default
 * locale first and corrects itself from the URL on mount — the address bar
 * still shows the real path (Apache's ErrorDocument substitutes the body,
 * not the URL), so this still lands on the right language almost instantly.
 */
const noSubscription = () => () => {};
const serverSnapshot = (): Locale => defaultLocale;
function clientSnapshot(): Locale {
  const first = window.location.pathname.split("/")[1];
  return isLocale(first) ? first : defaultLocale;
}

export default function RootNotFound() {
  // The URL isn't known until the browser has it (no request to read here),
  // so this reads window.location directly — a non-React external source —
  // instead of a render-then-correct effect. serverSnapshot keeps the build
  // and the first paint consistent (Arabic) until this takes over.
  const locale = useSyncExternalStore(noSubscription, clientSnapshot, serverSnapshot);

  const t = getDictionary(locale).notFound;
  const titleId = `not-found-title-${locale}`;

  return (
    <section
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="relative flex min-h-[82svh] items-center overflow-x-clip pb-16 pt-40"
      aria-labelledby={titleId}
    >
      <Orb className="top-10 left-1/2 h-[34rem] w-[min(50rem,140vw)] -translate-x-1/2" color="lavender" />
      <GlassRing className="top-44 end-[12%] hidden h-32 w-32 md:block" />

      <div className="site-container relative flex flex-col items-center gap-5 text-center">
        <h1 id={titleId} className="type-h2">
          {t.titleStart} <span className="text-accent-gradient">{t.titleAccent}</span>
        </h1>
        <p className="type-lead max-w-xl text-muted">{t.text}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a href={`/${locale}`} className={cn(buttonStyles.button, buttonStyles.primary, buttonStyles.md, buttonStyles.withIcon)}>
            <span className={buttonStyles.label}>{t.home}</span>
            <span className={buttonStyles.bubble} aria-hidden="true">
              <ArrowLeft className={buttonStyles.arrow} size={19} strokeWidth={2.1} />
            </span>
          </a>
          <a
            href={`/${locale}/contact`}
            className={cn(buttonStyles.button, buttonStyles.secondary, buttonStyles.md, buttonStyles.withIcon)}
          >
            <span className={buttonStyles.label}>{t.contact}</span>
            <span className={buttonStyles.bubble} aria-hidden="true">
              <ArrowLeft className={buttonStyles.arrow} size={19} strokeWidth={2.1} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
