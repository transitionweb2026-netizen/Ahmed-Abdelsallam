import type { Metadata } from "next";
import { SiteCTA } from "@/components/cta/SiteCTA";
import { Hero } from "@/components/hero/Hero";
import { AboutDoctor } from "@/components/home/AboutDoctor";
import { ConditionsSection } from "@/components/home/ConditionsSection";
import { ImportantVideos } from "@/components/home/ImportantVideos";
import { IntroSection } from "@/components/home/IntroSection";
import { ReviewsFaqSection } from "@/components/home/ReviewsFaqSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ServiceShowcase } from "@/components/services/ServiceShowcase";
import { JourneyTimeline } from "@/components/timeline/JourneyTimeline";
import { routes } from "@/config/routes";
import { siteIdentity } from "@/config/site";
import { getLocale } from "@/i18n/server";
import { getConditions, getFaqs, getHomeContent, getReviews, getServices, getVideos } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { title, description } = siteIdentity[locale];
  return pageMetadata({ locale, title, absoluteTitle: true, description, path: routes.home });
}

export default async function HomePage() {
  const locale = await getLocale();
  const [content, services, conditions, videos, reviews, faqs] = await Promise.all([
    getHomeContent(locale),
    getServices(locale, { featured: true, limit: 4 }),
    getConditions(locale, { featured: true, limit: 4 }),
    getVideos(locale, { featured: true, limit: 3 }),
    getReviews(locale, { featured: true, limit: 4 }),
    getFaqs(locale, { featured: true, limit: 6 }),
  ]);

  return (
    <>
      <Hero content={content.hero} scrollTarget="#intro" />
      <IntroSection content={content.intro} />
      <StatsSection content={content.stats} />
      <ServiceShowcase content={content.services} services={services} headingId="services-title" />
      <AboutDoctor content={content.about} />
      <ConditionsSection content={content.conditions} conditions={conditions} />
      <JourneyTimeline content={content.journey} headingId="journey-title" />
      <ImportantVideos content={content.videos} videos={videos} />
      <ReviewsFaqSection content={content.reviewsFaq} reviews={reviews} faqs={faqs} />
      <SiteCTA content={content.finalCta} />
    </>
  );
}
