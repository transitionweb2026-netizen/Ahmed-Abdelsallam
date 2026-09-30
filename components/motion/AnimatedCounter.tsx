"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { formatNumber } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

/**
 * Counts from 0 to `value` once, the first time it enters the viewport.
 *
 * The server renders the final value (correct without JavaScript and for
 * crawlers); on mount the number is reset to 0 and animated when visible.
 * The visible digits are aria-hidden — pair with an sr-only full value.
 * Sets `data-counted` on the closest `[data-counter-root]` so CSS can
 * sync decorative effects with the count.
 */
export function AnimatedCounter({ value, duration = 2.2, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    el.textContent = formatNumber(0);
  }, [reduce]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    el.closest("[data-counter-root]")?.setAttribute("data-counted", "true");
    if (reduce) {
      el.textContent = formatNumber(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        el.textContent = formatNumber(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className} aria-hidden="true">
      {formatNumber(value)}
    </span>
  );
}
