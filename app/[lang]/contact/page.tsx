import type { Metadata } from "next";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactLocation } from "@/components/contact/ContactLocation";
import { SiteCTA } from "@/components/cta/SiteCTA";
import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Orb } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/config/routes";
import { getI18n, getLocale } from "@/i18n/server";
import { renderSections } from "@/lib/cms/render";
import { getContactInfo, getContactPage, getSectionOrder } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ locale: await getLocale(), page: "contact", path: routes.contact });
}

export default async function ContactPage() {
  const { locale, t } = await getI18n();
  const [content, order, info] = await Promise.all([getContactPage(locale), getSectionOrder(locale, "contact"), getContactInfo(locale)]);

  return (
    <>
      {renderSections(order, {
        hero: () => <Hero content={content.hero} size="compact" breadcrumb />,
        form: () => <ContactFormSection content={content.form} />,
        location: () => (
          <section id="clinic-location" className="page-section" aria-labelledby="clinic-location-title">
            <Orb className="top-1/3 end-[-14rem] h-[34rem] w-[34rem]" color="lavender" />
            <div className="site-container relative">
              <SectionHeading heading={content.location.heading} id="clinic-location-title" />
              <ContactLocation info={info} labels={content.location.labels} />
            </div>
          </section>
        ),
        // By default this page's band links onward — the contact options are already above it.
        cta: () => <SiteCTA id="site-cta" content={content.cta} />,
      })}
      <JsonLd data={breadcrumbJsonLd(locale, t.nav.home, content.hero.eyebrow, routes.contact)} />
    </>
  );
}
