import { ChevronRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { requireAdminPage } from "@/lib/cms/admin/session";
import { cmsPages } from "@/lib/cms/pages";
import type { SectionRow } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Pages & sections" };

export default async function PagesPage() {
  const { supabase } = await requireAdminPage();
  const { data } = await supabase.from("page_sections").select("page_key, key, visible");
  const rows = (data ?? []) as Pick<SectionRow, "page_key" | "key" | "visible">[];

  return (
    <>
      <PageHeader title="Pages & sections" description="Each page is built from fixed sections. Edit their text and images, change their order, or hide the ones you do not need. Both languages are edited together." />
      <ul className="grid gap-3">
        {cmsPages.map((page) => {
          const hidden = rows.filter((r) => r.page_key === page.key && !r.visible).length;
          return (
            <li key={page.key} className="adm-card flex flex-wrap items-center gap-4 p-5">
              <Link href={`/admin/pages/${page.key}`} className="min-w-0 flex-1 hover:text-brand">
                <p className="font-semibold">{page.label}</p>
                <p className="text-sm text-muted">
                  {page.path ? <span className="font-mono text-xs">{page.path}</span> : "Used on every page"} · {page.sections.length} section{page.sections.length === 1 ? "" : "s"}
                  {hidden > 0 && ` · ${hidden} hidden`}
                </p>
              </Link>
              {page.path && (
                <a href={`/ar${page.path === "/" ? "" : page.path}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost adm-btn-sm">
                  <ExternalLink size={14} aria-hidden /> View
                </a>
              )}
              <Link href={`/admin/pages/${page.key}`} className="adm-btn adm-btn-secondary adm-btn-sm" aria-label={`Edit ${page.label}`}>
                Edit <ChevronRight size={14} aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
