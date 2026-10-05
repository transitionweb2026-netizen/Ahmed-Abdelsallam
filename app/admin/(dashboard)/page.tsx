import { AlertTriangle, ArrowRight, FileText, Image as ImageIcon, Inbox, Info, Languages } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ImportButton } from "@/components/admin/ImportButton";
import { LocalTime } from "@/components/admin/LocalTime";
import { PageHeader } from "@/components/admin/PageHeader";
import { loadAllContent, rowsOf } from "@/lib/cms/admin/data";
import { attentionItems, buildContentIndex, recentChanges } from "@/lib/cms/admin/explorer";
import { requireAdminPage } from "@/lib/cms/admin/session";
import { formatBytes } from "@/lib/cms/media-rules";
import { collections } from "@/lib/cms/registry";

export const metadata: Metadata = { title: "Dashboard" };

export default async function OverviewPage() {
  const session = await requireAdminPage();
  const all = await loadAllContent(session.supabase);
  const input = { ...all, rowsOf: (def: (typeof collections)[number]) => rowsOf(all, def) };
  const entries = buildContentIndex(input);
  const attention = attentionItems(input, entries);
  const recent = recentChanges(input);
  const empty = !all.settings && all.sections.length === 0;
  const missing = entries.filter((e) => e.missing).length;
  const hiddenSections = all.sections.filter((s) => !s.visible).length;
  const drafts = collections.reduce((sum, def) => sum + (def.hasStatus ? rowsOf(all, def).filter((r) => r.status === "draft").length : 0), 0);

  const cards = [
    { label: "Page sections", value: all.sections.length, note: hiddenSections ? `${hiddenSections} hidden` : "all visible", href: "/admin/pages", icon: FileText },
    { label: "Media files", value: all.mediaCount, note: `${formatBytes(all.mediaBytes)} in total`, href: "/admin/media", icon: ImageIcon },
    { label: "Missing translations", value: missing, note: missing ? "texts in one language only" : "both languages complete", href: "/admin/content?missing=any", icon: Languages },
    { label: "Unread messages", value: all.inbox.unread, note: `${all.inbox.total} in the inbox`, href: "/admin/inbox", icon: Inbox },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of the website's content in Arabic and English."
        actions={session.role === "owner" && !empty ? <ImportButton empty={false} /> : null}
      />

      {empty && (
        <section className="adm-card mb-6 grid gap-3 p-6">
          <h2 className="text-lg font-bold">The CMS is empty</h2>
          <p className="text-sm text-muted">
            The database is connected but holds no content yet{session.role === "owner" ? ". Import the website's current content to start editing it here" : ". Ask an owner to import the website's content"} (or run <code className="rounded bg-[#eceffa] px-1">supabase/seed/content.sql</code> in the Supabase SQL editor). Until then the public website cannot load its content.
          </p>
          {session.role === "owner" && (
            <div>
              <ImportButton empty />
            </div>
          )}
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="adm-card grid gap-1 p-5 transition hover:ring-2 hover:ring-brand/30">
            <span className="flex items-center gap-2 text-sm font-medium text-muted">
              <card.icon size={16} aria-hidden /> {card.label}
            </span>
            <span className="text-3xl font-bold tabular-nums">{card.value}</span>
            <span className="text-xs text-muted">{card.note}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="adm-card p-5" aria-labelledby="collections-title">
          <h2 id="collections-title" className="mb-3 text-base font-bold">
            Collections
          </h2>
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">Collection</th>
                <th scope="col" className="text-end">
                  Published
                </th>
                <th scope="col" className="text-end">
                  Drafts
                </th>
              </tr>
            </thead>
            <tbody>
              {collections.map((def) => {
                const rows = rowsOf(all, def);
                const draftCount = def.hasStatus ? rows.filter((r) => r.status === "draft").length : 0;
                return (
                  <tr key={def.key}>
                    <td>
                      <Link href={`/admin/c/${def.key}`} className="font-medium hover:text-brand">
                        {def.label}
                      </Link>
                    </td>
                    <td className="text-end tabular-nums">{rows.length - draftCount}</td>
                    <td className={`text-end tabular-nums ${draftCount ? "font-semibold text-amber-700" : "text-muted"}`}>{def.hasStatus ? draftCount : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted">{drafts} draft{drafts === 1 ? "" : "s"} in total — drafts are never shown on the website.</p>
        </section>

        <div className="grid content-start gap-6">
          <section className="adm-card p-5" aria-labelledby="attention-title">
            <h2 id="attention-title" className="mb-3 text-base font-bold">
              Needs attention
            </h2>
            {attention.length ? (
              <ul className="grid gap-2">
                {attention.map((item) => (
                  <li key={item.text}>
                    <Link href={item.href} className={`flex gap-2 rounded-lg p-2.5 text-sm transition hover:ring-1 ${item.level === "warning" ? "bg-amber-50 text-amber-900 ring-amber-200" : "bg-[#f1f3fb] text-[#2c366b] ring-[#d5dbef]"}`}>
                      {item.level === "warning" ? <AlertTriangle size={16} className="mt-0.5 flex-none" aria-hidden /> : <Info size={16} className="mt-0.5 flex-none" aria-hidden />}
                      <span>{item.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">Nothing — everything looks complete.</p>
            )}
          </section>

          <section className="adm-card p-5" aria-labelledby="recent-title">
            <h2 id="recent-title" className="mb-3 text-base font-bold">
              Recently changed
            </h2>
            {recent.length ? (
              <ul className="grid gap-1.5">
                {recent.map((change) => (
                  <li key={change.href + change.updatedAt}>
                    <Link href={change.href} className="group flex items-center gap-2 text-sm">
                      <span className="min-w-0 flex-1 truncate group-hover:text-brand">{change.label}</span>
                      <LocalTime iso={change.updatedAt} />
                      <ArrowRight size={13} className="flex-none text-muted" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No changes yet.</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
