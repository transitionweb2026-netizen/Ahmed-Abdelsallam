"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ActionError, requireAdmin, run } from "@/lib/cms/admin/session";
import type { ActionResult } from "@/lib/cms/admin/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string } | null;

/** Only redirect inside the dashboard after signing in (no open redirects). */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return /^\/admin(\/[A-Za-z0-9/_-]*)?(\?[A-Za-z0-9=&%_.-]*)?$/.test(next) ? next : "/admin";
}

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return { error: "The CMS is not connected to Supabase yet." };
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    // Same message whether the account exists or not.
    return { error: error && /rate|too many/i.test(error.message) ? "Too many attempts. Please wait a minute and try again." : "Incorrect email or password." };
  }
  // Access comes from a row in public.admins, read with the new session (RLS: own row).
  const { data: admin } = await supabase.from("admins").select("role").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "This account does not have access to the CMS. Ask an owner to add you under Admin users." };
  }
  redirect(safeNext(form.get("next")));
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

/** The site's own address for auth e-mail links (the configured URL in production). */
async function origin(): Promise<string> {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (/^(localhost|127\.0\.0\.1)(:|$)/.test(host) ? "http" : "https");
  return `${proto}://${host}`;
}

export async function requestPasswordReset(_: FormState, form: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return { error: "The CMS is not connected to Supabase yet." };
  const email = String(form.get("email") ?? "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Enter a valid email address." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${await origin()}/admin/auth/confirm?next=/admin/account` });
  if (error && /rate|too many/i.test(error.message)) return { error: "Too many requests. Please wait a few minutes and try again." };
  // Never reveal whether an account exists.
  return { message: "If an account exists for this address, an email with a reset link is on its way. The link works once and expires after a while." };
}

export async function updatePassword(input: { password: string; confirm: string }): Promise<ActionResult<undefined>> {
  return run(async () => {
    const { supabase } = await requireAdmin();
    const password = String(input.password ?? "");
    if (password.length < 10) throw new ActionError("Use at least 10 characters.");
    if (password !== input.confirm) throw new ActionError("The two passwords do not match.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new ActionError(/same|different/i.test(error.message) ? "Choose a password different from the current one." : error.message);
    return undefined;
  });
}
