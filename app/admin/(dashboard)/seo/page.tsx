import type { Metadata } from "next";
import Link from "next/link";
import { DocForm } from "@/components/admin/DocForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { loadMediaMap, loadPages, loadSettings, mediaIdsOf } from "@/lib/cms/admin/data";
import { requireAdminPage } from "@/lib/cms/admin/session";
import { emptyDoc, rowToDoc } from "@/lib/cms/fields";
import { cmsPages } from "@/lib/cms/pages";
import { pageSeoFields } from "@/lib/cms/registry";

export const metadata: Metadata = { title: "SEO" };

export default async function SeoPage() {
  const { supabase } = await requireAdminPage();
  const [pages, settings] = await Promise.all([loadPages(supabase), loadSettings(supabase)]);
  const docs = cmsPages
    .filter((page) => page.path)
    .map((page) => {
      const row = pages.find((p) => p.key === page.key);
      return { page, doc: row ? rowToDoc(pageSeoFields, row as unknown as Record<string, unknown>) : { ...emptyDoc(pageSeoFields), robots_index: true } };
    });
  const media = await loadMediaMap(supabase, docs.flatMap(({ doc }) => mediaIdsOf(pageSeoFields, doc)));
  const siteName = { ar: settings?.doctor_name_ar ?? "", en: settings?.doctor_name_en ?? "" };
  const defaults = {
    title: { ar: settings?.default_title_ar ?? "", en: settings?.default_title_en ?? "" },
    description: { ar: settings?.default_description_ar ?? "", en: settings?.default_description_en ?? "" },
  };

  return (
    <>
      <PageHeader
        title="SEO"
        description={
          <>
            Search-result titles, descriptions and sharing images for each page, in both languages. The default title, description and sharing image are set in <Link href="/admin/settings" className="font-semibold underline">Global settings</Link>, which also has the
            site-wide indexing switch. Language alternates (hreflang), canonical URLs and the sitemap are generated automatically.
          </>
        }
      />
      <nav aria-label="Pages" className="mb-5 flex flex-wrap gap-2">
        {docs.map(({ page }) => (
          <a key={page.key} href={`#page-${page.key}`} className="adm-btn adm-btn-secondary adm-btn-sm">
            {page.label}
          </a>
        ))}
      </nav>
      <div className="grid gap-6">
        {docs.map(({ page, doc }) => (
          <section key={page.key} id={`page-${page.key}`} className="adm-card scroll-mt-20 p-5 sm:p-6" aria-labelledby={`seo-${page.key}`}>
            <h2 id={`seo-${page.key}`} className="mb-4 text-base font-bold">
              {page.label} <span className="font-mono text-xs font-normal text-muted">{page.path}</span>
            </h2>
            <DocForm target={{ kind: "seo", page: page.key, path: page.path!, siteName, defaults }} initialDoc={doc} media={media} />
          </section>
        ))}
      </div>
    </>
  );
}
