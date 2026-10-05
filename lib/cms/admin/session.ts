import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { InvalidInput } from "@/lib/cms/admin/mutations";
import type { ActionResult } from "@/lib/cms/admin/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminSession {
  supabase: SupabaseClient;
  userId: string;
  email: string;
  role: "owner" | "editor";
}

export type SessionState =
  | { status: "not-configured" }
  | { status: "signed-out" }
  | { status: "not-admin"; email: string }
  | ({ status: "admin" } & AdminSession);

/**
 * The signed-in user and their CMS role (a row in public.admins — never a
 * client-side flag). Every admin read and write uses this cookie-bound
 * client, so Row Level Security is the final gatekeeper.
 */
export const getSession = cache(async (): Promise<SessionState> => {
  // Always per request: dashboard pages must never be prerendered or cached.
  await connection();
  if (!isSupabaseConfigured) return { status: "not-configured" };
  const supabase = await createSupabaseServerClient();
  // getUser() verifies the token with Supabase Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "signed-out" };
  const { data } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!data) return { status: "not-admin", email: user.email ?? "" };
  return { status: "admin", supabase, userId: user.id, email: user.email ?? "", role: data.role as AdminSession["role"] };
});

/** For dashboard pages: the admin session, or a redirect to the login page. */
export async function requireAdminPage(): Promise<AdminSession> {
  const session = await getSession();
  if (session.status === "admin") return session;
  redirect(session.status === "not-admin" ? "/admin/login?error=not-admin" : "/admin/login");
}

export class ActionError extends Error {}

/** For Server Actions: the admin session, or an error the caller turns into a message. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (session.status === "admin") return session;
  if (session.status === "not-admin") throw new ActionError("This account does not have access to the CMS.");
  throw new ActionError("Your session has expired. Please sign in again.");
}

export async function requireOwner(): Promise<AdminSession> {
  const session = await requireAdmin();
  if (session.role !== "owner") throw new ActionError("Only owners can manage administrators.");
  return session;
}

/** Rebuilds every public page (both languages) and the sitemap after a change. */
export function revalidateSite() {
  revalidatePath("/[lang]", "layout");
  revalidatePath("/sitemap.xml");
}

/** Runs an action body, turning expected failures into a message for the form. */
export async function run<T>(body: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await body() };
  } catch (error) {
    if (error instanceof ActionError) return { ok: false, error: error.message };
    if (error instanceof InvalidInput) return { ok: false, error: "Please correct the highlighted fields.", fieldErrors: error.fieldErrors };
    // Next.js uses thrown errors for redirects/notFound: let those through.
    if (error && typeof error === "object" && "digest" in error) throw error;
    console.error("CMS action failed:", error);
    return { ok: false, error: friendlyDbError(error) };
  }
}

/** Turns a Supabase/Postgres error into a sentence an editor can act on. */
export function friendlyDbError(error: unknown): string {
  const e = error as { code?: string; message?: string; details?: string };
  const message = e?.message ?? String(error);
  if (e?.code === "23505") return "That identifier is already used by another item. Choose a different one.";
  if (e?.code === "23503") return "This item is still used elsewhere on the website (for example by another item or a page section). Remove those uses first.";
  if (e?.code === "23514") return `A value is not allowed by the database rules (${e.details ?? message}).`;
  if (e?.code === "42501" || /row-level security|permission denied/i.test(message)) return "You do not have permission to make this change.";
  if (/JWT|session/i.test(message)) return "Your session has expired. Please sign in again.";
  return `The change could not be saved (${message}).`;
}

/** Throws a PostgREST error so run() reports it. */
export function check<T>(result: { data: T; error: unknown }): T {
  if (result.error) throw result.error;
  return result.data;
}
