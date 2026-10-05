import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { UsersAdmin, type AdminRow } from "@/components/admin/UsersAdmin";
import { requireAdminPage } from "@/lib/cms/admin/session";

export const metadata: Metadata = { title: "Admin users" };

export default async function UsersPage() {
  const session = await requireAdminPage();
  if (session.role !== "owner") {
    return (
      <>
        <PageHeader title="Admin users" />
        <EmptyState title="Only owners can manage administrators" />
      </>
    );
  }
  const { data, error } = await session.supabase.from("admins").select("user_id, email, role, created_at").order("created_at");
  if (error) throw new Error(`Could not load the administrators: ${error.message}`);
  return (
    <>
      <PageHeader title="Admin users" description="Who can sign in to this dashboard. Access is granted by this list on the server — never by anything stored in the browser." />
      <UsersAdmin admins={(data ?? []) as AdminRow[]} selfId={session.userId} />
    </>
  );
}
