"use client";

import {
  ChevronLeft,
  Circle,
  CirclePlay,
  House,
  Languages,
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
import { routes, type NavKey } from "@/config/routes";
import { useDictionary, useSite } from "@/components/i18n/LocaleProvider";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { AppLink } from "@/components/ui/AppLink";
import { BrandIcon } from "@/components/ui/BrandIcons";
import { GlassButton } from "@/components/ui/GlassButton";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { splitLocale } from "@/i18n/config";
import { phoneDisplay, phoneHref, whatsappUrl } from "@/lib/utils";
import styles from "./SiteHeader.module.css";

const NAV_ICONS: Partial<Record<string, LucideIcon>> & Record<NavKey, LucideIcon> = {
  home: House,
  about: UserRound,
  services: Stethoscope,
  videos: CirclePlay,
  reviews: MessagesSquare,
  articles: Newspaper,
  contact: PhoneCall,
};

export function SiteHeader() {
  const t = useDictionary();
  const site = useSite();
  const identity = site.identity;
  const headerNav = site.navigation.filter((item) => item.showInHeader);
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

  // Drawer behaviour (shared hooks): lock page scroll and trap Tab while
  // open. Here: focus in, Escape to close, close when the viewport grows
  // to desktop, return focus to the menu button on close.
  useScrollLock(open);
  useFocusTrap(drawerRef, open);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onViewport = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onViewport);

    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onViewport);
      toggle?.focus();
    };
  }, [open]);

  // Active state ignores the language prefix ("/en/about" → "/about").
  const path = splitLocale(pathname).path;
  const isActive = (href: string) => (href === routes.home ? path === "/" : path.startsWith(href));
  const close = () => setOpen(false);

  return (
    <header className={styles.header} data-scrolled={scrolled ? "true" : "false"}>
      <div className="site-container">
        <div className={styles.bar}>
          <AppLink href={routes.home} className={styles.brand}>
            <SiteLogo logo={site.logo} size={42} idPrefix="header-mark" />
            <span className={styles.brandText}>
              <span className={styles.brandName}>{identity.name}</span>
              <span className={styles.brandRole}>{identity.role}</span>
            </span>
          </AppLink>

          <nav aria-label={t.header.mainNavLabel} className={styles.desktopNav}>
            <ul className={styles.navList}>
              {headerNav.map((item) => (
                <li key={item.key}>
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
            <div className={styles.barLanguage}>
              <LanguageToggle />
            </div>
            <a href={phoneHref(site.contact)} className={styles.callButton} aria-label={`${t.header.callUs} ${phoneDisplay(site.contact)}`}>
              <Phone size={18} strokeWidth={2} aria-hidden="true" />
            </a>
            <GlassButton href={site.bookingHref} size="sm" className={styles.cta}>
              {t.header.book}
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
              <span className={styles.menuLabel}>{t.header.menu}</span>
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
            <SiteLogo logo={site.logo} size={40} idPrefix="drawer-mark" />
            <span className={styles.drawerBrandText}>
              <span className={styles.brandName}>{identity.name}</span>
              <span className={styles.brandRole}>{identity.role}</span>
            </span>
          </AppLink>
          <button ref={closeRef} type="button" className={styles.closeButton} aria-label={t.header.closeMenu} onClick={close}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <h2 id="site-drawer-title" className="sr-only">
          {t.header.drawerTitle}
        </h2>

        <div className={styles.drawerLanguage}>
          <span id="drawer-language-label" className={styles.drawerLanguageLabel}>
            <Languages size={18} strokeWidth={1.9} aria-hidden="true" />
            {t.language.label}
          </span>
          <LanguageToggle size="md" labelledBy="drawer-language-label" />
        </div>

        <nav aria-label={t.header.drawerNavLabel}>
          <ul className={styles.drawerList}>
            {headerNav.map((item) => {
              const ItemIcon = NAV_ICONS[item.key] ?? Circle;
              return (
                <li key={item.key}>
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
          <GlassButton href={site.bookingHref} className="w-full">
            {t.header.book}
          </GlassButton>
          <div className={styles.drawerContacts}>
            <a href={phoneHref(site.contact)} className={styles.drawerContact}>
              <Phone size={18} aria-hidden="true" />
              <span dir="ltr">{phoneDisplay(site.contact)}</span>
            </a>
            <a href={whatsappUrl(site.contact)} target="_blank" rel="noopener noreferrer" className={styles.drawerContact}>
              <BrandIcon name="whatsapp" size={18} />
              <span>{t.header.whatsapp}</span>
            </a>
          </div>
          <ul className={styles.drawerSocials} aria-label={t.common.socialAccounts}>
            {site.socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.drawerSocial}
                  aria-label={`${t.socials[social.platform]} ${t.common.newTab}`}
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
