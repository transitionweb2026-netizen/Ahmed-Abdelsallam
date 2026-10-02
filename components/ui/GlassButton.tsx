import { ArrowLeft, LoaderCircle, Phone } from "lucide-react";
import { AppLink } from "@/components/ui/AppLink";
import type { ReactNode } from "react";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";
import styles from "./GlassButton.module.css";

type Variant = "primary" | "secondary" | "light" | "lavender";
type Size = "sm" | "md" | "lg";
export type GlassButtonIcon = "arrow" | "whatsapp" | "phone" | "none";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Trailing icon inside the glass bubble. */
  icon?: GlassButtonIcon;
  ariaLabel?: string;
  className?: string;
}

interface LinkProps extends CommonProps {
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

interface ButtonProps extends CommonProps {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  /** Shows a spinner in the bubble and marks the button busy. */
  loading?: boolean;
  /** For buttons that open a dialog. */
  hasPopup?: "dialog";
}

type GlassButtonProps = LinkProps | ButtonProps;

// Non-page links (phone, e-mail, other sites) render as a plain <a>.
const NON_ROUTE = /^(tel:|mailto:|https?:)/;

/**
 * Liquid-glass call-to-action. Renders a link when given `href`
 * (navigation, WhatsApp, `tel:`) and a real <button> otherwise (form
 * submit, opening a dialog), so semantics always match the behaviour.
 */
export function GlassButton(props: GlassButtonProps) {
  const { children, variant = "primary", size = "md", icon = "arrow", ariaLabel, className } = props;
  const loading = props.href === undefined && props.loading;
  const classes = cn(styles.button, styles[variant], styles[size], icon !== "none" && styles.withIcon, className);
  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {icon !== "none" ? (
        <span className={styles.bubble} aria-hidden="true">
          {loading ? (
            <LoaderCircle className={styles.spinner} size={19} strokeWidth={2.2} />
          ) : icon === "whatsapp" ? (
            <BrandIcon name="whatsapp" size={20} />
          ) : icon === "phone" ? (
            <Phone size={18} strokeWidth={2.1} />
          ) : (
            <ArrowLeft className={styles.arrow} size={19} strokeWidth={2.1} />
          )}
        </span>
      ) : null}
    </>
  );

  if (props.href === undefined) {
    return (
      <button
        type={props.type ?? "button"}
        className={classes}
        onClick={props.onClick}
        disabled={props.disabled || loading}
        aria-busy={loading || undefined}
        aria-haspopup={props.hasPopup}
        aria-label={ariaLabel}
      >
        {content}
      </button>
    );
  }

  const { href, external = false } = props;

  if (external || NON_ROUTE.test(href)) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
      >
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
