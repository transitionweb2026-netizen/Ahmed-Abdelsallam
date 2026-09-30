import { routes } from "@/config/routes";
import type { Service } from "@/types/content";

/**
 * PLACEHOLDER CONTENT — general orthopedic service areas pending the
 * doctor's confirmed list. The full list feeds the future /services page;
 * entries flagged `featured` appear on the homepage (in `order`).
 *
 * Images are placeholder stock photos (Unsplash License) — credits in
 * README.md. Replace `image` per service; 4:3 at 1200×900 or larger.
 */
const image = (file: string, alt: string) => ({
  src: `/images/services/${file}.jpg`,
  alt,
  width: 1200,
  height: 900,
});

export const services: Service[] = [
  {
    slug: "knee-joint-pain",
    title: "علاج آلام الركبة والمفاصل",
    description: "تقييم أسباب ألم الركبة والمفاصل وتحديد خطة علاج مناسبة لطبيعة الحالة ونمط الحياة.",
    image: image("knee-joint-pain", "أخصائي يفحص ركبة مريض مستلقٍ على سرير الفحص"),
    href: `${routes.services}#knee-joint-pain`,
    icon: "bone",
    featured: true,
    order: 1,
  },
  {
    slug: "spine-back-pain",
    title: "آلام الظهر والرقبة",
    description: "فحص مشكلات العمود الفقري والظهر والرقبة، والتمييز بين أسبابها لاختيار العلاج الأنسب.",
    image: image("spine-back-pain", "مجسم للعمود الفقري يوضح الفقرات القطنية والغضاريف"),
    href: `${routes.services}#spine-back-pain`,
    icon: "spine",
    featured: true,
    order: 2,
  },
  {
    slug: "sports-injuries",
    title: "إصابات الملاعب",
    description: "متابعة الإصابات الرياضية من التشخيص حتى العودة التدريجية الآمنة إلى النشاط.",
    image: image("sports-injuries", "رياضية ترتدي دعامة للركبة بجوار كرة سلة"),
    href: `${routes.services}#sports-injuries`,
    icon: "activity",
    featured: true,
    order: 3,
  },
  {
    slug: "fractures",
    title: "تشخيص وعلاج الكسور",
    description: "التعامل مع الكسور والإصابات العظمية ومتابعة مراحل الالتئام خطوة بخطوة.",
    image: image("fractures", "ساق مثبّتة بجبيرة داعمة أثناء المشي"),
    href: `${routes.services}#fractures`,
    icon: "boneFracture",
    featured: true,
    order: 4,
  },
  {
    slug: "shoulder-pain",
    title: "آلام الكتف",
    description: "تقييم محدودية حركة الكتف والألم المصاحب لها وتحديد الخيارات العلاجية.",
    image: image("shoulder-pain", "فحص يدوي لمفصل الكتف"),
    href: `${routes.services}#shoulder-pain`,
    icon: "shoulder",
    order: 5,
  },
  {
    slug: "osteoarthritis",
    title: "خشونة المفاصل",
    description: "خطة متكاملة للتعامل مع خشونة المفاصل وتخفيف أثرها على الحركة اليومية.",
    image: image("osteoarthritis", "يدان تتحسسان مفاصل الأصابع"),
    href: `${routes.services}#osteoarthritis`,
    icon: "personStanding",
    order: 6,
  },
  {
    slug: "hand-wrist",
    title: "اليد والرسغ",
    description: "تشخيص آلام اليد والرسغ والأصابع ومتابعة استعادة وظيفتها.",
    image: image("hand-wrist", "صورة أشعة سينية لعظام الرسغ واليد"),
    href: `${routes.services}#hand-wrist`,
    icon: "hand",
    order: 7,
  },
  {
    slug: "foot-ankle",
    title: "القدم والكاحل",
    description: "علاج آلام القدم والكاحل والالتواءات المتكررة وتحسين الثبات أثناء الحركة.",
    image: image("foot-ankle", "تثبيت دعامة للقدم والكاحل"),
    href: `${routes.services}#foot-ankle`,
    icon: "footprints",
    order: 8,
  },
];
