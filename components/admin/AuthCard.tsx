import type { ReactNode } from "react";

/** Centered card for the sign-in and password-reset pages. */
export function AuthCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="adm-card w-full max-w-sm p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-brand to-brand-dark text-sm font-bold text-white" aria-hidden>
            A
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">Dr. Ahmed Abdelsalam</span>
            <span className="block text-xs text-muted">Website content</span>
          </span>
        </div>
        <h1 className="text-xl font-bold">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </main>
  );
}
