/**
 * The CMS must reproduce the pre-CMS website exactly. golden-content.json
 * was captured from the original content layer (tests/fixtures/
 * capture-golden.mts); here the bundled content goes through the CMS rows
 * and the CMS mapper, and every page and collection must come out equal.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { buildBundledSnapshot } from "@/lib/cms/bundled";
import { ContentReader } from "@/lib/cms/content-map";
import type { Locale } from "@/lib/cms/types";

const golden = JSON.parse(readFileSync(join(process.cwd(), "tests", "fixtures", "golden-content.json"), "utf8"));
const snapshot = buildBundledSnapshot();
/** Same JSON round trip as the golden file (drops undefined, normalises). */
const plain = <T>(value: T): T => JSON.parse(JSON.stringify(value));

describe.each<Locale>(["ar", "en"])("bundled content through the CMS (%s)", (locale) => {
  const reader = new ContentReader(snapshot, locale, null, getDictionary(locale));
  const g = golden[locale];

  it.each([
    ["dictionary", () => reader.dictionary()],
    ["home", () => reader.home()],
    ["about", () => reader.about()],
    ["servicesPage", () => reader.servicesPage()],
    ["videosPage", () => reader.videosPage()],
    ["reviewsPage", () => reader.reviewsPage()],
    ["articlesPage", () => reader.articlesPage()],
    ["contactPage", () => reader.contactPage()],
    ["siteCta", () => reader.siteCta()],
    ["services", () => reader.services()],
    ["featuredServices", () => reader.services({ featured: true, limit: 4 })],
    ["conditions", () => reader.conditions()],
    ["featuredConditions", () => reader.conditions({ featured: true, limit: 4 })],
    ["specialties", () => reader.specialties()],
    ["qualifications", () => reader.qualifications()],
    ["career", () => reader.steps("career")],
    ["videos", () => reader.videos()],
    ["featuredVideos", () => reader.videos({ featured: true, limit: 3 })],
    ["introVideo", () => reader.sectionVideo("home", "intro")],
    ["reviews", () => reader.reviews()],
    ["featuredReviews", () => reader.reviews({ featured: true, limit: 4 })],
    ["faqs", () => reader.faqs()],
    ["featuredFaqs", () => reader.faqs({ featured: true, limit: 6 })],
    ["contactInfo", () => reader.contactInfo()],
    ["articles", () => reader.articles()],
  ])("%s matches the original", (name, read) => {
    expect(plain(read())).toEqual(g[name]);
  });

  it("identity matches the original", () => {
    expect(plain(reader.identity())).toEqual(golden.identity[locale]);
  });

  it("navigation and social links match the original", () => {
    expect(reader.navigation().map(({ key, href }) => ({ key, href }))).toEqual(golden.mainNav.map(({ key, href }: { key: string; href: string }) => ({ key, href })));
    expect(reader.navigation().map((item) => item.label)).toEqual(golden.mainNav.map((item: { key: string }) => g.dictionary.nav[item.key]));
    expect(reader.socials()).toEqual(golden.socials);
  });

  it("pages keep their default section order", () => {
    expect(reader.sectionOrder("home")).toEqual(["hero", "intro", "stats", "services", "about", "conditions", "journey", "videos", "reviewsFaq", "cta"]);
    expect(reader.sectionOrder("services")).toEqual(["hero", "procedures", "conditions", "diagnosis", "cta"]);
  });
});
