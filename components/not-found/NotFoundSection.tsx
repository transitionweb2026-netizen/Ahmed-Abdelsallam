import { routes } from "@/config/routes";
import { GlassRing, Orb } from "@/components/ui/Decor";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassButton } from "@/components/ui/GlassButton";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Branded 404 content in one language. Takes the locale as a prop (instead
 * of reading the `[lang]` segment) so it also renders where there is no
 * language in the URL.
 */
export function NotFoundSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).notFound;
  const titleId = `not-found-title-${locale}`;
  return (
    <section className="relative flex min-h-[82svh] items-center overflow-x-clip pb-16 pt-40" aria-labelledby={titleId}>
      <Orb className="top-10 left-1/2 h-[34rem] w-[min(50rem,140vw)] -translate-x-1/2" color="lavender" />
      <GlassRing className="top-44 end-[12%] hidden h-32 w-32 md:block" />

      <div className="site-container relative flex flex-col items-center gap-5 text-center">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h1 id={titleId} className="type-h2">
          {t.titleStart} <span className="text-accent-gradient">{t.titleAccent}</span>
        </h1>
        <p className="type-lead max-w-xl text-muted">{t.text}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <GlassButton href={routes.home}>{t.home}</GlassButton>
          <GlassButton href={routes.contact} variant="secondary">
            {t.contact}
          </GlassButton>
        </div>
      </div>
    </section>
  );
}
