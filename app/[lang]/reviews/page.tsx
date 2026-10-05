import type { Metadata } from "next";
import { SiteCTA } from "@/components/cta/SiteCTA";
import { FaqSection } from "@/components/faq/FaqSection";
import { Hero } from "@/components/hero/Hero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Orb } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/config/routes";
import { getI18n, getLocale } from "@/i18n/server";
import { renderSections, scrollTargetAfterHero } from "@/lib/cms/render";
import { getFaqs, getPageCta, getReviews, getReviewsPage, getSectionOrder } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ locale: await getLocale(), page: "reviews", path: routes.reviews });
}

/** "Reviews & FAQs" — every review and every question on one page. */
export default async function ReviewsPage() {
  const { locale, t } = await getI18n();
  const [content, order, reviews, faqs, cta] = await Promise.all([
    getReviewsPage(locale),
    getSectionOrder(locale, "reviews"),
    getReviews(locale),
    getFaqs(locale),
    getPageCta(locale, "reviews"),
  ]);

  return (
    <>
      {renderSections(order, {
        hero: () => <Hero content={content.hero} scrollTarget={scrollTargetAfterHero("reviews", order)} breadcrumb />,
        reviews: () => (
          <section id="reviews" className="page-section" aria-labelledby="reviews-title">
            <Orb className="top-10 end-[-12rem] h-[34rem] w-[34rem]" color="lavender" />
            <Orb className="bottom-0 start-[-12rem] h-[30rem] w-[30rem]" color="blue" />
            <div className="site-container relative">
              <SectionHeading heading={content.reviews.heading} id="reviews-title" />
              <RevealGroup
                as="ul"
                className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5"
                stagger={0.08}
                aria-label={t.reviews.list}
              >
                {reviews.map((review, index) => (
                  <RevealItem as="li" key={review.id} variant="up" className="flex">
                    <ReviewCard review={review} index={index} clamp={false} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </section>
        ),
        faq: () => <FaqSection content={content.faq} faqs={faqs} />,
        cta: () => <SiteCTA id="site-cta" content={cta} />,
      })}
      <JsonLd data={breadcrumbJsonLd(locale, t.nav.home, content.hero.eyebrow, routes.reviews)} />
      {order.includes("faq") && faqs.length > 0 ? <JsonLd data={faqJsonLd(faqs, locale)} /> : null}
    </>
  );
}
