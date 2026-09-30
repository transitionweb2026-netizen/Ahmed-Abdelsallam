import { ArrowUp, Phone } from "lucide-react";
import { AppLink } from "@/components/ui/AppLink";
import { mainNav, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { BrandMark } from "@/components/ui/BrandMark";
import { DotGrid, Orb } from "@/components/ui/Decor";
import { phoneDisplay, phoneHref, whatsappUrl } from "@/lib/utils";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
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
                  <span className={styles.brandName}>{siteConfig.name}</span>
                  <span className={styles.brandRole}>{siteConfig.role}</span>
                </span>
              </AppLink>
              <p className={styles.about}>
                رعاية متخصصة لمشكلات العظام والمفاصل، بخطوات واضحة من الاستشارة الأولى وحتى المتابعة.
              </p>
              <ul className={styles.socials} aria-label="حسابات التواصل الاجتماعي">
                {siteConfig.socials.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.social}
                      aria-label={social.label}
                    >
                      <BrandIcon name={social.platform} size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-labelledby="footer-links-title">
              <h2 id="footer-links-title" className={styles.colTitle}>
                روابط سريعة
              </h2>
              <ul className={styles.links}>
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <AppLink href={item.href} className={styles.link}>
                      {item.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className={styles.colTitle}>تواصل معنا</h2>
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
                    <span>راسلنا عبر واتساب</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className={styles.colTitle}>تنويه طبي</h2>
              <p className={styles.disclaimer}>
                المحتوى المنشور على هذا الموقع لأغراض التوعية العامة فقط، ولا يغني عن الفحص والاستشارة الطبية المباشرة.
              </p>
            </div>
          </div>

          <div className={styles.bottom}>
            <p>
              © {year} {siteConfig.name}. جميع الحقوق محفوظة.
            </p>
            <a href="#top" className={styles.toTop}>
              العودة للأعلى
              <ArrowUp size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
