import type { Metadata } from "next";
import { DocForm } from "@/components/admin/DocForm";
import { EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { loadMediaMap, loadSettings, mediaIdsOf } from "@/lib/cms/admin/data";
import { requireAdminPage } from "@/lib/cms/admin/session";
import { rowToDoc } from "@/lib/cms/fields";
import { settingsFields } from "@/lib/cms/registry";

export const metadata: Metadata = { title: "Global settings" };

export default async function SettingsPage() {
  const { supabase } = await requireAdminPage();
  const settings = await loadSettings(supabase);
  if (!settings) {
    return (
      <>
        <PageHeader title="Global settings" />
        <EmptyState title="No settings in the database yet">Import the website&apos;s content first (Dashboard → Import content).</EmptyState>
      </>
    );
  }
  const doc = rowToDoc(settingsFields, settings as unknown as Record<string, unknown>);
  const media = await loadMediaMap(supabase, mediaIdsOf(settingsFields, doc));
  return (
    <>
      <PageHeader title="Global settings" description="The doctor's name and title, contact details, clinic address, hours and map, logo and sharing images — used across every page in both languages." />
      <DocForm target={{ kind: "settings" }} initialDoc={doc} media={media} />
    </>
  );
}
