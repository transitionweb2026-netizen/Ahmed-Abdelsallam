import type { Metadata } from "next";
import { CollectionHub } from "@/components/admin/CollectionHub";
import { requireAdminPage } from "@/lib/cms/admin/session";

export const metadata: Metadata = { title: "Statistics" };

export default async function StatisticsPage() {
  const { supabase } = await requireAdminPage();
  return (
    <CollectionHub
      supabase={supabase}
      title="Statistics"
      description="The figures on the home page (enter verified values only) and the counters on the About page, which count the published content automatically."
      keys={["home-stats", "about-stats"]}
    />
  );
}
