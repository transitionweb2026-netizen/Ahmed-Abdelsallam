import type { Metadata } from "next";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactLocation } from "@/components/contact/ContactLocation";
import { SiteCTA } from "@/components/cta/SiteCTA";
import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Orb } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/config/routes";
import { getContactInfo, getContactPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactPage();
  return pageMetadata({ ...seo, path: routes.contact });
}

export default async function ContactPage() {
  const [content, info] = await Promise.all([getContactPage(), getContactInfo()]);

  return (
    <>
      <Hero content={content.hero} size="compact" breadcrumb />
      <ContactFormSection content={content.form} />

      <section id="clinic-location" className="page-section" aria-labelledby="clinic-location-title">
        <Orb className="top-1/3 end-[-14rem] h-[34rem] w-[34rem]" color="lavender" />
        <div className="site-container relative">
          <SectionHeading heading={content.location.heading} id="clinic-location-title" />
          <ContactLocation info={info} labels={content.location.labels} />
        </div>
      </section>

      {/* Onward links only — the contact options are already on this page. */}
      <SiteCTA content={content.cta} />
      <JsonLd data={breadcrumbJsonLd(content.hero.eyebrow, routes.contact)} />
    </>
  );
}
