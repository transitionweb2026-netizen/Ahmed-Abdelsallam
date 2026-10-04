"use client";

import { ChevronDown, CircleAlert, CircleCheck, Mail, MessageSquareText, Phone, Tag, TriangleAlert, UserRound } from "lucide-react";
import { useId, useState, useTransition, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { submitContactForm } from "@/app/[lang]/contact/actions";
import { useDictionary, useLocale } from "@/components/i18n/LocaleProvider";
import { GlassButton } from "@/components/ui/GlassButton";
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  contactSummary,
  normalizeContact,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactFormValues,
  type ContactResult,
} from "@/lib/contact-form";
import { cn, whatsappUrl } from "@/lib/utils";
import type { ContactFormCopy } from "@/types/content";
import styles from "./ContactForm.module.css";

const EMPTY: ContactFormValues = { name: "", phone: "", email: "", subject: "", message: "", company: "" };

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  optionalLabel?: string;
  icon: ReactNode;
  children: ReactNode;
  multiline?: boolean;
  hint?: ReactNode;
}

function Field({ id, label, error, optionalLabel, icon, children, multiline, hint }: FieldProps) {
  return (
    <div className={cn(styles.field, multiline && styles.fieldWide)} data-invalid={error ? "true" : undefined}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optionalLabel ? (
          <span className={styles.optional}>({optionalLabel})</span>
        ) : (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className={cn(styles.control, multiline && styles.controlMultiline)}>
        <span className={styles.fieldIcon} aria-hidden="true">
          {icon}
        </span>
        {children}
      </div>
      <div className={styles.below}>
        {error ? (
          <p id={`${id}-error`} className={styles.error}>
            <CircleAlert size={15} aria-hidden="true" />
            {error}
          </p>
        ) : (
          <span />
        )}
        {hint}
      </div>
    </div>
  );
}

interface ContactFormProps {
  copy: ContactFormCopy;
}

/**
 * Glass contact form. Validates in the browser for instant, accessible
 * feedback (labelled errors, first invalid field focused), then submits to
 * a Server Action that validates again and delivers the message.
 */
export function ContactForm({ copy }: ContactFormProps) {
  const locale = useLocale();
  const t = useDictionary();
  const uid = useId();
  const id = (field: ContactField) => `${uid}-${field}`;
  const [values, setValues] = useState<ContactFormValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [result, setResult] = useState<ContactResult>({ status: "idle" });
  const [lastSent, setLastSent] = useState<ContactFormValues | null>(null);
  const [pending, startTransition] = useTransition();

  const update =
    (field: keyof ContactFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      // After the first submit attempt, errors clear as they are fixed.
      if (attempted) setErrors(validateContact(normalizeContact(next)));
    };

  const focusFirstError = (found: ContactErrors) => {
    const first = CONTACT_FIELDS.find((field) => found[field]);
    if (first) document.getElementById(id(first))?.focus();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setAttempted(true);
    const clean = normalizeContact(values);
    const found = validateContact(clean);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setResult({ status: "idle" });
      focusFirstError(found);
      return;
    }
    startTransition(async () => {
      const response = await submitContactForm(clean, locale);
      if (response.status === "invalid") {
        setErrors(response.errors);
        focusFirstError(response.errors);
        return;
      }
      setResult(response);
      setLastSent(clean);
      if (response.status === "success") {
        setValues(EMPTY);
        setAttempted(false);
      }
    });
  };

  const describedBy = (field: ContactField, extra?: string) =>
    [errors[field] ? `${id(field)}-error` : null, extra].filter(Boolean).join(" ") || undefined;
  const invalid = (field: ContactField) => (errors[field] ? true : undefined);
  const errorText = (field: ContactField) => {
    const code = errors[field];
    return code ? t.form.errors[code] : undefined;
  };
  const hasErrors = attempted && Object.keys(errors).length > 0;
  const whatsappFallback = lastSent ? whatsappUrl(contactSummary(lastSent, copy.labels)) : whatsappUrl();

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-busy={pending || undefined}>
      <Field id={id("name")} label={copy.labels.name} error={errorText("name")} icon={<UserRound size={18} />}>
        <input
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          className={styles.input}
          placeholder={copy.placeholders.name}
          value={values.name}
          onChange={update("name")}
          maxLength={CONTACT_LIMITS.name}
          required
          aria-invalid={invalid("name")}
          aria-describedby={describedBy("name")}
        />
      </Field>

      <Field id={id("phone")} label={copy.labels.phone} error={errorText("phone")} icon={<Phone size={18} />}>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          className={cn(styles.input, styles.ltr)}
          placeholder={copy.placeholders.phone}
          value={values.phone}
          onChange={update("phone")}
          maxLength={24}
          required
          aria-invalid={invalid("phone")}
          aria-describedby={describedBy("phone")}
        />
      </Field>

      <Field
        id={id("email")}
        label={copy.labels.email}
        error={errorText("email")}
        optionalLabel={copy.optional}
        icon={<Mail size={18} />}
      >
        <input
          id={id("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          className={cn(styles.input, styles.ltr)}
          placeholder={copy.placeholders.email}
          value={values.email}
          onChange={update("email")}
          maxLength={CONTACT_LIMITS.email}
          aria-invalid={invalid("email")}
          aria-describedby={describedBy("email")}
        />
      </Field>

      <Field id={id("subject")} label={copy.labels.subject} error={errorText("subject")} icon={<Tag size={18} />}>
        <select
          id={id("subject")}
          name="subject"
          className={cn(styles.input, styles.select)}
          value={values.subject}
          onChange={update("subject")}
          required
          aria-invalid={invalid("subject")}
          aria-describedby={describedBy("subject")}
        >
          <option value="" disabled>
            {copy.placeholders.subject}
          </option>
          {copy.subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.selectIcon} size={18} aria-hidden="true" />
      </Field>

      <Field
        id={id("message")}
        label={copy.labels.message}
        error={errorText("message")}
        icon={<MessageSquareText size={18} />}
        multiline
        hint={
          <span id={`${id("message")}-count`} className={styles.counter} dir="ltr">
            {values.message.length} / {CONTACT_LIMITS.message}
          </span>
        }
      >
        <textarea
          id={id("message")}
          name="message"
          rows={5}
          className={cn(styles.input, styles.textarea)}
          placeholder={copy.placeholders.message}
          value={values.message}
          onChange={update("message")}
          maxLength={CONTACT_LIMITS.message}
          required
          aria-invalid={invalid("message")}
          aria-describedby={describedBy("message", `${id("message")}-count`)}
        />
      </Field>

      {/* Honeypot — hidden from people and assistive technology. */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={update("company")}
          />
        </label>
      </div>

      {/* Validation problems and the outcome, announced and shown right
          above the submit button where the visitor's attention is. */}
      <div className={styles.status} role="status" aria-live="polite">
        {hasErrors ? (
          <p className={cn(styles.notice, styles.noticeError)}>
            <CircleAlert size={18} aria-hidden="true" />
            {copy.errorSummary}
          </p>
        ) : null}

        {result.status === "success" ? (
          <div className={cn(styles.notice, styles.noticeSuccess)}>
            <CircleCheck size={22} aria-hidden="true" />
            <div>
              <p className={styles.noticeTitle}>{copy.success.title}</p>
              <p>{copy.success.text}</p>
            </div>
          </div>
        ) : null}

        {result.status === "not-configured" ? (
          <div className={cn(styles.notice, styles.noticeInfo)}>
            <TriangleAlert size={22} aria-hidden="true" />
            <div className={styles.noticeBody}>
              <p className={styles.noticeTitle}>{copy.notConfigured.title}</p>
              <p>{copy.notConfigured.text}</p>
              <GlassButton
                href={whatsappFallback}
                external
                size="sm"
                icon="whatsapp"
                ariaLabel={`${copy.notConfigured.whatsappLabel} ${t.common.newTab}`}
              >
                {copy.notConfigured.whatsappLabel}
              </GlassButton>
            </div>
          </div>
        ) : null}

        {result.status === "error" ? (
          <div className={cn(styles.notice, styles.noticeError)}>
            <CircleAlert size={22} aria-hidden="true" />
            <div>
              <p className={styles.noticeTitle}>{copy.failure.title}</p>
              <p>{copy.failure.text}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.submitRow}>
        <GlassButton type="submit" size="lg" loading={pending} className={styles.submit}>
          {pending ? copy.sending : copy.submit}
        </GlassButton>
      </div>
    </form>
  );
}
