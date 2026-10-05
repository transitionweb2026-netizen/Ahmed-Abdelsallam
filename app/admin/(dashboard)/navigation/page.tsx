import type { Metadata } from "next";
import { NavigationEditor, SocialsEditor } from "@/components/admin/NavigationEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import { loadNavigation } from "@/lib/cms/admin/data";
import { requireAdminPage } from "@/lib/cms/admin/session";

export const metadata: Metadata = { title: "Navigation & social" };

export default async function NavigationPage() {
  const { supabase } = await requireAdminPage();
  const { navigation, socials } = await loadNavigation(supabase);
  return (
    <>
      <PageHeader title="Navigation & social" description="The site menu (header, mobile menu, footer) and the social media links. Footer texts and interface labels are under Interface text." />
      <div className="grid gap-8">
        <NavigationEditor
          initial={navigation.map((n) => ({ id: n.id, key: n.key, label: { ar: n.label_ar, en: n.label_en }, href: n.href, visible: n.visible, show_in_header: n.show_in_header, show_in_footer: n.show_in_footer }))}
        />
        <SocialsEditor initial={socials.map((s) => ({ platform: s.platform, url: s.url, visible: s.visible }))} />
      </div>
    </>
  );
}
