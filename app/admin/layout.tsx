import type { Metadata, Viewport } from "next";
import "../fonts.css";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "CMS · Dr. Ahmed Abdelsalam", template: "%s · CMS" },
  robots: { index: false, follow: false },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = { themeColor: "#1b275b" };

/** Root layout of the CMS dashboard (separate from the public site's layout and styles). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="font-sans">{children}</body>
    </html>
  );
}
