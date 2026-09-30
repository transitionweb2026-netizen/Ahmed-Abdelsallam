import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { siteConfig } from "@/config/site";
import { jsonLdString, physicianJsonLd } from "@/lib/structured-data";
import "./globals.css";

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage.src, width: siteConfig.ogImage.width, height: siteConfig.ogImage.height, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage.src],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f3f5fc",
  colorScheme: "light",
};

// Reveal animations start hidden; without JavaScript, show everything.
const noScriptStyles =
  "[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}[data-inview] [data-step]{opacity:1!important;transform:none!important}[data-inview] [data-step]::after{transform:none!important}";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={plexArabic.variable} data-scroll-behavior="smooth">
      <head>
        <noscript>
          <style>{noScriptStyles}</style>
        </noscript>
      </head>
      <body id="top">
        <a href="#main" className="skip-link">
          تخطَّ إلى المحتوى الرئيسي
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(physicianJsonLd()) }} />
      </body>
    </html>
  );
}
