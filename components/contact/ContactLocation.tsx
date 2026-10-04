import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { GlassButton } from "@/components/ui/GlassButton";
import { interpolate } from "@/i18n/format";
import { getI18n } from "@/i18n/server";
import { cn, phoneDisplay, phoneHref } from "@/lib/utils";
import type { ContactInfo, ContactPageContent } from "@/types/content";
import styles from "./ContactLocation.module.css";

/** OpenStreetMap embed centred on the configured pin (no API key, no cookies). */
function osmEmbedUrl({ lat, lng, zoom }: ContactInfo["map"]): string {
  const spanLng = (360 / 2 ** zoom) * 1.6;
  const spanLat = spanLng * 0.55;
  const bbox = [lng - spanLng, lat - spanLat, lng + spanLng, lat + spanLat].map((n) => n.toFixed(5)).join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

const directionsUrl = ({ lat, lng }: ContactInfo["map"]) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

interface ContactLocationProps {
  info: ContactInfo;
  labels: ContactPageContent["location"]["labels"];
}

/**
 * Map card plus address, hours and phone. The pin comes from
 * data/shared/contact.ts; while it is a placeholder the map says so and no
 * directions are offered.
 */
export async function ContactLocation({ info, labels }: ContactLocationProps) {
  const { t } = await getI18n();
  const { map } = info;
  return (
    <div className={styles.grid}>
      <Reveal variant="scale" amount={0.2} className={styles.mapCard}>
        <div className={styles.mapFrame}>
          <iframe
            className={styles.map}
            src={osmEmbedUrl(map)}
            title={interpolate(t.contact.mapTitle, { label: map.label })}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          {map.isPlaceholder ? (
            <p className={styles.mapNotice}>
              <MapPin size={16} aria-hidden="true" />
              {labels.placeholderNote}
            </p>
          ) : null}
        </div>
      </Reveal>

      <Reveal variant="up" amount={0.2} className={styles.details}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <span className={cn("icon-chip", styles.itemIcon)}>
              <MapPin size={19} aria-hidden="true" />
            </span>
            <div className={styles.itemText}>
              <h3 className={styles.itemTitle}>{labels.address}</h3>
              <address className={styles.address}>
                {info.address.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </div>
          </li>

          <li className={styles.item}>
            <span className={cn("icon-chip", styles.itemIcon)}>
              <Clock size={19} aria-hidden="true" />
            </span>
            <div className={styles.itemText}>
              <h3 className={styles.itemTitle}>{labels.hours}</h3>
              <dl className={styles.hours}>
                {info.hours.map((row) => (
                  <div key={row.days} className={styles.hoursRow}>
                    <dt>{row.days}</dt>
                    <dd>{row.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </li>

          <li className={styles.item}>
            <span className={cn("icon-chip", styles.itemIcon)}>
              <Phone size={19} aria-hidden="true" />
            </span>
            <div className={styles.itemText}>
              <h3 className={styles.itemTitle}>{labels.phone}</h3>
              <a href={phoneHref()} className={styles.phone}>
                <span dir="ltr">{phoneDisplay()}</span>
              </a>
            </div>
          </li>

          {info.email ? (
            <li className={styles.item}>
              <span className={cn("icon-chip", styles.itemIcon)}>
                <Mail size={19} aria-hidden="true" />
              </span>
              <div className={styles.itemText}>
                <h3 className={styles.itemTitle}>{labels.email}</h3>
                <a href={`mailto:${info.email}`} className={styles.phone}>
                  <span dir="ltr">{info.email}</span>
                </a>
              </div>
            </li>
          ) : null}
        </ul>

        {!map.isPlaceholder ? (
          <GlassButton
            href={directionsUrl(map)}
            external
            variant="secondary"
            ariaLabel={`${labels.directions} ${t.common.newTab}`}
          >
            {labels.directions}
          </GlassButton>
        ) : null}
      </Reveal>
    </div>
  );
}
