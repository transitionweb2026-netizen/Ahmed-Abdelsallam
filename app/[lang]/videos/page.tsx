import type { Metadata } from "next";
import { SiteCTA } from "@/components/cta/SiteCTA";
import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { GlassRing, Orb } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideosGallery } from "@/components/videos/VideosGallery";
import { routes } from "@/config/routes";
import { getLocale } from "@/i18n/server";
import { getSiteCta, getVideos, getVideosPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { seo } = await getVideosPage(locale);
  return pageMetadata({ ...seo, locale, path: routes.videos });
}

export default async function VideosPage() {
  // The same shared dataset the homepage draws its featured videos from.
  const locale = await getLocale();
  const [content, videos, cta] = await Promise.all([getVideosPage(locale), getVideos(locale), getSiteCta(locale)]);

  return (
    <>
      <Hero content={content.hero} scrollTarget="#videos-gallery" breadcrumb />

      <section id="videos-gallery" className="page-section" aria-labelledby="videos-gallery-title">
        <Orb className="top-1/4 start-[-14rem] h-[36rem] w-[36rem]" color="blue" />
        <Orb className="bottom-10 end-[-12rem] h-[30rem] w-[30rem]" color="lavender" />
        <GlassRing className="top-[30%] end-[4%] hidden h-28 w-28 xl:block" />
        <div className="site-container relative">
          <SectionHeading heading={content.gallery.heading} id="videos-gallery-title" />
          <VideosGallery videos={videos} />
        </div>
      </section>

      <SiteCTA content={cta} />
      <JsonLd data={breadcrumbJsonLd(locale, content.hero.eyebrow, routes.videos)} />
    </>
  );
}
