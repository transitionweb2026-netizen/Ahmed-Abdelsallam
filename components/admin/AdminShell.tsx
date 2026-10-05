"use client";

import {
  Award,
  BarChart3,
  BookOpen,
  ExternalLink,
  FileText,
  FolderTree,
  Globe2,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  KeyRound,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  MessageSquareQuote,
  Navigation,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tags,
  Type,
  Video,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { signOut } from "@/app/admin/_actions/auth";
import { FeedbackProvider } from "./Feedback";

type NavItem = { href: string; label: string; icon: LucideIcon; badge?: number; ownerOnly?: boolean };

function groups(unread: number): { label: string; items: NavItem[] }[] {
  return [
    { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
    {
      label: "Website",
      items: [
        { href: "/admin/pages", label: "Pages & sections", icon: FileText },
        { href: "/admin/content", label: "Content explorer", icon: Search },
        { href: "/admin/media", label: "Media library", icon: ImageIcon },
      ],
    },
    {
      label: "Collections",
      items: [
        { href: "/admin/c/services", label: "Services", icon: Stethoscope },
        { href: "/admin/c/conditions", label: "Conditions", icon: Sparkles },
        { href: "/admin/c/specialties", label: "Specialties", icon: FolderTree },
        { href: "/admin/c/qualifications", label: "Qualifications", icon: Award },
        { href: "/admin/timelines", label: "Timelines", icon: ListOrdered },
        { href: "/admin/statistics", label: "Statistics", icon: BarChart3 },
        { href: "/admin/c/videos", label: "Videos", icon: Video },
        { href: "/admin/c/reviews", label: "Reviews", icon: MessageSquareQuote },
        { href: "/admin/c/faqs", label: "FAQs", icon: HelpCircle },
        { href: "/admin/c/articles", label: "Articles", icon: BookOpen },
        { href: "/admin/c/categories", label: "Article categories", icon: Tags },
      ],
    },
    {
      label: "Settings",
      items: [
        { href: "/admin/settings", label: "Global settings", icon: Settings },
        { href: "/admin/navigation", label: "Navigation & social", icon: Navigation },
        { href: "/admin/seo", label: "SEO", icon: Globe2 },
        { href: "/admin/strings", label: "Interface text", icon: Type },
      ],
    },
    {
      label: "Administration",
      items: [
        { href: "/admin/inbox", label: "Inbox", icon: Inbox, badge: unread },
        { href: "/admin/users", label: "Admin users", icon: ShieldCheck, ownerOnly: true },
        { href: "/admin/account", label: "My account", icon: KeyRound },
      ],
    },
  ];
}

/** Collection pages that belong to a grouped sidebar entry. */
const ALIASES: Record<string, string> = {
  "/admin/c/journey": "/admin/timelines",
  "/admin/c/diagnosis": "/admin/timelines",
  "/admin/c/career": "/admin/timelines",
  "/admin/c/home-stats": "/admin/statistics",
  "/admin/c/about-stats": "/admin/statistics",
};

function isActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  const alias = Object.entries(ALIASES).find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))?.[1];
  const path = alias ?? pathname;
  return path === href || path.startsWith(`${href}/`);
}

function Sidebar({ pathname, onNavigate, unread, isOwner }: { pathname: string; onNavigate?: () => void; unread: number; isOwner: boolean }) {
  return (
    <nav aria-label="CMS" className="flex flex-col gap-5 px-3 pb-6">
      {groups(unread).map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#5c6491]">{group.label}</p>
          <ul className="grid gap-0.5">
            {group.items
              .filter((item) => !item.ownerOnly || isOwner)
              .map((item) => {
                const active = isActive(item.href, pathname);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.86rem] font-medium transition-colors ${
                        active ? "bg-brand-soft text-brand-dark" : "text-[#3a4472] hover:bg-[#eef0fa] hover:text-ink"
                      }`}
                    >
                      <Icon size={16} className={active ? "text-brand" : "text-[#8890b5]"} aria-hidden />
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span className="adm-badge adm-badge-blue" aria-label={`${item.badge} unread`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ email, role, unread, children }: { email: string; role: "owner" | "editor"; unread: number; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5 px-6 py-5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand to-brand-dark text-sm font-bold text-white" aria-hidden>
        A
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold text-ink">Dr. Ahmed Abdelsalam</span>
        <span className="block text-xs text-muted">Website content</span>
      </span>
    </Link>
  );

  return (
    <FeedbackProvider>
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow">
        Skip to content
      </a>
      <div className="lg:grid lg:grid-cols-[16.5rem_1fr]">
        <aside className="sticky top-0 hidden h-dvh overflow-y-auto border-e border-line bg-white lg:block">
          {brand}
          <Sidebar pathname={pathname} unread={unread} isOwner={role === "owner"} />
        </aside>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 animate-[adm-fade_0.2s] bg-black/30" />
            <aside className="absolute inset-y-0 start-0 w-72 max-w-[85vw] animate-[adm-slide-in_0.2s] overflow-y-auto bg-white shadow-xl">
              {brand}
              <Sidebar pathname={pathname} onNavigate={() => setOpen(false)} unread={unread} isOwner={role === "owner"} />
            </aside>
          </div>
        )}

        <div className="min-w-0">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="adm-btn adm-btn-ghost adm-btn-icon lg:hidden">
              <Menu size={18} aria-hidden />
            </button>
            <span className="min-w-0 truncate text-sm text-muted">
              {email} <span className="adm-badge adm-badge-gray ms-1 capitalize">{role}</span>
            </span>
            <div className="ms-auto flex items-center gap-2">
              <a href="/ar" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-secondary">
                <ExternalLink size={15} aria-hidden />
                <span className="hidden sm:inline">View site</span>
              </a>
              <form action={signOut}>
                <button type="submit" className="adm-btn adm-btn-ghost" aria-label="Sign out">
                  <LogOut size={16} aria-hidden />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </header>
          <main id="admin-main" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </FeedbackProvider>
  );
}
