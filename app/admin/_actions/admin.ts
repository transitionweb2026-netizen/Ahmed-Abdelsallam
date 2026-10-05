"use server";

import { revalidatePath } from "next/cache";
import { ActionError, check, requireAdmin, requireOwner, run } from "@/lib/cms/admin/session";
import type { ActionResult } from "@/lib/cms/admin/types";

/* ---- Contact-form inbox ---------------------------------------------------------- */

export async function setSubmissionStatus(id: string, status: "new" | "read" | "archived"): Promise<ActionResult<undefined>> {
  return run(async () => {
    if (!["new", "read", "archived"].includes(status)) throw new ActionError("Unknown status.");
    const { supabase } = await requireAdmin();
    check(await supabase.from("contact_submissions").update({ status }).eq("id", id));
    revalidatePath("/admin", "layout");
    return undefined;
  });
}

export async function deleteSubmission(id: string): Promise<ActionResult<undefined>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    check(await supabase.from("contact_submissions").delete().eq("id", id));
    revalidatePath("/admin", "layout");
    return undefined;
  });
}

/* ---- Administrators (owners only; enforced again inside the database functions) ---- */

export async function grantAdmin(email: string, role: "owner" | "editor"): Promise<ActionResult<undefined>> {
  return run(async () => {
    const { supabase } = await requireOwner();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email).trim())) throw new ActionError("Enter a valid email address.");
    if (role !== "owner" && role !== "editor") throw new ActionError("Choose a role.");
    const { error } = await supabase.rpc("admin_grant", { p_email: String(email).trim(), p_role: role });
    if (error) throw new ActionError(error.code === "P0002" || /No Supabase Auth user/i.test(error.message) ? "No user with this email yet. Create or invite the user in Supabase (Authentication → Users) first, then add them here." : error.message);
    revalidatePath("/admin/users");
    return undefined;
  });
}

export async function revokeAdmin(userId: string): Promise<ActionResult<undefined>> {
  return run(async () => {
    const session = await requireOwner();
    if (userId === session.userId) throw new ActionError("You cannot remove your own access. Ask another owner.");
    const { error } = await session.supabase.rpc("admin_revoke", { p_user_id: userId });
    if (error) throw new ActionError(/at least one owner/i.test(error.message) ? "The CMS must keep at least one owner." : error.message);
    revalidatePath("/admin/users");
    return undefined;
  });
}
