import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionList } from "@/components/admin/CollectionList";
import { PageHeader } from "@/components/admin/PageHeader";
import { loadCollectionRows, loadMediaMap } from "@/lib/cms/admin/data";
import { hubOf, thumbField, toListItem } from "@/lib/cms/admin/list";
import { requireAdminPage } from "@/lib/cms/admin/session";
import { collectionDef } from "@/lib/cms/registry";

type Props = { params: Promise<{ collection: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: collectionDef((await params).collection)?.label ?? "Not found" };
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;
  const def = collectionDef(collection);
  if (!def) notFound();
  const { supabase } = await requireAdminPage();
  const rows = await loadCollectionRows(supabase, def);
  const thumb = thumbField(def);
  const media = thumb ? await loadMediaMap(supabase, rows.map((row) => row[thumb] as string | null)) : {};

  return (
    <>
      <PageHeader
        title={def.label}
        back={hubOf(def.key)}
        description={
          <>
            Shown on: {def.usedOn}. {def.hasStatus && "Drafts are never shown on the website."} {def.hasFeatured && "Featured items appear on the home page."} Use the arrows to change the order on the website.
          </>
        }
        actions={
          <Link href={`/admin/c/${def.key}/new`} className="adm-btn adm-btn-primary">
            <Plus size={16} aria-hidden /> New {def.singular.toLowerCase()}
          </Link>
        }
      />
      <CollectionList collectionKey={def.key} items={rows.map((row) => toListItem(def, row, media))} />
    </>
  );
}
