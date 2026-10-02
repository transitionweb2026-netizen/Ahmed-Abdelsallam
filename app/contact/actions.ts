"use server";

import { normalizeContact, validateContact, type ContactResult } from "@/lib/contact-form";

/**
 * Receives the contact form. Input is re-validated here — the browser
 * checks are only for convenience.
 *
 * Delivery: set CONTACT_FORM_ENDPOINT (server-only env var) to any HTTPS
 * endpoint that accepts a JSON POST — a form service, a Supabase Edge
 * Function, a CRM webhook. Until it is set, the visitor is offered the same
 * message via WhatsApp instead, so no enquiry is silently lost.
 */
export async function submitContactForm(input: unknown): Promise<ContactResult> {
  const values = normalizeContact(typeof input === "object" && input !== null ? input : {});

  // Honeypot filled → a bot. Pretend success, deliver nothing.
  if (values.company) return { status: "success" };

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const endpoint = process.env.CONTACT_FORM_ENDPOINT;
  if (!endpoint) return { status: "not-configured" };

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
        source: "website-contact-form",
        submittedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok ? { status: "success" } : { status: "error" };
  } catch {
    return { status: "error" };
  }
}
