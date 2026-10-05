import type { Metadata } from "next";
import { InboxList, type Submission } from "@/components/admin/InboxList";
import { PageHeader } from "@/components/admin/PageHeader";
import { loadSettings } from "@/lib/cms/admin/data";
import { requireAdminPage } from "@/lib/cms/admin/session";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage() {
  const { supabase } = await requireAdminPage();
  const [{ data, error }, settings] = await Promise.all([supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(500), loadSettings(supabase)]);
  if (error) throw new Error(`Could not load the inbox: ${error.message}`);
  return (
    <>
      <PageHeader title="Inbox" description="Messages sent through the contact form. Only administrators can read them. Treat them as confidential patient communication." />
      <InboxList initial={(data ?? []) as Submission[]} storing={settings?.form_store_submissions !== false} />
    </>
  );
}
