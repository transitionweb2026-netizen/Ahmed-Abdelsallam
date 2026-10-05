import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { collectionDef } from "@/lib/cms/registry";
import { PageHeader } from "./PageHeader";

/** Overview of collections that share one table (timelines, statistics). */
export async function CollectionHub({ supabase, title, description, keys }: { supabase: SupabaseClient; title: string; description: string; keys: string[] }) {
  const defs = keys.map((key) => collectionDef(key)!);
  const counts = await Promise.all(
    defs.map(async (def) => {
      let query = supabase.from(def.table).select("status");
      if (def.group) query = query.eq(def.group.column, def.group.value);
      const { data } = await query;
      const rows = (data ?? []) as { status: string }[];
      return { total: rows.length, drafts: rows.filter((r) => r.status === "draft").length };
    }),
  );
  return (
    <>
      <PageHeader title={title} description={description} />
      <ul className="grid gap-3">
        {defs.map((def, i) => (
          <li key={def.key}>
            <Link href={`/admin/c/${def.key}`} className="adm-card flex items-center gap-4 p-5 transition hover:ring-2 hover:ring-brand/30">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{def.label}</p>
                <p className="text-sm text-muted">{def.usedOn}</p>
              </div>
              <span className="text-sm text-muted">
                {counts[i].total} item{counts[i].total === 1 ? "" : "s"}
                {counts[i].drafts > 0 && ` · ${counts[i].drafts} draft${counts[i].drafts === 1 ? "" : "s"}`}
              </span>
              <ChevronRight size={18} className="text-muted" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
