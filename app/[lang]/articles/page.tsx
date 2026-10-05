import type { Metadata } from "next";
import { ArticlesBrowser } from "@/components/articles/ArticlesBrowser";
import { SiteCTA } from "@/components/cta/SiteCTA";
import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/seo/JsonLd";
import { DotGrid, Orb } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/config/routes";
import { getI18n, getLocale } from "@/i18n/server";
import { renderSections, scrollTargetAfterHero } from "@/lib/cms/render";
import { getArticles, getArticlesPage, getPageCta, getSectionOrder } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ locale: await getLocale(), page: "articles", path: routes.articles });
}

export default async function ArticlesPage() {
  const { locale, t } = await getI18n();
  const [content, order, articles, cta] = await Promise.all([
    getArticlesPage(locale),
    getSectionOrder(locale, "articles"),
    getArticles(locale),
    getPageCta(locale, "articles"),
  ]);
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const others = articles.filter((article) => article !== featured).slice(0, 6);

  return (
    <>
      {renderSections(order, {
        hero: () => <Hero content={content.hero} scrollTarget={scrollTargetAfterHero("articles", order)} breadcrumb />,
        articles: () => (
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
        ),
        cta: () => <SiteCTA id="site-cta" content={cta} />,
      })}
      <JsonLd data={breadcrumbJsonLd(locale, t.nav.home, content.hero.eyebrow, routes.articles)} />
    </>
  );
}
