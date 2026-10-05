import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Reveal } from "@/components/motion/Reveal";
import { DotGrid, Orb } from "@/components/ui/Decor";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getI18n } from "@/i18n/server";
import { getSite } from "@/lib/content";
import { cn, phoneDisplay, phoneHref, whatsappUrl } from "@/lib/utils";
import type { Faq, ReviewsPageContent } from "@/types/content";
import styles from "./FaqSection.module.css";

interface FaqSectionProps {
  content: ReviewsPageContent["faq"];
  faqs: Faq[];
}

/** Every FAQ in the shared accordion, beside a sticky navy "still need help?" card. */
export async function FaqSection({ content, faqs }: FaqSectionProps) {
  const { locale, t } = await getI18n();
  const { contact } = await getSite(locale);
  const { help } = content;
  return (
    <section id="faq" className="page-section" aria-labelledby="faq-title">
      <Orb className="top-1/4 start-[-12rem] h-[32rem] w-[32rem]" color="lavender" />
      <DotGrid className="bottom-10 end-[5%] h-56 w-56 opacity-60" />

      <div className="site-container relative">
        <SectionHeading heading={content.heading} id="faq-title" />

        <div className={styles.layout}>
          <Reveal variant="up" amount={0.05}>
            <FaqAccordion items={faqs} />
          </Reveal>

          <Reveal variant="scale" amount={0.3} className={styles.aside}>
            <div className={cn("glass-navy group", styles.help)} data-surface="dark">
              <span className="glass-sheen" aria-hidden="true" />
              <span className={styles.helpRings} aria-hidden="true" />
              <span className={cn("icon-chip", styles.helpIcon)}>
                <Icon name="messages" size={22} />
              </span>
              <h3 className={styles.helpTitle}>{help.title}</h3>
              <p className={styles.helpText}>{help.text}</p>
              <div className={styles.helpActions}>
                <GlassButton
                  href={whatsappUrl(contact, help.whatsappMessage)}
                  external
                  variant="light"
                  icon="whatsapp"
                  className={styles.helpAction}
                  ariaLabel={`${help.whatsappLabel} ${t.common.newTab}`}
                >
                  {help.whatsappLabel}
                </GlassButton>
                <GlassButton
                  href={phoneHref(contact)}
                  variant="lavender"
                  icon="phone"
                  className={styles.helpAction}
                  ariaLabel={`${help.callLabel} ${phoneDisplay(contact)}`}
                >
                  {help.callLabel}
                </GlassButton>
              </div>
              <p className={styles.phone}>
                <span dir="ltr">{phoneDisplay(contact)}</span>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
