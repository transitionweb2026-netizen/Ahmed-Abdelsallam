import { Info } from "lucide-react";
import Image from "next/image";
import { GlassButton } from "@/components/ui/GlassButton";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { IconName, ItemDetails, MediaImage } from "@/types/content";
import styles from "./DetailView.module.css";

export interface DetailViewProps {
  /** id of the heading; the dialog is labelled by it. */
  titleId: string;
  /** Small label above the title, e.g. "خدمة" or "حالة". */
  kind: string;
  title: string;
  image: MediaImage;
  icon: IconName;
  /** Card text, used as the lead when no long-form details exist. */
  summary: string;
  details?: ItemDetails;
  tags?: { label: string; items: string[] };
  actions: { bookLabel: string; bookHref: string; whatsappLabel: string; whatsappHref: string };
  disclaimer: string;
}

/**
 * Long-form content for a service or condition, rendered inside the shared
 * Modal: banner image, title and lead, glass sections (paragraphs and/or
 * checklists) and a sticky action bar.
 */
export function DetailView({ titleId, kind, title, image, icon, summary, details, tags, actions, disclaimer }: DetailViewProps) {
  return (
    <article className={styles.view}>
      <header>
        <div className={styles.media}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 640px) 880px, 100vw"
            className={styles.image}
            style={{ objectPosition: image.objectPosition }}
          />
          <span className={styles.mediaTint} aria-hidden="true" />
        </div>
        <div className={styles.head}>
          <span className={styles.kind}>
            <span className={cn("icon-chip", styles.kindIcon)}>
              <Icon name={icon} size={18} />
            </span>
            {kind}
          </span>
          <h2 id={titleId} className={cn("type-h2", styles.title)}>
            {title}
          </h2>
          <p className={cn("type-lead", styles.lead)}>{details?.lead ?? summary}</p>
          {tags?.items.length ? (
            <ul className={styles.tags} aria-label={tags.label}>
              {tags.items.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      {details?.sections.length ? (
        <div className={styles.sections}>
          {details.sections.map((section) => (
            <section
              key={section.title}
              className={styles.section}
              data-wide={section.paragraphs?.length ? "true" : undefined}
            >
              <h3 className={styles.sectionTitle}>
                <span className={cn("icon-chip-soft", styles.sectionIcon)}>
                  <Icon name={section.icon ?? "info"} size={18} />
                </span>
                {section.title}
              </h3>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.items?.length ? (
                <ul className={styles.list}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      ) : null}

      <p className={styles.disclaimer}>
        <Info size={16} aria-hidden="true" />
        {disclaimer}
      </p>

      <footer className={styles.footer}>
        <GlassButton href={actions.bookHref} size="sm" className={styles.action}>
          {actions.bookLabel}
        </GlassButton>
        <GlassButton
          href={actions.whatsappHref}
          external
          size="sm"
          variant="secondary"
          icon="whatsapp"
          className={styles.action}
          ariaLabel={`${actions.whatsappLabel} (يفتح في نافذة جديدة)`}
        >
          {actions.whatsappLabel}
        </GlassButton>
      </footer>
    </article>
  );
}
