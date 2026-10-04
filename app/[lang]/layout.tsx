import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { fontPreloads } from "@/config/fonts";
import { siteConfig, siteIdentity } from "@/config/site";
import { localeSettings, locales } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { jsonLdString, physicianJsonLd } from "@/lib/structured-data";
import "../fonts.css";
import "../globals.css";

/** Both languages are prerendered at build time. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  const identity = siteIdentity[locale];
  const og = identity.ogImage;
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: identity.title,
      template: `%s | ${identity.name}`,
    },
    description: identity.description,
    applicationName: identity.name,
    openGraph: {
      type: "website",
      locale: localeSettings[locale].ogLocale,
      siteName: identity.name,
      title: identity.title,
      description: identity.description,
      images: [{ url: og.src, width: og.width, height: og.height, alt: identity.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: identity.title,
      description: identity.description,
      images: [og.src],
    },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f3f5fc",
  colorScheme: "light",
};

// Reveal animations start hidden; without JavaScript, show everything.
const noScriptStyles =
  "[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}[data-inview] [data-step]{opacity:1!important;transform:none!important}[data-inview] [data-step]::after{transform:none!important}";

/**
 * Root layout for both languages: `lang` and `dir` come from the URL
 * (/ar → rtl, /en → ltr), so the server always renders the right language
 * and direction — no client-side detection, no flash of the wrong one.
 */
export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, t } = await getI18n();
  // Only this language's font files (see config/fonts.ts).
  for (const href of fontPreloads[locale]) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html
      lang={locale}
      dir={localeSettings[locale].dir}
      data-scroll-behavior="smooth"
    >
      <head>
        <noscript>
          <style>{noScriptStyles}</style>
        </noscript>
      </head>
      <body id="top">
        <a href="#main" className="skip-link">
          {t.skipToContent}
        </a>
        <LocaleProvider locale={locale} t={t}>
          <MotionProvider>
            <SiteHeader />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <SiteFooter />
          </MotionProvider>
        </LocaleProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(physicianJsonLd(locale)) }} />
      </body>
    </html>
  );
}
