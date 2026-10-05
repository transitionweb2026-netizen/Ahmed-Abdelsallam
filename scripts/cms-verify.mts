/**
 * Checks a connected Supabase project from the outside, with the same
 * public (publishable) key the website uses — no secret key needed:
 *  - the content is imported and readable;
 *  - visitors cannot read drafts, hidden sections, administrators or the
 *    contact-form inbox, and cannot write content or upload files.
 *
 *   npm run cms:verify          (reads NEXT_PUBLIC_SUPABASE_* from .env.local)
 *
 * Prints PASS / FAIL per check; never prints keys. Exit code 1 on failure.
 */
import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (in .env.local or the environment) first.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
let failures = 0;

function report(ok: boolean, label: string, detail = "") {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
}

const denied = (result: { error: unknown; data?: unknown; count?: number | null }) =>
  Boolean(result.error) || (Array.isArray(result.data) && result.data.length === 0);

console.log(`Checking ${new URL(url).host} as an anonymous visitor…\n`);

// 1. Content
const snapshot = await supabase.rpc("cms_snapshot");
const data = snapshot.data as Record<string, unknown[] | Record<string, unknown> | null> | null;
report(!snapshot.error, "cms_snapshot() is callable", snapshot.error?.message);
report(Boolean(data?.settings), "Website content is imported", data?.settings ? "" : "run supabase/seed/content.sql or Dashboard → Import content");
if (data) {
  const counts = ["sections", "services", "conditions", "videos", "faqs", "articles", "media", "uiStrings"].map((k) => `${k}: ${(data[k] as unknown[] | null)?.length ?? 0}`);
  console.log(`      ${counts.join(" · ")}`);
  const statuses = ["services", "conditions", "specialties", "qualifications", "timelineSteps", "stats", "videos", "reviews", "faqs", "articles"].flatMap((k) => ((data[k] as { status?: string }[] | null) ?? []).map((r) => r.status));
  report(statuses.every((s) => s === "published"), "The public snapshot contains published items only");
  report(((data.sections as { visible?: boolean }[] | null) ?? []).every((s) => s.visible), "The public snapshot contains visible sections only");
}

// 2. Reading private data
report(denied(await supabase.from("admins").select("user_id").limit(1)), "Visitors cannot list administrators");
report(denied(await supabase.from("contact_submissions").select("id").limit(1)), "Visitors cannot read contact-form messages");
report(denied(await supabase.from("services").select("id").eq("status", "draft").limit(1)), "Visitors cannot read draft services");
report(denied(await supabase.from("articles").select("id").eq("status", "draft").limit(1)), "Visitors cannot read draft articles");
report(denied(await supabase.from("page_sections").select("id").eq("visible", false).limit(1)), "Visitors cannot read hidden sections");

// 3. Writing
const insert = await supabase.from("services").insert({ slug: "cms-verify-probe", icon: "bone" }).select("id");
report(Boolean(insert.error), "Visitors cannot create content", insert.error ? "" : "an anonymous insert succeeded — check the RLS policies");
const update = await supabase.from("site_settings").update({ doctor_name_en: "cms-verify-probe" }).eq("id", 1).select("id");
report(denied(update), "Visitors cannot change settings");
const rpc = await supabase.rpc("admin_grant", { p_email: "probe@example.com", p_role: "owner" });
report(Boolean(rpc.error), "Visitors cannot grant administrator rights");
const upload = await supabase.storage.from("media").upload(`images/cms-verify-${Date.now()}.txt`, new Blob(["probe"], { type: "text/plain" }));
report(Boolean(upload.error), "Visitors cannot upload files to the media bucket");

console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
