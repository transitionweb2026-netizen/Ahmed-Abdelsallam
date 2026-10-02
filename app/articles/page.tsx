import type { Metadata } from "next";
import { ArticlesBrowser } from "@/components/articles/ArticlesBrowser";
import { SiteCTA } from "@/components/cta/SiteCTA";
import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { DotGrid, Orb } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/config/routes";
import { getArticles, getArticlesPage, getSiteCta } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getArticlesPage();
  return pageMetadata({ ...seo, path: routes.articles });
}

export default async function ArticlesPage() {
  const [content, articles, cta] = await Promise.all([getArticlesPage(), getArticles(), getSiteCta()]);
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const others = articles.filter((article) => article !== featured).slice(0, 6);

  return (
    <>
      <Hero content={content.hero} scrollTarget="#articles" breadcrumb />

      <section id="articles" className="page-section" aria-labelledby="articles-title">
        <Orb className="top-0 end-[-12rem] h-[36rem] w-[36rem]" color="lavender" />
        <Orb className="top-1/2 start-[-14rem] h-[34rem] w-[34rem]" color="blue" />
        <DotGrid className="bottom-24 end-[5%] h-56 w-56 opacity-60" />
        <div className="site-container relative">
          <SectionHeading heading={content.heading} id="articles-title" />
          {featured ? (
            <ArticlesBrowser
              featured={featured}
              articles={others}
              copy={{
                featuredLabel: content.featuredLabel,
                moreTitle: content.moreTitle,
                readLabel: content.readLabel,
                dialog: content.dialog,
              }}
            />
          ) : null}
        </div>
      </section>

      <SiteCTA content={cta} />
      <JsonLd data={breadcrumbJsonLd(content.hero.eyebrow, routes.articles)} />
    </>
  );
}
