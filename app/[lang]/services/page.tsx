import type { Metadata } from "next";
import { ConditionCatalog } from "@/components/conditions/ConditionCatalog";
import { SiteCTA } from "@/components/cta/SiteCTA";
import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceCatalog } from "@/components/services/ServiceCatalog";
import { JourneyTimeline } from "@/components/timeline/JourneyTimeline";
import { CurveLines, DotGrid, Orb, PlusMark } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/config/routes";
import { getI18n, getLocale } from "@/i18n/server";
import { renderSections } from "@/lib/cms/render";
import { getConditions, getPageCta, getSectionOrder, getServices, getServicesPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ locale: await getLocale(), page: "services", path: routes.services });
}

export default async function ServicesPage() {
  const { locale, t } = await getI18n();
  const [content, order, services, conditions, cta] = await Promise.all([
    getServicesPage(locale),
    getSectionOrder(locale, "services"),
    getServices(locale),
    getConditions(locale),
    getPageCta(locale, "services"),
  ]);

  return (
    <>
      {renderSections(order, {
        hero: () => <Hero content={content.hero} size="compact" breadcrumb />,
        procedures: () => (
          <section id="procedures" className="page-section" aria-labelledby="procedures-title">
            <Orb className="top-0 left-1/2 h-[40rem] w-[min(60rem,140vw)] -translate-x-1/2 opacity-80" color="blue" />
            <CurveLines className="bottom-8 start-0 h-44 w-full opacity-60" />
            <div className="site-container relative">
              <SectionHeading heading={content.procedures.heading} id="procedures-title" />
              <ServiceCatalog services={services} dialog={content.dialog} />
            </div>
          </section>
        ),
        conditions: () => (
          <section id="conditions" className="page-section" aria-labelledby="conditions-title">
            <Orb className="top-1/4 end-[-12rem] h-[32rem] w-[32rem]" color="lavender" />
            <Orb className="bottom-0 start-[-10rem] h-[26rem] w-[26rem]" color="navy" />
            <DotGrid className="bottom-16 end-[6%] h-56 w-56 opacity-60" />
            <PlusMark id="services-conditions-plus" className="top-28 start-[8%] hidden h-10 w-10 opacity-80 lg:block" />
            <div className="site-container relative">
              <SectionHeading heading={content.conditions.heading} id="conditions-title" />
              <ConditionCatalog conditions={conditions} dialog={content.dialog} />
            </div>
          </section>
        ),
        diagnosis: () => <JourneyTimeline id="diagnosis" content={content.diagnosis} headingId="diagnosis-title" />,
        cta: () => <SiteCTA id="site-cta" content={cta} />,
      })}
      <JsonLd data={breadcrumbJsonLd(locale, t.nav.home, content.hero.eyebrow, routes.services)} />
    </>
  );
}
