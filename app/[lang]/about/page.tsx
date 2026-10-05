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
import { renderSections, scrollTargetAfterHero } from "@/lib/cms/render";
import {
  getAboutPage,
  getArticles,
  getConditions,
  getPageCta,
  getQualifications,
  getSectionOrder,
  getServices,
  getSpecialties,
  getVideos,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import type { Stat } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ locale: await getLocale(), page: "about", path: routes.about });
}

export default async function AboutPage() {
  const { locale, t } = await getI18n();
  const [content, order, qualifications, specialties, services, conditions, videos, articles, cta] = await Promise.all([
    getAboutPage(locale),
    getSectionOrder(locale, "about"),
    getQualifications(locale),
    getSpecialties(locale),
    getServices(locale),
    getConditions(locale),
    getVideos(locale),
    getArticles(locale),
    getPageCta(locale, "about"),
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
      {renderSections(order, {
        hero: () => <Hero content={content.hero} scrollTarget={scrollTargetAfterHero("about", order)} breadcrumb />,
        video: () => <AboutVideo content={content.video} />,
        introduction: () => <DoctorIntro content={content.introduction} />,
        qualifications: () => <Qualifications content={content.qualifications} items={qualifications} />,
        specialties: () => (
          <ServiceShowcase id="specialties" content={content.specialties} services={specialties} headingId="specialties-title" />
        ),
        stats: () => <StatsBand id="about-stats" heading={content.stats.heading} stats={stats} />,
        philosophy: () => <Philosophy content={content.philosophy} />,
        career: () => (
          <JourneyTimeline id="career" content={content.career} headingId="career-title" stepLabel={t.timeline.milestone} />
        ),
        cta: () => <SiteCTA id="site-cta" content={cta} />,
      })}
      <JsonLd data={breadcrumbJsonLd(locale, t.nav.home, content.hero.eyebrow, routes.about)} />
    </>
  );
}
