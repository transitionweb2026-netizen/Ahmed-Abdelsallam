import { ArrowUp, Phone } from "lucide-react";
import { AppLink } from "@/components/ui/AppLink";
import { mainNav, routes } from "@/config/routes";
import { siteConfig, siteIdentity } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { BrandMark } from "@/components/ui/BrandMark";
import { DotGrid, Orb } from "@/components/ui/Decor";
import { getI18n } from "@/i18n/server";
import { phoneDisplay, phoneHref, whatsappUrl } from "@/lib/utils";
import styles from "./SiteFooter.module.css";

export async function SiteFooter() {
  const { locale, t } = await getI18n();
  const identity = siteIdentity[locale];
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="site-container">
        <div className={styles.panel}>
          <Orb className="-top-40 end-[-6rem] h-96 w-96" color="lavender" />
          <DotGrid className="bottom-0 start-0 h-56 w-80 opacity-60" />

          <div className={styles.grid}>
            <div className={styles.brandCol}>
              <AppLink href={routes.home} className={styles.brand}>
                <BrandMark size={48} idPrefix="footer-mark" />
                <span className={styles.brandText}>
                  <span className={styles.brandName}>{identity.name}</span>
                  <span className={styles.brandRole}>{identity.role}</span>
                </span>
              </AppLink>
              <p className={styles.about}>{t.footer.about}</p>
              <ul className={styles.socials} aria-label={t.common.socialAccounts}>
                {siteConfig.socials.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.social}
                      aria-label={t.socials[social.platform]}
                    >
                      <BrandIcon name={social.platform} size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-labelledby="footer-links-title">
              <h2 id="footer-links-title" className={styles.colTitle}>
                {t.footer.quickLinks}
              </h2>
              <ul className={styles.links}>
                {mainNav.map((item) => (
                  <li key={item.key}>
                    <AppLink href={item.href} className={styles.link}>
                      {t.nav[item.key]}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className={styles.colTitle}>{t.footer.contactTitle}</h2>
              <ul className={styles.contacts}>
                <li>
                  <a href={phoneHref()} className={styles.contact}>
                    <span className={styles.contactIcon} aria-hidden="true">
                      <Phone size={17} />
                    </span>
                    <span dir="ltr">{phoneDisplay()}</span>
                  </a>
                </li>
                <li>
                  <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={styles.contact}>
                    <span className={styles.contactIcon} aria-hidden="true">
                      <BrandIcon name="whatsapp" size={17} />
                    </span>
                    <span>{t.footer.whatsapp}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className={styles.colTitle}>{t.footer.disclaimerTitle}</h2>
              <p className={styles.disclaimer}>{t.footer.disclaimer}</p>
            </div>
          </div>

          <div className={styles.bottom}>
            <p>
              © {year} {identity.name}. {t.footer.rights}
            </p>
            <a href="#top" className={styles.toTop}>
              {t.footer.backToTop}
              <ArrowUp size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
