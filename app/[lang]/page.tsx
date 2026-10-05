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
import { getLocale } from "@/i18n/server";
import { renderSections, scrollTargetAfterHero } from "@/lib/cms/render";
import { getConditions, getFaqs, getHomeContent, getReviews, getSectionOrder, getServices, getVideos } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({ locale, page: "home", path: routes.home, absoluteTitle: true });
}

export default async function HomePage() {
  const locale = await getLocale();
  const [content, order, services, conditions, videos, reviews, faqs] = await Promise.all([
    getHomeContent(locale),
    getSectionOrder(locale, "home"),
    getServices(locale, { featured: true, limit: 4 }),
    getConditions(locale, { featured: true, limit: 4 }),
    getVideos(locale, { featured: true, limit: 3 }),
    getReviews(locale, { featured: true, limit: 4 }),
    getFaqs(locale, { featured: true, limit: 6 }),
  ]);

  return renderSections(order, {
    hero: () => <Hero content={content.hero} scrollTarget={scrollTargetAfterHero("home", order)} />,
    intro: () => <IntroSection content={content.intro} />,
    stats: () => <StatsSection id="stats" content={content.stats} />,
    services: () => <ServiceShowcase id="services" content={content.services} services={services} headingId="services-title" />,
    about: () => <AboutDoctor content={content.about} />,
    conditions: () => <ConditionsSection content={content.conditions} conditions={conditions} />,
    journey: () => <JourneyTimeline id="journey" content={content.journey} headingId="journey-title" />,
    videos: () => <ImportantVideos id="videos" content={content.videos} videos={videos} />,
    reviewsFaq: () => <ReviewsFaqSection id="reviews-faq" content={content.reviewsFaq} reviews={reviews} faqs={faqs} />,
    cta: () => <SiteCTA id="site-cta" content={content.finalCta} />,
  });
}
