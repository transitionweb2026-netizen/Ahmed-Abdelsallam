import type { Metadata } from "next";
import { ContentExplorer, type ExplorerFilters } from "@/components/admin/ContentExplorer";
import { PageHeader } from "@/components/admin/PageHeader";
import { loadAllContent, rowsOf } from "@/lib/cms/admin/data";
import { buildContentIndex } from "@/lib/cms/admin/explorer";
import { requireAdminPage } from "@/lib/cms/admin/session";
import { cmsPages } from "@/lib/cms/pages";

export const metadata: Metadata = { title: "Content explorer" };

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function ContentPage({ searchParams }: Props) {
  const { supabase } = await requireAdminPage();
  const all = await loadAllContent(supabase);
  const entries = buildContentIndex({ ...all, rowsOf: (def) => rowsOf(all, def) });
  const params = await searchParams;
  const initial: ExplorerFilters = {
    q: params.q ?? "",
    page: params.page ?? "",
    area: params.area ?? "",
    lang: params.lang === "ar" || params.lang === "en" ? params.lang : "any",
    missing: params.missing === "any" || params.missing === "ar" || params.missing === "en" ? params.missing : "",
    state: params.state ?? "",
  };
  return (
    <>
      <PageHeader title="Content explorer" description="Every text of the website in one place: search both languages, filter by page, type or status, and find texts that are missing a translation. Edit opens the right form." />
      <ContentExplorer entries={entries} pages={cmsPages.filter((p) => p.path).map((p) => ({ key: p.key, label: p.label }))} initial={initial} />
    </>
  );
}
