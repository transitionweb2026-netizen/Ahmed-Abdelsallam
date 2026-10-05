"use client";

import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { grantAdmin, revokeAdmin } from "@/app/admin/_actions/admin";
import { useConfirm, useToast } from "./Feedback";
import { LocalTime } from "./LocalTime";

export interface AdminRow {
  user_id: string;
  email: string;
  role: "owner" | "editor";
  created_at: string;
}

export function UsersAdmin({ admins, selfId }: { admins: AdminRow[]; selfId: string }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "owner">("editor");
  const [busy, setBusy] = useState(false);

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const result = await grantAdmin(email, role);
    setBusy(false);
    if (!result.ok) return toast("error", result.error);
    toast("success", `${email} can now use the CMS.`);
    setEmail("");
    router.refresh();
  };

  const changeRole = async (admin: AdminRow, next: AdminRow["role"]) => {
    if (next === admin.role) return;
    const result = await grantAdmin(admin.email, next);
    if (!result.ok) return toast("error", result.error);
    toast("success", `${admin.email} is now ${next === "owner" ? "an owner" : "an editor"}.`);
    router.refresh();
  };

  const remove = async (admin: AdminRow) => {
    if (!(await confirm({ title: `Remove ${admin.email}?`, body: "They will no longer be able to use the CMS. Their Supabase account itself is not deleted.", confirmLabel: "Remove access", danger: true }))) return;
    const result = await revokeAdmin(admin.user_id);
    if (!result.ok) return toast("error", result.error);
    toast("success", "Access removed.");
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <section className="adm-card relative overflow-x-auto p-5" aria-labelledby="admins-title">
        <h2 id="admins-title" className="mb-3 text-base font-bold">
          Administrators
        </h2>
        <table className="adm-table min-w-[32rem]">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Since</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.user_id}>
                <td className="font-medium">
                  {admin.email}
                  {admin.user_id === selfId && <span className="adm-badge adm-badge-blue ms-2">you</span>}
                </td>
                <td>
                  <select value={admin.role} onChange={(e) => changeRole(admin, e.target.value as AdminRow["role"])} className="adm-input w-auto py-1" aria-label={`Role of ${admin.email}`} disabled={admin.user_id === selfId}>
                    <option value="editor">Editor</option>
                    <option value="owner">Owner</option>
                  </select>
                </td>
                <td>
                  <LocalTime iso={admin.created_at} withYear />
                </td>
                <td className="text-end">
                  {admin.user_id !== selfId && (
                    <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => remove(admin)}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="adm-card p-5" aria-labelledby="add-title">
        <h2 id="add-title" className="text-base font-bold">
          Add an administrator
        </h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          First create or invite the person in Supabase (Authentication → Users → Invite user) so they can set their own password. Then add their email here. Editors can change all website content; owners can also manage administrators and import content.
        </p>
        <form onSubmit={add} className="flex flex-wrap items-end gap-3">
          <label className="grid min-w-60 flex-1 gap-1">
            <span className="adm-label">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="adm-input" autoComplete="off" dir="ltr" />
          </label>
          <label className="grid gap-1">
            <span className="adm-label">Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value as typeof role)} className="adm-input">
              <option value="editor">Editor</option>
              <option value="owner">Owner</option>
            </select>
          </label>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={busy}>
            <UserPlus size={15} aria-hidden /> Add
          </button>
        </form>
      </section>
    </div>
  );
}
