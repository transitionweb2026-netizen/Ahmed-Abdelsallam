"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import type { Faq } from "@/types/content";
import styles from "./FaqAccordion.module.css";

interface FaqAccordionProps {
  items: Faq[];
  /** Item open on first render; defaults to the first question. Pass null for none. */
  defaultOpenId?: string | null;
  headingLevel?: "h3" | "h4";
  className?: string;
}

/**
 * Accessible accordion (WAI-ARIA disclosure pattern): each question is a
 * real <button> inside a heading, controlling a labelled region. Height is
 * animated with CSS grid rows; collapsed panels are visibility-hidden so
 * they leave the tab order and the accessibility tree.
 */
export function FaqAccordion({ items, defaultOpenId, headingLevel: Heading = "h3", className }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId === undefined ? (items[0]?.id ?? null) : defaultOpenId);
  const baseId = useId();

  return (
    <div className={cn(styles.list, className)}>
      {items.map((item, index) => {
        const open = openId === item.id;
        const buttonId = `${baseId}-question-${index}`;
        const panelId = `${baseId}-answer-${index}`;
        return (
          <div key={item.id} className={styles.item} data-open={open ? "true" : "false"}>
            <Heading className={styles.heading}>
              <button
                id={buttonId}
                type="button"
                className={styles.trigger}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.question}>{item.question}</span>
                <span className={styles.icon} aria-hidden="true">
                  <Plus size={18} strokeWidth={2.2} />
                </span>
              </button>
            </Heading>
            <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.panel}>
              <div className={styles.panelInner}>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
