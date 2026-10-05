import { ExternalLink, Globe2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageSections, type SectionListItem } from "@/components/admin/PageSections";
import { PageHeader } from "@/components/admin/PageHeader";
import { loadPageSections } from "@/lib/cms/admin/data";
import { requireAdminPage } from "@/lib/cms/admin/session";
import { missingTranslations } from "@/lib/cms/fields";
import { pageDef } from "@/lib/cms/pages";
import { sectionTypes } from "@/lib/cms/registry";

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: pageDef((await params).page)?.label ?? "Not found" };
}

export default async function PageSectionsPage({ params }: Props) {
  const page = pageDef((await params).page);
  if (!page) notFound();
  const { supabase } = await requireAdminPage();
  const { sections } = await loadPageSections(supabase, page.key);
  const byKey = new Map(sections.map((s) => [s.key, s]));

  // Website order: saved order for sections in the database, defaults after.
  const ordered = [...page.sections].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (byKey.get(a.key)?.sort_order ?? 10_000) - (byKey.get(b.key)?.sort_order ?? 10_000);
  });

  const items: SectionListItem[] = ordered.map((def) => {
    const row = byKey.get(def.key);
    return {
      key: def.key,
      label: def.label,
      typeLabel: sectionTypes[def.type].label,
      visible: row?.visible ?? true,
      pinned: def.pinned === true,
      required: def.required === true,
      copyOnly: def.copyOnly === true,
      missing: row ? missingTranslations(sectionTypes[def.type].fields, row.content).length : 0,
      saved: Boolean(row),
    };
  });

  return (
    <>
      <PageHeader
        title={page.label}
        back={{ href: "/admin/pages", label: "Pages" }}
        description={page.path ? <>Sections of <span className="font-mono text-xs">{page.path}</span> in both languages. Changes go live as soon as they are saved.</> : "Blocks shared by every page."}
        actions={
          page.path ? (
            <>
              <Link href={`/admin/seo#page-${page.key}`} className="adm-btn adm-btn-secondary">
                <Globe2 size={15} aria-hidden /> SEO
              </Link>
              <a href={`/ar${page.path === "/" ? "" : page.path}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-secondary">
                <ExternalLink size={15} aria-hidden /> Arabic
              </a>
              <a href={`/en${page.path === "/" ? "" : page.path}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-secondary">
                <ExternalLink size={15} aria-hidden /> English
              </a>
            </>
          ) : null
        }
      />
      <PageSections pageKey={page.key} items={items} />
    </>
  );
}
