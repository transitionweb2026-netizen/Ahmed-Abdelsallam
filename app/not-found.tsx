import type { Metadata } from "next";
import { routes } from "@/config/routes";
import { GlassRing, Orb } from "@/components/ui/Decor";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassButton } from "@/components/ui/GlassButton";

export const metadata: Metadata = {
  title: "الصفحة غير متاحة",
  robots: { index: false, follow: true },
};

/** Branded 404 — also shown for planned routes that are not built yet. */
export default function NotFound() {
  return (
    <section className="relative flex min-h-[82svh] items-center overflow-x-clip pb-16 pt-40" aria-labelledby="not-found-title">
      <Orb className="top-10 left-1/2 h-[34rem] w-[min(50rem,140vw)] -translate-x-1/2" color="lavender" />
      <GlassRing className="top-44 end-[12%] hidden h-32 w-32 md:block" />

      <div className="site-container relative flex flex-col items-center gap-5 text-center">
        <Eyebrow>404</Eyebrow>
        <h1 id="not-found-title" className="type-h2">
          الصفحة <span className="text-accent-gradient">غير متاحة حاليًا</span>
        </h1>
        <p className="type-lead max-w-xl text-muted">
          قد تكون هذه الصفحة قيد الإعداد أو تم نقلها. يمكنك العودة إلى الصفحة الرئيسية أو التواصل معنا مباشرة.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <GlassButton href={routes.home}>العودة للرئيسية</GlassButton>
          <GlassButton href={routes.contact} variant="secondary">
            تواصل معنا
          </GlassButton>
        </div>
      </div>
    </section>
  );
}
