import type { Metadata } from "next";
import { PasswordForm } from "@/components/admin/AuthForms";
import { PageHeader } from "@/components/admin/PageHeader";
import { requireAdminPage } from "@/lib/cms/admin/session";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const session = await requireAdminPage();
  return (
    <>
      <PageHeader title="My account" description={`Signed in as ${session.email} (${session.role}).`} />
      <section className="adm-card p-5 sm:p-6" aria-labelledby="password-title">
        <h2 id="password-title" className="mb-4 text-base font-bold">
          Change password
        </h2>
        <PasswordForm />
      </section>
    </>
  );
}
