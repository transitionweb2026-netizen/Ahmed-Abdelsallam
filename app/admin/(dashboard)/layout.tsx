import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { NoAccessScreen, SetupScreen } from "@/components/admin/Screens";
import { getSession } from "@/lib/cms/admin/session";

/**
 * Every dashboard page. The proxy already sends signed-out visitors to the
 * login page; this re-checks on the server and requires a row in
 * public.admins. (Each page and Server Action checks again: layouts are
 * not re-run on client-side navigation.)
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session.status === "not-configured") return <SetupScreen />;
  if (session.status === "signed-out") redirect("/admin/login");
  if (session.status === "not-admin") return <NoAccessScreen email={session.email} />;

  const { count } = await session.supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new");
  return (
    <AdminShell email={session.email} role={session.role} unread={count ?? 0}>
      {children}
    </AdminShell>
  );
}
