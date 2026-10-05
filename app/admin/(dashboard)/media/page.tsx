import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { PageHeader } from "@/components/admin/PageHeader";
import { loadAllMedia, loadMediaUsages } from "@/lib/cms/admin/data";
import { requireAdminPage } from "@/lib/cms/admin/session";

export const metadata: Metadata = { title: "Media library" };

type Props = { searchParams: Promise<{ item?: string }> };

export default async function MediaPage({ searchParams }: Props) {
  const { supabase } = await requireAdminPage();
  const [items, usages] = await Promise.all([loadAllMedia(supabase), loadMediaUsages(supabase)]);
  const { item } = await searchParams;
  return (
    <>
      <PageHeader
        title="Media library"
        description="Every image and video of the website. Upload new files, describe images for screen readers in both languages, replace a file everywhere at once, and see where each one is used. Files in use cannot be deleted."
      />
      <MediaLibrary initial={items} usages={usages} initialItem={item} />
    </>
  );
}
