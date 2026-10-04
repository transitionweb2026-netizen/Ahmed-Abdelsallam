import { routes } from "@/config/routes";
import { siteIdentity } from "@/config/site";
import type { HomeCopy } from "@/types/content";

const { name, role } = siteIdentity.ar;

/**
 * Homepage copy — Arabic. The intro video and the CTA band are joined in by
 * lib/content.ts.
 *
 * PLACEHOLDER CONTENT — all wording below is draft copy written to avoid
 * factual claims (no years of experience, credentials, hospitals, patient
 * counts or success rates). Replace with approved copy from the doctor.
 */
export const homeCopy: HomeCopy = {
  hero: {
    eyebrow: `${name} · ${role}`,
    title: [
      { text: "صحة عظامك ومفاصلك", breakAfter: true },
      { text: "تبدأ بتشخيص دقيق", accent: true },
    ],
    description:
      "رعاية متخصصة لمشكلات العظام والمفاصل والعمود الفقري، تبدأ بالاستماع الجيد والفحص الدقيق، وتنتهي بخطة علاج واضحة تناسب حالتك ونمط حياتك.",
    primaryCta: { label: "استكشف الخدمات", href: routes.services },
    secondaryCta: { label: "احجز استشارتك", href: routes.contact },
    // PLACEHOLDER stock photo (Unsplash License, credit in README.md).
    // Replace with the doctor's own cover photo; keep the subject on the
    // left of the frame so the right-hand (RTL) text side stays calm.
    image: {
      desktop: {
        src: "/images/hero/hero-cover.jpg",
        alt: "طبيب يثبّت جبيرة داعمة على معصم مريض",
        width: 3200,
        height: 1800,
        objectPosition: "30% center",
      },
      mobile: {
        src: "/images/hero/hero-cover-mobile.jpg",
        alt: "طبيب يثبّت جبيرة داعمة على معصم مريض",
        width: 1200,
        height: 1667,
        objectPosition: "center top",
      },
    },
    floatingCards: [
      { icon: "scan", title: "تشخيص دقيق", text: "فحص سريري متأنٍ" },
      { icon: "clipboardCheck", title: "خطة واضحة", text: "تناسب حالتك ونمط حياتك" },
    ],
    scrollCueLabel: "اكتشف المزيد",
  },

  intro: {
    heading: {
      eyebrow: "تعرّف على الطبيب",
      title: [{ text: "تعرّف على" }, { text: "د. أحمد عبد السلام", accent: true }],
      description:
        "في هذا الفيديو التعريفي يحدثك د. أحمد عبد السلام عن أسلوبه في التعامل مع مرضى العظام والمفاصل، وكيف تسير رحلتك معنا من أول استشارة حتى المتابعة.",
    },
    highlights: [
      { icon: "stethoscope", label: "فحص سريري متأنٍ" },
      { icon: "clipboardCheck", label: "خطة علاج واضحة" },
      { icon: "repeat", label: "متابعة مستمرة" },
    ],
    link: { label: "شاهد المزيد من الفيديوهات", href: routes.videos },
  },

  stats: {
    heading: {
      eyebrow: "بالأرقام",
      title: [{ text: "رعاية منظمة" }, { text: "في كل خطوة", accent: true }],
      description: "أرقام تلخّص طريقة العمل: خطوات واضحة، وتوعية مستمرة، وخطة علاج لكل مريض.",
    },
    // PLACEHOLDER statistics: intentionally avoid invented credentials
    // (years of experience, patient counts, success rates). Swap in verified
    // figures when provided — the counter animates any value.
    stats: [
      { id: "tailored-plans", value: 100, suffix: "%", label: "خطة علاج مخصّصة لكل مريض", icon: "clipboardCheck" },
      { id: "services", value: 8, label: "مجالات علاجية متخصصة", icon: "stethoscope" },
      { id: "videos", value: 9, label: "فيديوهات توعوية", icon: "play" },
      { id: "journey-steps", value: 5, label: "خطوات واضحة من الحجز إلى المتابعة", icon: "route" },
    ],
    doctorImage: {
      src: "/images/doctor/doctor-portrait-01.jpg",
      alt: "صورة د. أحمد عبد السلام (صورة مؤقتة)",
      width: 1200,
      height: 1500,
    },
    doctorName: name,
    doctorRole: role,
  },

  services: {
    heading: {
      eyebrow: "الخدمات",
      title: [{ text: "أهم" }, { text: "الخدمات", accent: true }],
      description: "مجالات رعاية متكاملة لمشكلات العظام والمفاصل، من التشخيص وحتى المتابعة.",
    },
    cta: { label: "عرض جميع الخدمات", href: routes.services },
  },

  about: {
    heading: {
      eyebrow: "عن الطبيب",
      title: [{ text: "د. أحمد" }, { text: "عبد السلام", accent: true }],
      description:
        "طبيب العظام، يؤمن بأن العلاج الجيد يبدأ بفهم المريض قبل قراءة الأشعة، ويحرص على أن يغادر كل مريض وهو يعرف حالته وخطته العلاجية بوضوح.",
    },
    points: [
      {
        icon: "searchCheck",
        title: "تشخيص يبدأ بالاستماع",
        text: "وقت كافٍ لفهم الشكوى والتاريخ المرضي قبل أي قرار علاجي.",
      },
      {
        icon: "heartHandshake",
        title: "المريض محور الرعاية",
        text: "شرح واضح للحالة والخيارات المتاحة ومشاركتك في القرار.",
      },
      {
        icon: "clipboard",
        title: "خطة علاج مخصّصة",
        text: "خطة تناسب حالتك ونشاطك اليومي وأهدافك من العلاج.",
      },
      {
        icon: "repeat",
        title: "متابعة حتى التعافي",
        text: "متابعة منتظمة لتقييم التقدم وتعديل الخطة عند الحاجة.",
      },
    ],
    image: {
      src: "/images/doctor/doctor-portrait-02.jpg",
      alt: "صورة د. أحمد عبد السلام في العيادة (صورة مؤقتة)",
      width: 1200,
      height: 1500,
    },
    badge: { icon: "heartHandshake", label: "رعاية تتمحور حول المريض" },
    cta: { label: "تعرّف على الطبيب", href: routes.about },
  },

  conditions: {
    heading: {
      eyebrow: "الحالات والأعراض",
      title: [{ text: "حالات وأعراض" }, { text: "تستدعي الفحص", accent: true }],
      description: "بعض العلامات التي لا يُنصح بتجاهلها، والتي يساعد الفحص المبكر في فهم أسبابها.",
    },
    cta: { label: "عرض جميع الحالات", href: routes.conditions },
  },

  journey: {
    heading: {
      eyebrow: "رحلة المريض",
      title: [{ text: "رحلة" }, { text: "المريض", accent: true }],
      description: "خطوات واضحة ومنظمة من لحظة الحجز وحتى المتابعة، حتى تعرف دائمًا ما الخطوة التالية.",
    },
    steps: [
      {
        id: "book",
        title: "احجز موعدك",
        description: "اختر الوقت المناسب لك عبر الهاتف أو واتساب.",
        icon: "calendar",
      },
      {
        id: "consult",
        title: "الاستشارة والتقييم",
        description: "نستمع لشكواك ونراجع تاريخك المرضي ونجري الفحص السريري.",
        icon: "stethoscope",
      },
      {
        id: "diagnose",
        title: "التشخيص",
        description: "تحديد سبب المشكلة، مع طلب الفحوصات أو الأشعة عند الحاجة.",
        icon: "scan",
      },
      {
        id: "plan",
        title: "خطة العلاج",
        description: "خطة واضحة تناسب حالتك، نشرح لك خطواتها وأهدافها.",
        icon: "clipboardCheck",
      },
      {
        id: "follow-up",
        title: "المتابعة",
        description: "متابعة تطور حالتك وتعديل الخطة خطوة بخطوة.",
        icon: "repeat",
      },
    ],
  },

  videos: {
    heading: {
      eyebrow: "محتوى توعوي",
      title: [{ text: "فيديوهات" }, { text: "مهمة", accent: true }],
      description: "مقاطع قصيرة تساعدك على فهم حالتك والعناية بعظامك ومفاصلك في حياتك اليومية.",
    },
    cta: { label: "عرض جميع الفيديوهات", href: routes.videos },
  },

  reviewsFaq: {
    reviews: {
      heading: {
        eyebrow: "آراء المرضى",
        title: [{ text: "تجارب" }, { text: "المرضى", accent: true }],
        description: "انطباعات المرضى عن تجربة الاستشارة والمتابعة.",
      },
      cta: { label: "عرض جميع الآراء", href: routes.reviews },
    },
    faq: {
      heading: {
        eyebrow: "الأسئلة الشائعة",
        title: [{ text: "إجابات" }, { text: "أسئلتك", accent: true }],
        description: "إجابات مختصرة عن أكثر الأسئلة تكرارًا قبل الزيارة وبعدها.",
      },
      cta: { label: "عرض جميع الأسئلة", href: routes.faq },
    },
    cta: { label: "عرض جميع الآراء والأسئلة", href: routes.reviews },
  },
};
