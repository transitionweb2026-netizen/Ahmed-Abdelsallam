import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { DotGrid, Orb } from "@/components/ui/Decor";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/utils";
import type { Faq, Review, ReviewsFaqContent } from "@/types/content";
import styles from "./ReviewsFaqSection.module.css";

interface ReviewsFaqSectionProps {
  content: ReviewsFaqContent;
  reviews: Review[];
  faqs: Faq[];
}

/**
 * Two mirrored columns with identical anatomy — heading, content block,
 * "view all" link pinned to the bottom — so they stay visually balanced.
 */
export function ReviewsFaqSection({ content, reviews, faqs }: ReviewsFaqSectionProps) {
  return (
    <section className="page-section" aria-label="آراء المرضى والأسئلة الشائعة">
      <Orb className="top-10 end-[-12rem] h-[34rem] w-[34rem]" color="lavender" />
      <Orb className="bottom-0 start-[-12rem] h-[30rem] w-[30rem]" color="blue" />
      <DotGrid className="top-1/2 left-1/2 hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 opacity-50 lg:block" />

      <div className="site-container relative">
        <div className={styles.columns}>
          {/* Reviews — right column in RTL */}
          <section className={styles.column} aria-labelledby="reviews-title">
            <SectionHeading heading={content.reviews.heading} id="reviews-title" align="start" />
            <RevealGroup as="ul" className={styles.reviewsGrid} stagger={0.08}>
              {reviews.map((review, index) => (
                <RevealItem as="li" key={review.id} variant="up" className="flex">
                  <ReviewCard review={review} index={index} />
                </RevealItem>
              ))}
            </RevealGroup>
            <div className={styles.footer}>
              <TextLink href={content.reviews.cta.href}>{content.reviews.cta.label}</TextLink>
            </div>
          </section>

          <span className={styles.divider} aria-hidden="true">
            <span className={styles.dividerNode} />
          </span>

          {/* FAQ — left column in RTL */}
          <section className={styles.column} aria-labelledby="faq-title" id="faq">
            <SectionHeading heading={content.faq.heading} id="faq-title" align="start" />
            <Reveal variant="up" amount={0.15}>
              <FaqAccordion items={faqs} />
            </Reveal>
            <div className={styles.footer}>
              <TextLink href={content.faq.cta.href}>{content.faq.cta.label}</TextLink>
            </div>
          </section>
        </div>

        <Reveal variant="fade" className={cn("flex justify-center", styles.cta)}>
          <GlassButton href={content.cta.href} size="lg">
            {content.cta.label}
          </GlassButton>
        </Reveal>
      </div>
    </section>
  );
}
