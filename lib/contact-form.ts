/**
 * Contact form model, shared by the browser (instant feedback) and the
 * server action (authoritative validation). Validation returns language-
 * neutral error codes; the messages live in the dictionaries (form.errors).
 */

export interface ContactFormValues {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — must stay empty (hidden from people, filled by bots). */
  company?: string;
}

export type ContactField = "name" | "phone" | "email" | "subject" | "message";
export type ContactErrorCode =
  | "nameShort"
  | "nameLong"
  | "phoneRequired"
  | "phoneInvalid"
  | "emailInvalid"
  | "subjectRequired"
  | "subjectLong"
  | "messageShort"
  | "messageLong";
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

export type ContactResult =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; errors: ContactErrors }
  /** No delivery endpoint configured yet (see CONTACT_FORM_ENDPOINT). */
  | { status: "not-configured" }
  | { status: "error" };

export const CONTACT_LIMITS = { name: 80, email: 120, subject: 80, message: 1500, messageMin: 10 } as const;

export const CONTACT_FIELDS: ContactField[] = ["name", "phone", "email", "subject", "message"];

/** Arabic-Indic (٠-٩) and Persian (۰-۹) digits → ASCII. */
function toLatinDigits(value: string): string {
  return value.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/** Coerces untrusted input into trimmed strings with normalised digits. */
export function normalizeContact(input: Partial<Record<keyof ContactFormValues, unknown>>): ContactFormValues {
  const text = (value: unknown) => (typeof value === "string" ? value : "").trim();
  return {
    name: text(input.name),
    phone: toLatinDigits(text(input.phone)),
    email: text(input.email),
    subject: text(input.subject),
    message: text(input.message),
    company: text(input.company),
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// 8–15 digits, optional leading "+", separators allowed while typing.
const PHONE = /^\+?\d{8,15}$/;

export function validateContact(values: ContactFormValues): ContactErrors {
  const errors: ContactErrors = {};

  if (values.name.length < 2) errors.name = "nameShort";
  else if (values.name.length > CONTACT_LIMITS.name) errors.name = "nameLong";

  const phone = values.phone.replace(/[\s().-]/g, "");
  if (!phone) errors.phone = "phoneRequired";
  else if (!PHONE.test(phone)) errors.phone = "phoneInvalid";

  if (values.email) {
    if (values.email.length > CONTACT_LIMITS.email || !EMAIL.test(values.email)) {
      errors.email = "emailInvalid";
    }
  }

  if (!values.subject) errors.subject = "subjectRequired";
  else if (values.subject.length > CONTACT_LIMITS.subject) errors.subject = "subjectLong";

  if (values.message.length < CONTACT_LIMITS.messageMin) errors.message = "messageShort";
  else if (values.message.length > CONTACT_LIMITS.message) errors.message = "messageLong";

  return errors;
}

/** Plain-text version of a submission, e.g. for a WhatsApp fallback. */
export function contactSummary(values: ContactFormValues, labels: Record<ContactField, string>): string {
  return CONTACT_FIELDS.filter((field) => values[field])
    .map((field) => `${labels[field]}: ${values[field]}`)
    .join("\n");
}
