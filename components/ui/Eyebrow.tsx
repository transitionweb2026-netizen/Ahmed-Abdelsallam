import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}

/** Small glass label that sits above section headings. */
export function Eyebrow({ children, tone = "dark", className }: EyebrowProps) {
  return (
    <span className={cn(styles.eyebrow, tone === "light" && styles.light, className)}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
}
