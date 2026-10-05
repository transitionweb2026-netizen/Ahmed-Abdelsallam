import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
  badges?: ReactNode;
};

export function PageHeader({ title, description, back, actions, badges }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-dark">
            <ArrowLeft size={15} aria-hidden /> {back.label}
          </Link>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
          {badges}
        </div>
        {description && <p className="mt-1 max-w-3xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="adm-card px-6 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-muted">{children}</div>}
    </div>
  );
}
