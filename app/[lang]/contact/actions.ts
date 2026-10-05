"use server";

import { isLocale } from "@/i18n/config";
import { normalizeContact, validateContact, type ContactFormValues, type ContactResult } from "@/lib/contact-form";
import { getSite } from "@/lib/content";
import { publicSupabase } from "@/lib/supabase/public";

/**
 * Receives the contact form. Input is re-validated here — the browser
 * checks are only for convenience.
 *
 * Delivery, in any combination:
 *  - the CMS inbox (Supabase table contact_submissions), when Supabase is
 *    connected and "Save messages in the dashboard" is on in Global
 *    settings. Visitors can insert but never read it (Row Level Security);
 *  - CONTACT_FORM_ENDPOINT (server-only env var): any HTTPS endpoint that
 *    accepts a JSON POST — a form service, an Edge Function, a CRM webhook.
 * With neither, the visitor is offered the same message via WhatsApp, so
 * no enquiry is silently lost.
 *
 * `locale` is the site language the visitor used, so the clinic can reply in it.
 */
export async function submitContactForm(input: unknown, locale?: unknown): Promise<ContactResult> {
  const values = normalizeContact(typeof input === "object" && input !== null ? input : {});

  // Honeypot filled → a bot. Pretend success, deliver nothing.
  if (values.company) return { status: "success" };

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const language = isLocale(locale) ? locale : "ar";
  const endpoint = process.env.CONTACT_FORM_ENDPOINT;
  const storeInInbox = Boolean(publicSupabase) && (await getSite(language)).storeSubmissions;
  if (!endpoint && !storeInInbox) return { status: "not-configured" };

  const deliveries = await Promise.all([
    storeInInbox ? saveToInbox(values, language) : Promise.resolve(false),
    endpoint ? forward(endpoint, values, language) : Promise.resolve(false),
  ]);
  return deliveries.some(Boolean) ? { status: "success" } : { status: "error" };
}

async function saveToInbox(values: ContactFormValues, locale: "ar" | "en"): Promise<boolean> {
  if (!publicSupabase) return false;
  const { error } = await publicSupabase.from("contact_submissions").insert({
    locale,
    name: values.name,
    phone: values.phone,
    email: values.email || null,
    subject: values.subject,
    message: values.message,
    page: `/${locale}/contact`,
  });
  if (error) console.error(`Contact form: could not save the message (${error.message}).`);
  return !error;
}

async function forward(endpoint: string, values: ContactFormValues, locale: "ar" | "en"): Promise<boolean> {
  const { name, phone, email, subject, message } = values;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        subject,
        message,
        language: locale,
        source: "website-contact-form",
        submittedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
