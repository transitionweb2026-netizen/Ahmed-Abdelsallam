"use client";

import { useMemo, useState } from "react";
import { useDictionary } from "@/components/i18n/LocaleProvider";
import { Modal } from "@/components/modal/Modal";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DetailView } from "@/components/services/DetailView";
import { ServiceCard } from "@/components/services/ServiceCard";
import { routes } from "@/config/routes";
import { useHashDialog } from "@/hooks/useHashDialog";
import { whatsappUrl } from "@/lib/utils";
import type { Service, ServicesPageContent } from "@/types/content";
import styles from "./Catalog.module.css";

interface ServiceCatalogProps {
  services: Service[];
  dialog: ServicesPageContent["dialog"];
}

/**
 * Every service as a glass card; each opens the shared detail dialog in
 * place. `/services#<slug>` deep-links straight into a dialog.
 */
export function ServiceCatalog({ services, dialog }: ServiceCatalogProps) {
  const t = useDictionary();
  const ids = useMemo(() => services.map((service) => service.slug), [services]);
  const { activeId, open, close } = useHashDialog(ids);
  const active = services.find((service) => service.slug === activeId);

  // Keep the last item rendered while the dialog animates out.
  const [shown, setShown] = useState(active);
  if (active && active !== shown) setShown(active);

  return (
    <>
      <RevealGroup as="ul" className={styles.serviceGrid} stagger={0.1}>
        {services.map((service, index) => (
          <RevealItem as="li" key={service.slug} id={service.slug} variant="up" className={styles.serviceItem}>
            <ServiceCard
              service={service}
              index={index}
              sizes="(min-width: 1320px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
              onSelect={() => open(service.slug)}
              actionLabel={t.cards.viewDetails}
            />
          </RevealItem>
        ))}
      </RevealGroup>

      <Modal
        open={Boolean(active)}
        onClose={close}
        labelledBy="service-dialog-title"
        contentKey={shown?.slug}
        returnFocus={() => (shown ? document.getElementById(shown.slug)?.querySelector("button") : null)}
      >
        {shown ? (
          <DetailView
            titleId="service-dialog-title"
            kind={t.cards.serviceKind}
            title={shown.title}
            image={shown.image}
            icon={shown.icon}
            summary={shown.description}
            details={shown.details}
            actions={{
              bookLabel: dialog.bookLabel,
              bookHref: routes.contact,
              whatsappLabel: dialog.whatsappLabel,
              whatsappHref: whatsappUrl(dialog.whatsappMessage.replace("{title}", shown.title)),
            }}
            disclaimer={dialog.disclaimer}
          />
        ) : null}
      </Modal>
    </>
  );
}
