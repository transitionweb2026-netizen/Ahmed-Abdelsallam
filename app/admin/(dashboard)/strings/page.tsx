import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { UiStringsEditor, type UiStringItem } from "@/components/admin/UiStringsEditor";
import { getDictionary } from "@/i18n/dictionaries";
import { loadUiStrings } from "@/lib/cms/admin/data";
import { requireAdminPage } from "@/lib/cms/admin/session";
import { flattenDictionary, uiStringGroups } from "@/lib/cms/ui-strings";

export const metadata: Metadata = { title: "Interface text" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function StringsPage({ searchParams }: Props) {
  const { supabase } = await requireAdminPage();
  const rows = await loadUiStrings(supabase);
  const ar = flattenDictionary(getDictionary("ar"));
  const en = flattenDictionary(getDictionary("en"));
  const items: UiStringItem[] = [...new Set([...Object.keys(ar), ...Object.keys(en)])].map((key) => ({
    key,
    group: uiStringGroups[key.split(".")[0]] ?? key.split(".")[0],
    defaultAr: ar[key] ?? "",
    defaultEn: en[key] ?? "",
  }));
  const known = new Set(items.map((item) => item.key));
  const initial = Object.fromEntries(rows.filter((r) => known.has(r.key)).map((r) => [r.key, { ar: r.value_ar, en: r.value_en }]));
  const { q = "" } = await searchParams;

  return (
    <>
      <PageHeader
        title="Interface text"
        description="Buttons, labels, accessible names and messages used across the website. The grey placeholder shows the built-in wording, used whenever a field is left empty. Menu labels are edited under Navigation."
      />
      <UiStringsEditor items={items} initial={initial} initialQuery={q} />
    </>
  );
}

