import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { AppLink } from "@/components/ui/AppLink";
import { routes } from "@/config/routes";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/content";
import styles from "./ServiceCard.module.css";

/** Link target for a service (explicit `href`, else its section on /services). */
export const serviceHref = (service: Service) => service.href ?? `${routes.services}#${service.slug}`;

interface ServiceCardProps {
  service: Service;
  index: number;
  /** `sizes` for the card image. */
  sizes?: string;
}

/**
 * Service card mounted inside a 3D glass box: a raised glass tray (bevelled
 * edges), a back plate offset up and to the side for visible depth, and the
 * content card recessed inside — led by a large service image. The whole
 * card is clickable via a stretched link.
 */
export function ServiceCard({
  service,
  index,
  sizes = "(min-width: 1280px) 290px, (min-width: 640px) 45vw, 90vw",
}: ServiceCardProps) {
  return (
    <article className={cn(styles.cell, "group")}>
      <span className={styles.plate} aria-hidden="true" />
      <div className={styles.box}>
        <div className={styles.inner}>
          <div className={styles.mediaWrap}>
            <div className={styles.media}>
              <Image
                src={service.image.src}
                alt={service.image.alt}
                fill
                sizes={sizes}
                className={styles.image}
                style={{ objectPosition: service.image.objectPosition }}
              />
              <span className={styles.mediaTint} aria-hidden="true" />
              <span className="glass-sheen" aria-hidden="true" />
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <span className={cn("icon-chip", styles.icon)}>
              <Icon name={service.icon} size={21} />
            </span>
          </div>

          <div className={styles.body}>
            <h3 className={cn("type-h3", styles.title)}>
              <AppLink href={serviceHref(service)} className={styles.link}>
                {service.title}
              </AppLink>
            </h3>
            <p className={styles.description}>{service.description}</p>
            <span className={styles.more} aria-hidden="true">
              اعرف المزيد
              <span className={styles.moreIcon}>
                <ArrowLeft size={16} strokeWidth={2.2} />
              </span>
            </span>
          </div>
          <span className={styles.accent} aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
