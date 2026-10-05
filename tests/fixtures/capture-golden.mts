/**
 * Captures what the public site renders from, for both languages, into
 * tests/fixtures/golden-content.json. Captured once from the pre-CMS code;
 * tests/cms/golden.test.ts checks that the CMS mapping reproduces it.
 *
 *   npx tsx tests/fixtures/capture-golden.mts
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { mainNav, routes } from "@/config/routes";
import { siteConfig, siteIdentity } from "@/config/site";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import * as content from "@/lib/content";

const out: Record<string, unknown> = {
  routes,
  mainNav,
  socials: siteConfig.socials,
  identity: siteIdentity,
};

for (const locale of locales) {
  out[locale] = {
    dictionary: getDictionary(locale),
    home: await content.getHomeContent(locale),
    about: await content.getAboutPage(locale),
    servicesPage: await content.getServicesPage(locale),
    videosPage: await content.getVideosPage(locale),
    reviewsPage: await content.getReviewsPage(locale),
    articlesPage: await content.getArticlesPage(locale),
    contactPage: await content.getContactPage(locale),
    siteCta: await content.getSiteCta(locale),
    services: await content.getServices(locale),
    featuredServices: await content.getServices(locale, { featured: true, limit: 4 }),
    conditions: await content.getConditions(locale),
    featuredConditions: await content.getConditions(locale, { featured: true, limit: 4 }),
    specialties: await content.getSpecialties(locale),
    qualifications: await content.getQualifications(locale),
    career: await content.getCareerSteps(locale),
    videos: await content.getVideos(locale),
    featuredVideos: await content.getVideos(locale, { featured: true, limit: 3 }),
    introVideo: await content.getIntroVideo(locale),
    reviews: await content.getReviews(locale),
    featuredReviews: await content.getReviews(locale, { featured: true, limit: 4 }),
    faqs: await content.getFaqs(locale),
    featuredFaqs: await content.getFaqs(locale, { featured: true, limit: 6 }),
    contactInfo: await content.getContactInfo(locale),
    articles: await content.getArticles(locale),
  };
}

const target = fileURLToPath(new URL("./golden-content.json", import.meta.url));
writeFileSync(target, JSON.stringify(out, null, 2) + "\n");
console.log(`wrote ${target}`);
