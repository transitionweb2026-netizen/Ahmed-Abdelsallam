import type { Metadata } from "next";
import { NotFoundSection } from "@/components/not-found/NotFoundSection";
import { getI18n, getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.notFound.metaTitle,
    robots: { index: false, follow: true },
  };
}

/**
 * Any unknown path under /ar or /en (e.g. /en/old-page) shows the branded
 * 404 in that language, inside the site layout, and proxy.ts sends the 404
 * status. It renders as a normal page so the HTML is complete without
 * JavaScript; calling notFound() here would make Next.js answer with an
 * empty error document that only fills in on the client.
 */
export default async function UnknownPage() {
  return <NotFoundSection locale={await getLocale()} />;
}
