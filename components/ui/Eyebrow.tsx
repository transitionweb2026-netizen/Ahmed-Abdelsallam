import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  children: ReactNode;
  tone?: "dark" | "light";
  /** "div" when the content is block-level (e.g. a breadcrumb list). */
  as?: "span" | "div";
  className?: string;
}

/** Small glass label that sits above section headings. */
export function Eyebrow({ children, tone = "dark", as: Tag = "span", className }: EyebrowProps) {
  return (
    <Tag className={cn(styles.eyebrow, tone === "light" && styles.light, className)}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </Tag>
  );
}
