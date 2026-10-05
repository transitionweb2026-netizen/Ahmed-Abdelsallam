"use client";

import { Archive, Mail, MailOpen, MessageCircle, Phone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { deleteSubmission, setSubmissionStatus } from "@/app/admin/_actions/admin";
import { useConfirm, useToast } from "./Feedback";
import { LocalTime } from "./LocalTime";
import { EmptyState } from "./PageHeader";

export interface Submission {
  id: string;
  created_at: string;
  locale: "ar" | "en";
  name: string;
  phone: string;
  email: string | null;
  subject: string;
  message: string;
  page: string | null;
  status: "new" | "read" | "archived";
}

const digits = (phone: string) => phone.replace(/[^\d+]/g, "");

export function InboxList({ initial, storing }: { initial: Submission[]; storing: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"inbox" | "new" | "archived">("inbox");
  const [openId, setOpenId] = useState<string | null>(null);
  const visible = useMemo(() => items.filter((i) => (filter === "archived" ? i.status === "archived" : filter === "new" ? i.status === "new" : i.status !== "archived")), [items, filter]);

  const setStatus = async (item: Submission, status: Submission["status"], quiet = false) => {
    const result = await setSubmissionStatus(item.id, status);
    if (!result.ok) return toast("error", result.error);
    setItems((list) => list.map((i) => (i.id === item.id ? { ...i, status } : i)));
    if (!quiet) toast("success", status === "archived" ? "Archived." : status === "new" ? "Marked as unread." : "Marked as read.");
    router.refresh();
  };

  const remove = async (item: Submission) => {
    if (!(await confirm({ title: "Delete this message?", body: "It is permanently removed. This cannot be undone.", confirmLabel: "Delete", danger: true }))) return;
    const result = await deleteSubmission(item.id);
    if (!result.ok) return toast("error", result.error);
    setItems((list) => list.filter((i) => i.id !== item.id));
    toast("success", "Message deleted.");
    router.refresh();
  };

  return (
    <>
      {!storing && (
        <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
          Saving contact-form messages here is switched off in Global settings. New messages are only delivered to the form endpoint, if one is configured.
        </p>
      )}
      <div role="tablist" aria-label="Messages" className="mb-4 inline-flex rounded-xl bg-[#eceffa] p-1">
        {(
          [
            ["inbox", "Inbox"],
            ["new", `Unread (${items.filter((i) => i.status === "new").length})`],
            ["archived", "Archived"],
          ] as const
        ).map(([value, label]) => (
          <button key={value} type="button" role="tab" aria-selected={filter === value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${filter === value ? "bg-white text-brand-dark shadow-sm" : "text-[#4a5384]"}`}>
            {label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <EmptyState title="No messages here" />
      ) : (
        <ul className="grid gap-2">
          {visible.map((item) => {
            const open = openId === item.id;
            return (
              <li key={item.id} className={`adm-card overflow-hidden ${item.status === "new" ? "ring-2 ring-brand/25" : ""}`}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => {
                    setOpenId(open ? null : item.id);
                    if (!open && item.status === "new") void setStatus(item, "read", true);
                  }}
                  className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 p-4 text-start"
                >
                  {item.status === "new" ? <Mail size={16} className="text-brand" aria-label="Unread" /> : <MailOpen size={16} className="text-muted" aria-hidden />}
                  <span className={`min-w-0 truncate ${item.status === "new" ? "font-bold" : "font-medium"}`}>{item.name}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-muted">{item.subject}</span>
                  <span className="adm-badge adm-badge-gray uppercase">{item.locale}</span>
                  <LocalTime iso={item.created_at} withYear />
                </button>
                {open && (
                  <div className="grid gap-3 border-t border-line p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed" dir="auto">
                      {item.message}
                    </p>
                    <dl className="grid gap-1 text-sm sm:grid-cols-[8rem_1fr]">
                      <dt className="text-muted">Phone</dt>
                      <dd dir="ltr" className="text-start">
                        {item.phone}
                      </dd>
                      {item.email && (
                        <>
                          <dt className="text-muted">Email</dt>
                          <dd>{item.email}</dd>
                        </>
                      )}
                      {item.page && (
                        <>
                          <dt className="text-muted">Sent from</dt>
                          <dd className="font-mono text-xs">{item.page}</dd>
                        </>
                      )}
                    </dl>
                    <div className="flex flex-wrap gap-2">
                      <a href={`tel:${digits(item.phone)}`} className="adm-btn adm-btn-secondary adm-btn-sm">
                        <Phone size={14} aria-hidden /> Call
                      </a>
                      <a href={`https://wa.me/${digits(item.phone).replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-secondary adm-btn-sm">
                        <MessageCircle size={14} aria-hidden /> WhatsApp
                      </a>
                      {item.email && (
                        <a href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`} className="adm-btn adm-btn-secondary adm-btn-sm">
                          <Mail size={14} aria-hidden /> Email
                        </a>
                      )}
                      <span className="ms-auto flex gap-2">
                        {item.status !== "new" && (
                          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setStatus(item, "new")}>
                            Mark unread
                          </button>
                        )}
                        {item.status !== "archived" ? (
                          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setStatus(item, "archived")}>
                            <Archive size={14} aria-hidden /> Archive
                          </button>
                        ) : (
                          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setStatus(item, "read")}>
                            Move to inbox
                          </button>
                        )}
                        <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => remove(item)}>
                          <Trash2 size={14} aria-hidden /> Delete
                        </button>
                      </span>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
