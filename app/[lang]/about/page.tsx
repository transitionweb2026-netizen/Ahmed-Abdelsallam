import type { Metadata } from "next";
import { AboutVideo } from "@/components/about/AboutVideo";
import { DoctorIntro } from "@/components/about/DoctorIntro";
import { Philosophy } from "@/components/about/Philosophy";
import { Qualifications } from "@/components/about/Qualifications";
import { StatsBand } from "@/components/about/StatsBand";
import { SiteCTA } from "@/components/cta/SiteCTA";
import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceShowcase } from "@/components/services/ServiceShowcase";
import { JourneyTimeline } from "@/components/timeline/JourneyTimeline";
import { routes } from "@/config/routes";
import { getI18n, getLocale } from "@/i18n/server";
import {
  getAboutPage,
  getArticles,
  getConditions,
  getQualifications,
  getServices,
  getSiteCta,
  getSpecialties,
  getVideos,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import type { Stat } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { seo } = await getAboutPage(locale);
  return pageMetadata({ ...seo, locale, path: routes.about });
}

export default async function AboutPage() {
  const { locale, t } = await getI18n();
  const [content, qualifications, specialties, services, conditions, videos, articles, cta] = await Promise.all([
    getAboutPage(locale),
    getQualifications(locale),
    getSpecialties(locale),
    getServices(locale),
    getConditions(locale),
    getVideos(locale),
    getArticles(locale),
    getSiteCta(locale),
  ]);

  // Every figure is a count of the site's own content — no invented claims.
  const counts = {
    services: services.length,
    conditions: conditions.length,
    videos: videos.length,
    articles: articles.length,
  };
  const stats: Stat[] = content.stats.items.map((item) => ({
    id: item.id,
    value: counts[item.countOf],
    label: item.label,
    icon: item.icon,
  }));

  return (
    <>
      <Hero content={content.hero} scrollTarget="#about-video" breadcrumb />
      <AboutVideo content={content.video} />
      <DoctorIntro content={content.introduction} />
      <Qualifications content={content.qualifications} items={qualifications} />
      <ServiceShowcase
        id="specialties"
        content={content.specialties}
        services={specialties}
        headingId="specialties-title"
      />
      <StatsBand heading={content.stats.heading} stats={stats} />
      <Philosophy content={content.philosophy} />
      <JourneyTimeline id="career" content={content.career} headingId="career-title" stepLabel={t.timeline.milestone} />
      <SiteCTA content={cta} />
      <JsonLd data={breadcrumbJsonLd(locale, content.hero.eyebrow, routes.about)} />
    </>
  );
}
