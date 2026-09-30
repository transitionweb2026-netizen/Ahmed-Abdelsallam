import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { cn, phoneDisplay, phoneHref } from "@/lib/utils";
import styles from "./SocialPhonePanel.module.css";

/** One liquid-glass panel: social links | phone number. */
export function SocialPhonePanel({ className }: { className?: string }) {
  return (
    <div className={cn(styles.panel, className)}>
      <ul className={styles.socials} aria-label="حسابات التواصل الاجتماعي">
        {siteConfig.socials.map((social) => (
          <li key={social.platform}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              aria-label={`${social.label} (يفتح في نافذة جديدة)`}
            >
              <BrandIcon name={social.platform} size={19} />
            </a>
          </li>
        ))}
      </ul>

      <span className={styles.divider} aria-hidden="true" />

      <a href={phoneHref()} className={styles.phone}>
        <span className={styles.phoneIcon} aria-hidden="true">
          <Phone size={18} strokeWidth={2} />
        </span>
        <span className={styles.phoneText}>
          <span className={styles.phoneLabel}>اتصل بنا</span>
          <span className={styles.phoneNumber} dir="ltr">
            {phoneDisplay()}
          </span>
        </span>
      </a>
    </div>
  );
}
