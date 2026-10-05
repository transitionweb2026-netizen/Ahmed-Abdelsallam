"use client";

import { useMemo, useState } from "react";
import { ConditionCard } from "@/components/conditions/ConditionCard";
import { useDictionary, useSite } from "@/components/i18n/LocaleProvider";
import { Modal } from "@/components/modal/Modal";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DetailView } from "@/components/services/DetailView";
import { useHashDialog } from "@/hooks/useHashDialog";
import { whatsappUrl } from "@/lib/utils";
import type { Condition, ServicesPageContent } from "@/types/content";
import styles from "@/components/services/Catalog.module.css";

interface ConditionCatalogProps {
  conditions: Condition[];
  dialog: ServicesPageContent["dialog"];
}

const anchor = (condition: Condition) => `condition-${condition.slug}`;

/**
 * Every condition as an image card; each opens the same shared detail
 * dialog as the services. `/services#condition-<slug>` deep-links into it.
 */
export function ConditionCatalog({ conditions, dialog }: ConditionCatalogProps) {
  const t = useDictionary();
  const site = useSite();
  const ids = useMemo(() => conditions.map(anchor), [conditions]);
  const { activeId, open, close } = useHashDialog(ids);
  const active = conditions.find((condition) => anchor(condition) === activeId);

  // Keep the last item rendered while the dialog animates out.
  const [shown, setShown] = useState(active);
  if (active && active !== shown) setShown(active);

  return (
    <>
      <RevealGroup as="ul" className={styles.conditionGrid} stagger={0.08}>
        {conditions.map((condition) => (
          <RevealItem as="li" key={condition.slug} id={anchor(condition)} variant="up">
            <ConditionCard
              condition={condition}
              symptomsLabel={t.cards.symptoms}
              onSelect={() => open(anchor(condition))}
            />
          </RevealItem>
        ))}
      </RevealGroup>

      <Modal
        open={Boolean(active)}
        onClose={close}
        labelledBy="condition-dialog-title"
        contentKey={shown?.slug}
        returnFocus={() => (shown ? document.getElementById(anchor(shown))?.querySelector("button") : null)}
      >
        {shown ? (
          <DetailView
            titleId="condition-dialog-title"
            kind={t.cards.conditionKind}
            title={shown.title}
            image={shown.image}
            icon={shown.icon}
            summary={shown.excerpt}
            details={shown.details}
            tags={{ label: `${t.cards.symptoms}: ${shown.title}`, items: shown.symptoms }}
            actions={{
              bookLabel: dialog.bookLabel,
              bookHref: site.bookingHref,
              whatsappLabel: dialog.whatsappLabel,
              whatsappHref: whatsappUrl(site.contact, dialog.whatsappMessage.replace("{title}", shown.title)),
            }}
            disclaimer={dialog.disclaimer}
          />
        ) : null}
      </Modal>
    </>
  );
}
