import type { Metadata } from "next";
import { CollectionHub } from "@/components/admin/CollectionHub";
import { requireAdminPage } from "@/lib/cms/admin/session";

export const metadata: Metadata = { title: "Timelines" };

export default async function TimelinesPage() {
  const { supabase } = await requireAdminPage();
  return <CollectionHub supabase={supabase} title="Timelines" description="Step-by-step sections: the patient journey, the diagnosis steps and the doctor's career." keys={["journey", "diagnosis", "career"]} />;
}
