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
 * Branded 404 for `notFound()` calls inside a page. Unknown URLs under /ar
 * or /en are rendered by [...rest]/page.tsx instead.
 */
export default async function NotFound() {
  return <NotFoundSection locale={await getLocale()} />;
}
