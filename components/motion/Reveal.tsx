"use client";

import { m, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

export type RevealVariant = "up" | "fade" | "scale" | "blur";

const EASE = [0.22, 1, 0.36, 1] as const;

const VARIANTS: Record<RevealVariant, Variants> = {
  up: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  scale: { hidden: { opacity: 0, y: 18, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } },
  blur: {
    hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
};

const TAGS = {
  div: m.div,
  li: m.li,
  ul: m.ul,
  ol: m.ol,
  p: m.p,
  article: m.article,
  figure: m.figure,
  span: m.span,
};

type Tag = keyof typeof TAGS;

interface BaseProps {
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  id?: string;
  "aria-label"?: string;
  children?: ReactNode;
}

// Variants must be identical on server and client (they become the SSR
// inline styles). Reduced motion is handled in globals.css, which strips
// transform/filter from [data-reveal] so only a gentle opacity fade remains.

interface RevealProps extends BaseProps {
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  /** Fraction of the element that must be visible before it reveals. */
  amount?: number;
}

/** Reveals a single element once, when it scrolls into view. */
export function Reveal({
  as = "div",
  variant = "up",
  delay = 0,
  duration = 0.9,
  amount = 0.25,
  children,
  ...rest
}: RevealProps) {
  const Comp = TAGS[as];
  const variants = VARIANTS[variant];
  return (
    <Comp
      data-reveal=""
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

interface RevealGroupProps extends BaseProps {
  stagger?: number;
  delay?: number;
  amount?: number;
}

/** Parent that staggers its <RevealItem> children with a single observer. */
export function RevealGroup({ as = "div", stagger = 0.1, delay = 0, amount = 0.15, children, ...rest }: RevealGroupProps) {
  const Comp = TAGS[as];
  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

interface RevealItemProps extends BaseProps {
  variant?: RevealVariant;
  duration?: number;
}

export function RevealItem({ as = "div", variant = "up", duration = 0.85, children, ...rest }: RevealItemProps) {
  const Comp = TAGS[as];
  const base = VARIANTS[variant];
  const variants: Variants = {
    hidden: base.hidden,
    visible: { ...(base.visible as object), transition: { duration, ease: EASE } },
  };
  return (
    <Comp data-reveal="" variants={variants} {...rest}>
      {children}
    </Comp>
  );
}
