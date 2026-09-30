"use client";

import {
  ChevronLeft,
  CirclePlay,
  House,
  Menu,
  MessagesSquare,
  Newspaper,
  Phone,
  PhoneCall,
  Stethoscope,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { AppLink } from "@/components/ui/AppLink";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { BrandMark } from "@/components/ui/BrandMark";
import { GlassButton } from "@/components/ui/GlassButton";
import { phoneDisplay, phoneHref, whatsappUrl } from "@/lib/utils";
import styles from "./SiteHeader.module.css";

const NAV_ICONS: Record<string, LucideIcon> = {
  [routes.home]: House,
  [routes.about]: UserRound,
  [routes.services]: Stethoscope,
  [routes.videos]: CirclePlay,
  [routes.reviews]: MessagesSquare,
  [routes.articles]: Newspaper,
  [routes.contact]: PhoneCall,
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close the drawer whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Drawer behaviour: focus in, trap Tab, Escape to close, lock page scroll,
  // close when the viewport grows to desktop, return focus on close.
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const toggle = toggleRef.current;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const items = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onViewport = () => desktop.matches && setOpen(false);

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onViewport);

    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onViewport);
      toggle?.focus();
    };
  }, [open]);

  const isActive = (href: string) => (href === routes.home ? pathname === "/" : pathname.startsWith(href));
  const close = () => setOpen(false);

  return (
    <header className={styles.header} data-scrolled={scrolled ? "true" : "false"}>
      <div className="site-container">
        <div className={styles.bar}>
          <AppLink href={routes.home} className={styles.brand}>
            <BrandMark size={42} idPrefix="header-mark" />
            <span className={styles.brandText}>
              <span className={styles.brandName}>{siteConfig.name}</span>
              <span className={styles.brandRole}>{siteConfig.role}</span>
            </span>
          </AppLink>

          <nav aria-label="القائمة الرئيسية" className={styles.desktopNav}>
            <ul className={styles.navList}>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    className={styles.navLink}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <a href={phoneHref()} className={styles.callButton} aria-label={`اتصل بنا ${phoneDisplay()}`}>
              <Phone size={18} strokeWidth={2} aria-hidden="true" />
            </a>
            <GlassButton href={routes.contact} size="sm" className={styles.cta}>
              احجز موعدًا
            </GlassButton>
            <button
              ref={toggleRef}
              type="button"
              className={styles.menuButton}
              aria-expanded={open}
              aria-controls="site-drawer"
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
            >
              <Menu size={21} aria-hidden="true" />
              <span className={styles.menuLabel}>القائمة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      <div className={styles.backdrop} data-open={open ? "true" : "false"} onClick={close} aria-hidden="true" />
      <div
        id="site-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-drawer-title"
        className={styles.drawer}
        data-open={open ? "true" : "false"}
        inert={!open}
      >
        <div className={styles.drawerHead}>
          <AppLink href={routes.home} className={styles.brand} onClick={close}>
            <BrandMark size={40} idPrefix="drawer-mark" />
            <span className={styles.drawerBrandText}>
              <span className={styles.brandName}>{siteConfig.name}</span>
              <span className={styles.brandRole}>{siteConfig.role}</span>
            </span>
          </AppLink>
          <button ref={closeRef} type="button" className={styles.closeButton} aria-label="إغلاق القائمة" onClick={close}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <h2 id="site-drawer-title" className="sr-only">
          القائمة الرئيسية
        </h2>
        <nav aria-label="صفحات الموقع">
          <ul className={styles.drawerList}>
            {mainNav.map((item) => {
              const ItemIcon = NAV_ICONS[item.href] ?? House;
              return (
                <li key={item.href}>
                  <AppLink
                    href={item.href}
                    className={styles.drawerLink}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={close}
                  >
                    <span className={styles.drawerIcon} aria-hidden="true">
                      <ItemIcon size={19} strokeWidth={1.9} />
                    </span>
                    <span className={styles.drawerLabel}>{item.label}</span>
                    <ChevronLeft className={styles.drawerChevron} size={18} aria-hidden="true" />
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.drawerFooter}>
          <GlassButton href={routes.contact} className="w-full">
            احجز موعدًا
          </GlassButton>
          <div className={styles.drawerContacts}>
            <a href={phoneHref()} className={styles.drawerContact}>
              <Phone size={18} aria-hidden="true" />
              <span dir="ltr">{phoneDisplay()}</span>
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={styles.drawerContact}>
              <BrandIcon name="whatsapp" size={18} />
              <span>واتساب</span>
            </a>
          </div>
          <ul className={styles.drawerSocials} aria-label="حسابات التواصل الاجتماعي">
            {siteConfig.socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.drawerSocial}
                  aria-label={`${social.label} (يفتح في نافذة جديدة)`}
                >
                  <BrandIcon name={social.platform} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
