import { routes } from "@/config/routes";
import { heroImage } from "@/data/pages/hero-image";
import type { VideosPageContent } from "@/types/content";

/**
 * /videos copy. The videos come from the shared dataset in data/videos.ts
 * (the same nine the homepage draws its featured three from).
 *
 * PLACEHOLDER CONTENT — draft wording.
 */
export const videosPage: VideosPageContent = {
  seo: {
    title: "الفيديوهات التوعوية",
    description:
      "فيديوهات قصيرة ومبسّطة عن آلام العظام والمفاصل والعمود الفقري والإصابات الرياضية، ونصائح عملية للعناية اليومية والوقاية.",
  },

  hero: {
    eyebrow: "الفيديوهات",
    title: [
      { text: "معلومة طبية", breakAfter: true },
      { text: "في دقيقة واحدة", accent: true },
    ],
    description:
      "فيديوهات قصيرة ومبسّطة تجيب عن أكثر الأسئلة شيوعًا حول آلام العظام والمفاصل، والعناية بها، والوقاية من الإصابات.",
    primaryCta: { label: "شاهد الفيديوهات", href: "#videos-gallery" },
    secondaryCta: { label: "احجز استشارتك", href: routes.contact },
    image: heroImage("videos", "كاميرا على حامل ثلاثي داخل استوديو تصوير", {
      desktop: "30% center",
      mobile: "center top",
    }),
    floatingCards: [
      { icon: "play", title: "محتوى قصير", text: "معلومة مركّزة في دقائق" },
      { icon: "lightbulb", title: "نصائح عملية", text: "تطبّقها في يومك" },
    ],
    scrollCueLabel: "شاهد الآن",
  },

  gallery: {
    heading: {
      eyebrow: "مكتبة الفيديو",
      title: [{ text: "استكشف" }, { text: "أحدث الفيديوهات", accent: true }],
      description: "اختر أي فيديو لمشاهدته في وضع العرض الكامل، وتنقّل بين الفيديوهات بسهولة.",
    },
  },
};
