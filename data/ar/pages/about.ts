import { routes } from "@/config/routes";
import { siteIdentity } from "@/config/site";
import { heroImage } from "@/data/shared/hero-image";
import type { AboutPageCopy } from "@/types/content";

const { name, role } = siteIdentity.ar;

/**
 * /about copy — Arabic. The intro video and career steps are joined in by
 * lib/content.ts.
 *
 * PLACEHOLDER CONTENT — draft wording that avoids factual claims. The
 * philosophy quote is written in the doctor's voice and MUST be approved
 * (or rewritten) by him before launch. Portraits are placeholder art.
 */
export const aboutPage: AboutPageCopy = {
  seo: {
    title: "عن د. أحمد عبد السلام",
    description:
      "تعرّف على د. أحمد عبد السلام، طبيب العظام: أسلوبه في الرعاية، ومجالات تركيزه، وفلسفته في العلاج، ومحطات مسيرته المهنية.",
  },

  hero: {
    eyebrow: "عن الطبيب",
    title: [
      { text: "تعرّف على", breakAfter: true },
      { text: name, accent: true },
    ],
    description:
      "طبيب العظام، يؤمن بأن الرعاية الجيدة تبدأ بالاستماع والفهم، وتنتهي بخطة علاج واضحة يشاركك فيها خطوة بخطوة.",
    primaryCta: { label: "احجز استشارتك", href: routes.contact },
    secondaryCta: { label: "شاهد الفيديو التعريفي", href: "#about-video" },
    image: heroImage("about", "طبيب يدوّن ملاحظات على ملف أثناء استشارة مع مريض", {
      desktop: "40% center",
      mobile: "center top",
    }),
    floatingCards: [
      { icon: "heartHandshake", title: "رعاية إنسانية", text: "المريض محور كل قرار" },
      { icon: "searchCheck", title: "تشخيص متأنٍ", text: "فهم الحالة قبل العلاج" },
    ],
    scrollCueLabel: "تعرّف أكثر",
  },

  video: {
    heading: {
      eyebrow: "فيديو تعريفي",
      title: [{ text: "رسالة" }, { text: "من الطبيب", accent: true }],
      description: "في دقائق قليلة يحدثك د. أحمد عبد السلام عن أسلوبه في الرعاية، وما يمكنك توقعه من أول زيارة حتى المتابعة.",
    },
  },

  introduction: {
    eyebrow: "تعريف بالطبيب",
    title: [{ text: "د. أحمد" }, { text: "عبد السلام", accent: true }],
    paragraphs: [
      "د. أحمد عبد السلام طبيب عظام يهتم بتشخيص وعلاج مشكلات العظام والمفاصل والعمود الفقري والإصابات الرياضية، مع حرص خاص على شرح الحالة للمريض بوضوح قبل أي قرار علاجي.",
      "يؤمن بأن لكل مريض قصة مختلفة؛ لذلك يبدأ دائمًا بالاستماع الجيد والفحص الدقيق، ثم يضع مع المريض خطة علاج واقعية تناسب حالته وأهدافه ونمط حياته.",
    ],
    bullets: [
      "شرح واضح للتشخيص والخيارات المتاحة",
      "خطة علاج بخطوات محددة",
      "متابعة منتظمة حتى التعافي",
      "تواصل سهل للإجابة عن الاستفسارات",
    ],
    image: {
      src: "/images/doctor/doctor-portrait-01.jpg",
      alt: "صورة د. أحمد عبد السلام (صورة مؤقتة)",
      width: 1200,
      height: 1500,
    },
    caption: { icon: "stethoscope", title: name, subtitle: role },
    cta: { label: "احجز استشارتك", href: routes.contact },
  },

  qualifications: {
    heading: {
      eyebrow: "المؤهلات",
      title: [{ text: "المؤهلات" }, { text: "والشهادات", accent: true }],
      description: "المؤهلات العلمية والشهادات المهنية التي تدعم رحلة الطبيب في الرعاية.",
    },
    // Remove once data/qualifications.ts holds the verified details.
    note: "بيانات توضيحية مؤقتة — ستُستبدل بالمؤهلات والشهادات الموثّقة للطبيب.",
  },

  specialties: {
    heading: {
      eyebrow: "مجالات التركيز",
      title: [{ text: "التخصصات" }, { text: "الرئيسية", accent: true }],
      description: "المجالات التي يركّز عليها الطبيب في التشخيص والعلاج والمتابعة.",
    },
    cta: { label: "عرض جميع الخدمات", href: routes.services },
  },

  stats: {
    heading: {
      eyebrow: "بالأرقام",
      title: [{ text: "رعاية ومعرفة" }, { text: "في متناولك", accent: true }],
      description: "لمحة سريعة عن مجالات الرعاية والمحتوى التوعوي المتاح لك على الموقع.",
    },
    // Values are counted from the collections, so they stay true as content grows.
    items: [
      { id: "services", label: "مجالات علاجية متخصصة", icon: "stethoscope", countOf: "services" },
      { id: "conditions", label: "حالات شائعة مشروحة بالتفصيل", icon: "clipboardCheck", countOf: "conditions" },
      { id: "videos", label: "فيديوهات توعوية قصيرة", icon: "play", countOf: "videos" },
      { id: "articles", label: "مقالات طبية مبسّطة", icon: "bookOpen", countOf: "articles" },
    ],
  },

  philosophy: {
    eyebrow: "فلسفة الطبيب",
    title: [{ text: "العلاج يبدأ" }, { text: "بالفهم", accent: true }],
    quote:
      "أفضل خطة علاج هي التي يفهمها المريض ويقتنع بها؛ لذلك أحرص على أن يغادر كل مريض العيادة وهو يعرف حالته جيدًا، ويعرف خطوته التالية بوضوح.",
    attribution: { name, role },
    values: [
      { icon: "searchCheck", label: "الاستماع أولًا" },
      { icon: "clipboardCheck", label: "وضوح في كل خطوة" },
      { icon: "heartHandshake", label: "شراكة في القرار" },
    ],
    image: {
      src: "/images/doctor/doctor-portrait-02.jpg",
      alt: "د. أحمد عبد السلام في العيادة (صورة مؤقتة)",
      width: 1200,
      height: 1500,
    },
  },

  career: {
    heading: {
      eyebrow: "المسيرة المهنية",
      title: [{ text: "محطات" }, { text: "المسيرة", accent: true }],
      description: "أبرز محطات المسيرة العلمية والمهنية للطبيب.",
    },
  },
};
