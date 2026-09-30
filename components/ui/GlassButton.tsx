import { ArrowLeft } from "lucide-react";
import { AppLink } from "@/components/ui/AppLink";
import type { ReactNode } from "react";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";
import styles from "./GlassButton.module.css";

type Variant = "primary" | "secondary" | "light" | "lavender";
type Size = "sm" | "md" | "lg";

interface GlassButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Trailing icon inside the glass bubble. */
  icon?: "arrow" | "whatsapp" | "none";
  external?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * Liquid-glass call-to-action. Always a link — navigation and external
 * contact (WhatsApp) — never a button, so semantics stay correct.
 */
export function GlassButton({
  href,
  children,
  variant = "primary",
  size = "md",
  icon = "arrow",
  external = false,
  ariaLabel,
  className,
}: GlassButtonProps) {
  const classes = cn(styles.button, styles[variant], styles[size], icon !== "none" && styles.withIcon, className);
  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {icon !== "none" ? (
        <span className={styles.bubble} aria-hidden="true">
          {icon === "whatsapp" ? (
            <BrandIcon name="whatsapp" size={20} />
          ) : (
            <ArrowLeft className={styles.arrow} size={19} strokeWidth={2.1} />
          )}
        </span>
      ) : null}
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return (
    <AppLink href={href} className={classes} aria-label={ariaLabel}>
      {content}
    </AppLink>
  );
}
