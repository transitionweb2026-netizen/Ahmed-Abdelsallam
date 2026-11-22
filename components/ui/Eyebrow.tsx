import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  children: ReactNode;
  tone?: "dark" | "light";
  /** "div" when the content is block-level (e.g. a breadcrumb list). */
  as?: "span" | "div";
  /** Smaller text and padding, for tighter spots such as the home hero photo. */
  small?: boolean;
  className?: string;
}

/** Small glass label that sits above section headings. */
export function Eyebrow({ children, tone = "dark", as: Tag = "span", small, className }: EyebrowProps) {
  return (
    <Tag className={cn(styles.eyebrow, tone === "light" && styles.light, small && styles.small, className)}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </Tag>
  );
}
