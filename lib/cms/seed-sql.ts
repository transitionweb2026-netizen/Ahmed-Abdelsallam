/**
 * The website's bundled content as one SQL script (supabase/seed/content.sql),
 * for importing it from the Supabase SQL editor without any API key. Same
 * semantics as the dashboard's import: rows that already exist are left
 * untouched (`on conflict … do nothing`), so it can be run again safely.
 */
import { importPlan } from "@/lib/cms/import-plan";
import type { CmsSnapshot } from "@/lib/cms/types";

const QUOTE = "$cms_seed$";

export function seedSql(snapshot: CmsSnapshot): string {
  const lines = [
    "-- Website content of Dr. Ahmed Abdelsalam, generated from the code by `npm run cms:seed-sql`.",
    "-- Run after the migrations (Supabase → SQL editor → paste → Run). Safe to run again:",
    "-- existing rows are never changed, so edits made in the dashboard are kept.",
    "",
    "begin;",
    "",
  ];
  for (const step of importPlan(snapshot)) {
    if (!step.rows.length) continue;
    const keys = Object.keys(step.rows[0]);
    for (const row of step.rows) {
      const other = Object.keys(row);
      if (other.length !== keys.length || other.some((key) => !keys.includes(key))) throw new Error(`seedSql: rows of ${step.table} have different columns.`);
    }
    const json = JSON.stringify(step.rows);
    if (json.includes(QUOTE)) throw new Error(`seedSql: content of ${step.table} contains the quote marker.`);
    const columns = keys.map((key) => `"${key}"`).join(", ");
    lines.push(
      `-- ${step.table} (${step.rows.length})`,
      `insert into public.${step.table} (${columns})`,
      `select ${columns} from jsonb_populate_recordset(null::public.${step.table}, ${QUOTE}${json}${QUOTE}::jsonb)`,
      `on conflict (${step.onConflict}) do nothing;`,
      "",
    );
  }
  lines.push("commit;", "");
  return lines.join("\n");
}
