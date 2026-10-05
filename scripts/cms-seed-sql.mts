/**
 * Writes supabase/seed/content.sql: the website's current content (from
 * data/ and config/) as SQL for the Supabase SQL editor.
 *
 *   npm run cms:seed-sql
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildBundledSnapshot } from "@/lib/cms/bundled";
import { seedSql } from "@/lib/cms/seed-sql";

const target = join(process.cwd(), "supabase", "seed", "content.sql");
const sql = seedSql(buildBundledSnapshot());
writeFileSync(target, sql);
console.log(`Wrote ${target} (${(sql.length / 1024).toFixed(0)} KB).`);
