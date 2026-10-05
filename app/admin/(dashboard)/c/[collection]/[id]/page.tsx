import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/admin/Feedback";
import { PageHeader } from "@/components/admin/PageHeader";
import { RecordForm } from "@/components/admin/RecordForm";
import { loadMediaMap, loadRecord, loadReferenceOptions, mediaIdsOf } from "@/lib/cms/admin/data";
import { itemTitle } from "@/lib/cms/admin/explorer";
import { requireAdminPage } from "@/lib/cms/admin/session";
import { emptyDoc, rowToDoc } from "@/lib/cms/fields";
import { collectionDef } from "@/lib/cms/registry";

type Props = { params: Promise<{ collection: string; id: string }> };

export const metadata: Metadata = { title: "Edit item" };

/** Edit an item (`/admin/c/services/<id>`) or create one (`/admin/c/services/new`). */
export default async function RecordPage({ params }: Props) {
  const { collection, id } = await params;
  const def = collectionDef(collection);
  if (!def) notFound();
  const { supabase } = await requireAdminPage();
  const isNew = id === "new";
  const row = isNew ? null : await loadRecord(supabase, def, id);
  if (!isNew && !row) notFound();

  const doc = row ? rowToDoc(def.fields, row) : emptyDoc(def.fields);
  const [media, references] = await Promise.all([loadMediaMap(supabase, mediaIdsOf(def.fields, doc)), loadReferenceOptions(supabase, def.fields)]);
  // New items start as drafts: nothing reaches the website until it is published.
  const status = row ? (row.status === "draft" ? "draft" : "published") : "draft";

  return (
    <>
      <PageHeader
        title={row ? itemTitle(def, row) : `New ${def.singular.toLowerCase()}`}
        back={{ href: `/admin/c/${def.key}`, label: def.label }}
        badges={row && def.hasStatus ? <StatusBadge status={status} /> : null}
        description={`Shown on: ${def.usedOn}.`}
      />
      <RecordForm collectionKey={def.key} id={row ? String(row.id) : null} initialDoc={doc} initialStatus={status} media={media} references={references} listHref={`/admin/c/${def.key}`} />
    </>
  );
}
