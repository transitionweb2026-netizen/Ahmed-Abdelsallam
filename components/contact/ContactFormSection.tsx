import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { DotGrid, GlassRing, Orb } from "@/components/ui/Decor";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getI18n } from "@/i18n/server";
import { phoneDisplay, phoneHref, whatsappUrl } from "@/lib/utils";
import type { ContactPageContent } from "@/types/content";
import styles from "./ContactFormSection.module.css";

/** The glass form card, with WhatsApp and call buttons underneath it. */
export async function ContactFormSection({ content }: { content: ContactPageContent["form"] }) {
  const { t } = await getI18n();
  return (
    <section id="contact-form" className="page-section" aria-labelledby="contact-form-title">
      <Orb className="top-1/4 start-[-14rem] h-[36rem] w-[36rem]" color="lavender" />
      <Orb className="bottom-0 end-[-12rem] h-[30rem] w-[30rem]" color="blue" />
      <DotGrid className="top-24 end-[5%] hidden h-56 w-56 opacity-60 md:block" />

      <div className="site-container relative">
        <SectionHeading heading={content.heading} id="contact-form-title" />

        <div className={styles.stage}>
          <GlassRing className={styles.ring} />
          <Reveal variant="up" amount={0.1} className={styles.card}>
            <ContactForm copy={content.copy} />
          </Reveal>

          <Reveal variant="fade" delay={0.1} className={styles.direct}>
            <GlassButton
              href={whatsappUrl(content.whatsappMessage)}
              external
              size="lg"
              icon="whatsapp"
              className={styles.directButton}
              ariaLabel={`${content.whatsappLabel} ${t.common.newTab}`}
            >
              {content.whatsappLabel}
            </GlassButton>
            <GlassButton
              href={phoneHref()}
              size="lg"
              variant="secondary"
              icon="phone"
              className={styles.directButton}
              ariaLabel={`${content.callLabel} ${phoneDisplay()}`}
            >
              {content.callLabel}
            </GlassButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
