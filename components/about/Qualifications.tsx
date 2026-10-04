import { Info, Landmark } from "lucide-react";
import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DotGrid, Orb } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/utils";
import type { AboutPageContent, Qualification } from "@/types/content";
import styles from "./Qualifications.module.css";

interface QualificationsProps {
  content: AboutPageContent["qualifications"];
  items: Qualification[];
}

/** Certificate tiles: artwork, kind, year, title, institution, description. */
export async function Qualifications({ content, items }: QualificationsProps) {
  const { t } = await getI18n();
  const kindLabel: Record<Qualification["kind"], string> = {
    qualification: t.about.qualificationKind,
    certification: t.about.certificationKind,
  };
  return (
    <section id="qualifications" className="page-section" aria-labelledby="qualifications-title">
      <Orb className="top-1/3 start-[-14rem] h-[34rem] w-[34rem]" color="blue" />
      <DotGrid className="bottom-10 end-[4%] h-60 w-60 opacity-60" />

      <div className="site-container relative">
        <SectionHeading heading={content.heading} id="qualifications-title" />
        {content.note ? (
          <p className={styles.note}>
            <Info size={16} aria-hidden="true" />
            {content.note}
          </p>
        ) : null}

        <RevealGroup as="ul" className={styles.grid} stagger={0.08}>
          {items.map((item) => (
            <RevealItem as="li" key={item.id} variant="up">
              <article className={cn(styles.tile, "group")}>
                <span className="glass-sheen" aria-hidden="true" />
                <div className={styles.mediaWrap}>
                  <div className={styles.media}>
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 1280px) 400px, (min-width: 640px) 46vw, 92vw"
                      className={styles.image}
                    />
                    <span className={styles.kind}>{kindLabel[item.kind]}</span>
                    {/* dir on an inner span: a positioned element's logical
                        insets follow its own direction. */}
                    <span className={styles.year}>
                      <span dir="ltr">{item.year}</span>
                    </span>
                  </div>
                  <span className={cn("icon-chip", styles.seal)}>
                    <Icon name={item.kind === "qualification" ? "graduationCap" : "award"} size={21} />
                  </span>
                </div>
                <div className={styles.body}>
                  <h3 className={cn("type-h3", styles.title)}>{item.title}</h3>
                  <p className={styles.institution}>
                    <Landmark size={16} aria-hidden="true" />
                    <span>{item.institution}</span>
                  </p>
                  <p className={styles.description}>{item.description}</p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
