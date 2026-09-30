import type { Metadata } from "next";
import { AboutDoctor } from "@/components/home/AboutDoctor";
import { ConditionsSection } from "@/components/home/ConditionsSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { ImportantServices } from "@/components/home/ImportantServices";
import { ImportantVideos } from "@/components/home/ImportantVideos";
import { IntroSection } from "@/components/home/IntroSection";
import { PatientJourney } from "@/components/home/PatientJourney";
import { ReviewsFaqSection } from "@/components/home/ReviewsFaqSection";
import { StatsSection } from "@/components/home/StatsSection";
import { siteConfig } from "@/config/site";
import { getConditions, getFaqs, getHomeContent, getReviews, getServices, getVideos } from "@/lib/content";
import { faqJsonLd, jsonLdString } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage.src,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: siteConfig.name,
      },
    ],
  },
};

export default async function HomePage() {
  const [content, services, conditions, videos, reviews, faqs] = await Promise.all([
    getHomeContent(),
    getServices({ featured: true, limit: 4 }),
    getConditions({ featured: true, limit: 4 }),
    getVideos({ featured: true, limit: 3 }),
    getReviews({ featured: true, limit: 4 }),
    getFaqs({ featured: true, limit: 6 }),
  ]);

  return (
    <>
      <Hero content={content.hero} />
      <IntroSection content={content.intro} />
      <StatsSection content={content.stats} />
      <ImportantServices content={content.services} services={services} />
      <AboutDoctor content={content.about} />
      <ConditionsSection content={content.conditions} conditions={conditions} />
      <PatientJourney content={content.journey} />
      <ImportantVideos content={content.videos} videos={videos} />
      <ReviewsFaqSection content={content.reviewsFaq} reviews={reviews} faqs={faqs} />
      <FinalCTA content={content.finalCta} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd(faqs)) }} />
    </>
  );
}
