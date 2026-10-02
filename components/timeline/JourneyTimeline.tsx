import type { CSSProperties } from "react";
import { InView } from "@/components/motion/InView";
import { CurveLines, Orb } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { JourneyContent } from "@/types/content";
import styles from "./JourneyTimeline.module.css";

interface JourneyTimelineProps {
  content: JourneyContent;
  headingId: string;
  /** Section anchor, e.g. "diagnosis". */
  id?: string;
  /** Screen-reader prefix for each step title ("الخطوة 1: …"). */
  stepLabel?: string;
}

/**
 * Glass timeline shared by the patient journey (home), the diagnosis steps
 * (services) and the career journey (about). Horizontal on desktop (nodes
 * on a line, staggered cards), vertical below 1024px. Steps appear in
 * sequence and each connector draws toward the next node — all CSS
 * transitions keyed off one observer.
 */
export function JourneyTimeline({ content, headingId, id, stepLabel = "الخطوة" }: JourneyTimelineProps) {
  return (
    <section id={id} className="page-section" aria-labelledby={headingId}>
      <Orb className="top-[58%] left-1/2 h-[34rem] w-[min(76rem,170vw)] -translate-x-1/2 -translate-y-1/2" color="lavender" />
      <CurveLines className="bottom-10 end-0 h-40 w-[60%] opacity-60" />

      <div className="site-container relative">
        <SectionHeading heading={content.heading} id={headingId} />

        <InView className={styles.track} amount={0.25} style={{ "--count": content.steps.length } as CSSProperties}>
          <ol className={styles.steps}>
            {content.steps.map((step, index) => (
              <li key={step.id} className={styles.step} data-step="" style={{ "--i": index } as CSSProperties}>
                <div className={styles.node} aria-hidden="true">
                  <span className={styles.nodeCore}>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <span className={styles.stem} aria-hidden="true" />
                <div className={styles.card}>
                  <span className={cn("icon-chip-soft", styles.icon)}>
                    <Icon name={step.icon} size={20} />
                  </span>
                  <h3 className={styles.title}>
                    <span className="sr-only">
                      {stepLabel} {index + 1}:{" "}
                    </span>
                    {step.title}
                  </h3>
                  {step.meta ? (
                    <span className={styles.meta} dir="auto">
                      {step.meta}
                    </span>
                  ) : null}
                  <p className={styles.text}>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </InView>
      </div>
    </section>
  );
}
