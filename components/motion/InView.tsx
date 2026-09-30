"use client";

import { useInView } from "motion/react";
import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";

interface InViewProps {
  as?: "div" | "section" | "ol" | "ul";
  className?: string;
  style?: CSSProperties;
  amount?: number;
  children: ReactNode;
}

/**
 * Sets `data-inview="true"` once the element is visible. Lets CSS drive
 * coordinated sequences (timelines, line drawing) with one observer and no
 * per-frame JavaScript. See the `noscript` fallback in the root layout.
 */
export function InView({ as: Tag = "div", className, style, amount = 0.3, children }: InViewProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <Tag
      // A single ref type covers every allowed tag.
      ref={ref as RefObject<never>}
      className={className}
      style={style}
      data-inview={inView ? "true" : "false"}
    >
      {children}
    </Tag>
  );
}
