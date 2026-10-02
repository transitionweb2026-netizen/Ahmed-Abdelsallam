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
import { getFaqs, getReviews, getReviewsPage, getSiteCta } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getReviewsPage();
  return pageMetadata({ ...seo, path: routes.reviews });
}

/** "Reviews & FAQs" — every review and every question on one page. */
export default async function ReviewsPage() {
  const [content, reviews, faqs, cta] = await Promise.all([getReviewsPage(), getReviews(), getFaqs(), getSiteCta()]);

  return (
    <>
      <Hero content={content.hero} scrollTarget="#reviews" breadcrumb />

      <section id="reviews" className="page-section" aria-labelledby="reviews-title">
        <Orb className="top-10 end-[-12rem] h-[34rem] w-[34rem]" color="lavender" />
        <Orb className="bottom-0 start-[-12rem] h-[30rem] w-[30rem]" color="blue" />
        <div className="site-container relative">
          <SectionHeading heading={content.reviews.heading} id="reviews-title" />
          <RevealGroup
            as="ul"
            className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5"
            stagger={0.08}
            aria-label="آراء المرضى"
          >
            {reviews.map((review, index) => (
              <RevealItem as="li" key={review.id} variant="up" className="flex">
                <ReviewCard review={review} index={index} clamp={false} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <FaqSection content={content.faq} faqs={faqs} />
      <SiteCTA content={cta} />
      <JsonLd data={breadcrumbJsonLd(content.hero.eyebrow, routes.reviews)} />
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
