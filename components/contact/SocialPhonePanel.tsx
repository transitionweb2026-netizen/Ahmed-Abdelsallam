import { Phone } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { getI18n } from "@/i18n/server";
import { getSite } from "@/lib/content";
import { cn, phoneDisplay, phoneHref } from "@/lib/utils";
import styles from "./SocialPhonePanel.module.css";

/** One liquid-glass panel: social links | phone number. */
export async function SocialPhonePanel({ className }: { className?: string }) {
  const { locale, t } = await getI18n();
  const site = await getSite(locale);
  return (
    <div className={cn(styles.panel, className)}>
      <ul className={styles.socials} aria-label={t.common.socialAccounts}>
        {site.socials.map((social) => (
          <li key={social.platform}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              aria-label={`${t.socials[social.platform]} ${t.common.newTab}`}
            >
              <BrandIcon name={social.platform} size={19} />
            </a>
          </li>
        ))}
      </ul>

      <span className={styles.divider} aria-hidden="true" />

      <a href={phoneHref(site.contact)} className={styles.phone}>
        <span className={styles.phoneIcon} aria-hidden="true">
          <Phone size={18} strokeWidth={2} />
        </span>
        <span className={styles.phoneText}>
          <span className={styles.phoneLabel}>{t.header.callUs}</span>
          <span className={styles.phoneNumber} dir="ltr">
            {phoneDisplay(site.contact)}
          </span>
        </span>
      </a>
    </div>
  );
}
