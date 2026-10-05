/**
 * Writes docs/cms/CONTENT-INVENTORY.md — every page, section, collection,
 * setting and interface text the CMS manages — from the same definitions
 * the dashboard uses, so the document cannot drift from the code.
 *
 *   npm run cms:inventory
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildBundledSnapshot } from "@/lib/cms/bundled";
import { isLocalized, type Field } from "@/lib/cms/fields";
import { cmsPages } from "@/lib/cms/pages";
import { collections, navigationFields, pageSeoFields, sectionTypes, settingsGroups } from "@/lib/cms/registry";
import { uiStringGroups } from "@/lib/cms/ui-strings";

const snapshot = buildBundledSnapshot();
const out: string[] = [];
const line = (text = "") => out.push(text);
const esc = (text: string) => text.replace(/\|/g, "\|");

const TYPE_NAMES: Record<Field["type"], string> = {
  text: "text",
  title: "heading (accent parts)",
  stringList: "list of lines",
  icon: "icon",
  href: "link",
  cta: "button",
  action: "link or WhatsApp button",
  group: "group",
  list: "repeatable items",
  boolean: "yes / no",
  number: "number",
  select: "choice",
  date: "date",
  slug: "identifier",
  details: "detail dialog (intro + sections)",
  blocks: "article blocks",
  hours: "opening hours",
  media: "media",
  reference: "link to another item",
  pattern: "text (format checked)",
};

function describe(field: Field): string {
  const lang = isLocalized(field) || (field.type === "cta" || field.type === "action") ? " · AR+EN" : "";
  const extra = field.type === "media" ? ` (${field.kind})` : field.type === "select" ? ` (${field.options.map((o) => o.value).join(" / ")})` : "";
  return `${TYPE_NAMES[field.type]}${extra}${lang}${field.required ? " · required" : ""}`;
}

function fieldList(fields: Field[], depth = 0) {
  for (const field of fields) {
    line(`${"  ".repeat(depth)}- **${esc(field.label)}** — ${describe(field)}${field.when ? ` (only when ${field.when.key} = ${String(field.when.equals)})` : ""}`);
    if (field.type === "group" || field.type === "list") fieldList(field.fields, depth + 1);
  }
}

line("# Content inventory");
line();
line("Everything on the public website that the CMS manages, in Arabic and English. Generated from `lib/cms/pages.ts` and `lib/cms/registry.ts` by `npm run cms:inventory` — do not edit by hand.");
line();
line("Fixed in code (not editable, by design): the page layouts and section components, the URL structure (`/ar/…`, `/en/…`), the design system (colours, typography, glass effects, animations), structured-data shapes, and the security rules.");
line();
line("## Pages and sections");
line();
for (const page of cmsPages) {
  line(`### ${page.label}${page.path ? ` — \`${page.path}\`` : ""}`);
  line();
  line("| # | Section | Type | Anchor | Images | Video | Order / visibility |");
  line("| --- | --- | --- | --- | --- | --- | --- |");
  page.sections.forEach((section, i) => {
    const type = sectionTypes[section.type];
    const slots = (type.slots ?? []).map((s) => `${s.label}${s.englishOverride ? " (+ English variant)" : ""}`).join("; ") || "—";
    const rules = section.copyOnly ? "copy only (dialog / shared)" : section.pinned ? "always first, always visible" : section.required ? "movable, always visible" : "movable, can be hidden";
    line(`| ${i + 1} | ${esc(section.label)} | ${esc(type.label)} | ${section.anchor ? `\`#${section.anchor}\`` : "—"} | ${esc(slots)} | ${type.video ? "yes" : "—"} | ${rules} |`);
  });
  line();
  if (page.path) line(`SEO: ${pageSeoFields.map((f) => f.label).join(", ")} (per language).`);
  line();
}

line("## Section fields");
line();
for (const [key, type] of Object.entries(sectionTypes)) {
  line(`### ${type.label} (\`${key}\`)`);
  line();
  fieldList(type.fields);
  if (type.note) line(`- _${type.note.text}_`);
  line();
}

line("## Collections");
line();
line("| Collection | Table | Items now | Status | Featured | Shown on |");
line("| --- | --- | --- | --- | --- | --- |");
const tableRows: Record<string, Record<string, unknown>[]> = {
  services: snapshot.services as never,
  conditions: snapshot.conditions as never,
  specialties: snapshot.specialties as never,
  qualifications: snapshot.qualifications as never,
  timeline_steps: snapshot.timelineSteps as never,
  stats: snapshot.stats as never,
  videos: snapshot.videos as never,
  reviews: snapshot.reviews as never,
  faqs: snapshot.faqs as never,
  articles: snapshot.articles as never,
  article_categories: snapshot.articleCategories as never,
};
for (const def of collections) {
  const count = (tableRows[def.table] ?? []).filter((row) => !def.group || row[def.group.column] === def.group.value).length;
  line(`| ${esc(def.label)} | \`${def.table}\`${def.group ? ` (${def.group.value})` : ""} | ${count} | ${def.hasStatus ? "draft / published" : "—"} | ${def.hasFeatured ? "yes" : "—"} | ${esc(def.usedOn)} |`);
}
line();
const placeholders = snapshot.reviews.filter((r) => r.is_placeholder).length;
if (placeholders) line(`> ${placeholders} of the ${snapshot.reviews.length} reviews are **layout placeholders**, flagged \`is_placeholder\` in the database and in the dashboard. They are not genuine patient feedback and should be replaced or unpublished before launch.`);
line();
for (const def of collections) {
  line(`### ${def.label}`);
  line();
  fieldList(def.fields);
  line();
}

line("## Global settings");
line();
for (const group of settingsGroups) {
  line(`### ${group.title}`);
  line();
  fieldList(group.fields);
  line();
}

line("## Navigation and social links");
line();
line(`Menu items (${snapshot.navigation.length}): ${snapshot.navigation.map((n) => `\`${n.key}\``).join(", ")}. Per item:`);
line();
fieldList(navigationFields);
line();
line(`Social links (${snapshot.socials.length}): platform, https address, visible, order.`);
line();

line("## Interface text");
line();
const groups = new Map<string, number>();
for (const row of snapshot.uiStrings) {
  const group = uiStringGroups[row.key.split(".")[0]] ?? row.key.split(".")[0];
  groups.set(group, (groups.get(group) ?? 0) + 1);
}
line(`${snapshot.uiStrings.length} short texts (buttons, labels, accessible names, form messages), each in Arabic and English. An empty value falls back to the built-in wording.`);
line();
line("| Group | Texts |");
line("| --- | --- |");
for (const [group, count] of groups) line(`| ${esc(group)} | ${count} |`);
line();

line("## Media");
line();
const images = snapshot.media.filter((m) => m.kind === "image").length;
line(`${snapshot.media.length} files referenced by the content today (${images} images, ${snapshot.media.length - images} videos). They ship with the site under \`public/\` and are registered in the media library with their alt text in both languages; new uploads go to the Supabase Storage bucket \`media\`. Images and videos can be replaced in place (every use updates), and a file in use cannot be deleted.`);
line();

const target = join(process.cwd(), "docs", "cms", "CONTENT-INVENTORY.md");
writeFileSync(target, out.join("\n"));
console.log(`Wrote ${target}`);
