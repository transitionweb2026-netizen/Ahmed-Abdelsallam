import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/admin/Feedback";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionForm } from "@/components/admin/SectionForm";
import { loadMediaMap, loadPageSections, loadVideoOptions } from "@/lib/cms/admin/data";
import { requireAdminPage } from "@/lib/cms/admin/session";
import type { SlotValue } from "@/lib/cms/admin/types";
import { buildBundledSnapshot } from "@/lib/cms/bundled";
import { emptyDoc } from "@/lib/cms/fields";
import { pageDef } from "@/lib/cms/pages";
import { sectionTypes } from "@/lib/cms/registry";

type Props = { params: Promise<{ page: string; section: string }> };

export const metadata: Metadata = { title: "Edit section" };

export default async function SectionPage({ params }: Props) {
  const { page: pageKey, section: sectionKey } = await params;
  const page = pageDef(pageKey);
  const section = page?.sections.find((s) => s.key === sectionKey);
  if (!page || !section) notFound();
  const type = sectionTypes[section.type];
  const { supabase } = await requireAdminPage();
  const { sections, media: sectionMedia } = await loadPageSections(supabase, page.key);
  const row = sections.find((s) => s.key === section.key);

  // A section not in the database yet starts from the website's built-in content.
  const fallback = row ? null : buildBundledSnapshot().sections.find((s) => s.page_key === page.key && s.key === section.key);
  const content = row?.content ?? fallback?.content ?? emptyDoc(type.fields);
  const slots: Record<string, SlotValue | null> = {};
  for (const m of sectionMedia.filter((m) => m.section_id === row?.id)) {
    slots[m.slot] = { media_id: m.media_id, object_position: m.object_position, alt_ar: m.alt_ar, alt_en: m.alt_en };
  }
  const [media, videoOptions] = await Promise.all([loadMediaMap(supabase, Object.values(slots).map((s) => s?.media_id)), type.video ? loadVideoOptions(supabase) : Promise.resolve([])]);

  const note = section.timeline
    ? { text: "The steps are edited in their own list.", href: `/admin/c/${section.timeline}`, link: "Edit steps" }
    : section.type === "pageCta"
      ? { text: "“Use the shared band” shows the block edited under Shared blocks.", href: "/admin/pages/global/siteCta", link: "Edit the shared band" }
      : type.note;

  return (
    <>
      <PageHeader
        title={section.label}
        back={{ href: `/admin/pages/${page.key}`, label: page.label }}
        badges={section.copyOnly ? null : <StatusBadge status={row && !row.visible ? "hidden" : "visible"} />}
        description={`${type.label}${section.anchor ? ` · #${section.anchor}` : ""}${row && !row.visible ? " · hidden from the website (show it again from the page's section list)" : ""}`}
      />
      {note && (
        <p className="mb-5 flex flex-wrap items-center gap-2 rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">
          <Info size={16} aria-hidden /> {note.text}
          <Link href={note.href} className="font-semibold underline underline-offset-2">
            {note.link}
          </Link>
        </p>
      )}
      {!row && <p className="mb-5 rounded-xl bg-[#f1f3fb] px-4 py-3 text-sm text-muted">This section is showing its built-in content. Saving stores it in the CMS.</p>}
      <SectionForm pageKey={page.key} sectionKey={section.key} type={section.type} initial={{ content, slots, videoId: row?.video_id ?? null }} media={media} videoOptions={videoOptions} />
    </>
  );
}
