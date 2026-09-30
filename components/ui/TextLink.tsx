import { ArrowLeft } from "lucide-react";
import { AppLink } from "@/components/ui/AppLink";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./TextLink.module.css";

interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/** Secondary in-section link with an animated underline and arrow. */
export function TextLink({ href, children, className }: TextLinkProps) {
  return (
    <AppLink href={href} className={cn(styles.link, className)}>
      <span className={styles.label}>{children}</span>
      <span className={styles.icon} aria-hidden="true">
        <ArrowLeft size={16} strokeWidth={2.2} />
      </span>
    </AppLink>
  );
}
