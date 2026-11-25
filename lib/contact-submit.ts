"use client";

import type { Locale } from "@/i18n/config";
import { validateContact, type ContactFormValues, type ContactResult } from "@/lib/contact-form";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Submits the contact form straight from the browser (no server runtime
 * required, so this also works from the static export). Authorization is
 * Row Level Security on `contact_submissions`, the same gate the old Server
 * Action relied on — RLS, not where the insert call happens, is what
 * protects the table.
 *
 * `storeSubmissions` is the CMS's "save messages in the dashboard" toggle
 * (Global settings); the caller reads it server-side and passes it down
 * since it isn't part of the public `ClientSiteData`.
 */
export async function submitContact(values: ContactFormValues, locale: Locale, storeSubmissions: boolean): Promise<ContactResult> {
  // Honeypot filled → a bot. Pretend success, deliver nothing.
  if (values.company) return { status: "success" };

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  if (!isSupabaseConfigured || !storeSubmissions) return { status: "not-configured" };

  const { error } = await getSupabaseBrowserClient().from("contact_submissions").insert({
    locale,
    name: values.name,
    phone: values.phone,
    email: values.email || null,
    subject: values.subject,
    message: values.message,
    page: `/${locale}/contact`,
  });
  if (error) console.error(`Contact form: could not save the message (${error.message}).`);
  return { status: error ? "error" : "success" };
}
