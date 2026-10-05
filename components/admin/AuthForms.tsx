"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { requestPasswordReset, signIn, updatePassword, type FormState } from "@/app/admin/_actions/auth";
import { useToast } from "./Feedback";

function Message({ state }: { state: FormState }) {
  if (!state) return null;
  return state.error ? (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200">
      {state.error}
    </p>
  ) : state.message ? (
    <p role="status" className="rounded-lg bg-[#e5f5ec] px-3 py-2 text-sm text-[#1f6b43] ring-1 ring-[#bfe3cf]">
      {state.message}
    </p>
  ) : null;
}

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [state, action, pending] = useActionState(signIn, initialError ? { error: initialError } : null);
  return (
    <form action={action} className="grid gap-4">
      <Message state={state} />
      <input type="hidden" name="next" value={next ?? ""} />
      <label className="grid gap-1">
        <span className="adm-label">Email</span>
        <input name="email" type="email" required autoComplete="username" className="adm-input" dir="ltr" />
      </label>
      <label className="grid gap-1">
        <span className="adm-label">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="adm-input" dir="ltr" />
      </label>
      <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
        {pending && <Loader2 size={15} className="animate-spin" aria-hidden />} Sign in
      </button>
      <Link href="/admin/forgot-password" className="justify-self-center text-sm text-muted underline-offset-2 hover:underline">
        Forgot your password?
      </Link>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, null);
  return (
    <form action={action} className="grid gap-4">
      <Message state={state} />
      <label className="grid gap-1">
        <span className="adm-label">Email</span>
        <input name="email" type="email" required autoComplete="username" className="adm-input" dir="ltr" />
      </label>
      <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
        {pending && <Loader2 size={15} className="animate-spin" aria-hidden />} Send reset link
      </button>
      <Link href="/admin/login" className="justify-self-center text-sm text-muted underline-offset-2 hover:underline">
        Back to sign in
      </Link>
    </form>
  );
}

export function PasswordForm() {
  const toast = useToast();
  const [values, setValues] = useState({ password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const result = await updatePassword(values);
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setError("");
    setValues({ password: "", confirm: "" });
    toast("success", "Password changed.");
  };

  return (
    <form onSubmit={submit} className="grid max-w-sm gap-4">
      {error && <Message state={{ error }} />}
      <label className="grid gap-1">
        <span className="adm-label">New password</span>
        <input type="password" required minLength={10} autoComplete="new-password" value={values.password} onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} className="adm-input" dir="ltr" />
        <span className="adm-help">At least 10 characters. A long passphrase is best.</span>
      </label>
      <label className="grid gap-1">
        <span className="adm-label">Repeat the new password</span>
        <input type="password" required minLength={10} autoComplete="new-password" value={values.confirm} onChange={(e) => setValues((v) => ({ ...v, confirm: e.target.value }))} className="adm-input" dir="ltr" />
      </label>
      <button type="submit" className="adm-btn adm-btn-primary justify-self-start" disabled={busy}>
        {busy && <Loader2 size={15} className="animate-spin" aria-hidden />} Change password
      </button>
    </form>
  );
}
