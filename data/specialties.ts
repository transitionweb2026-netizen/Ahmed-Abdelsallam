import { routes } from "@/config/routes";
import type { Specialty } from "@/types/content";

/**
 * Key specialties on the About page. Each card opens the matching service
 * dialog on /services (the #hash deep-links into it).
 *
 * PLACEHOLDER CONTENT — general orthopedic areas pending the doctor's
 * confirmed focus. Images are placeholder stock photos (Unsplash License),
 * credits in README.md; 4:3 at 1200×900.
 */
const image = (file: string, alt: string) => ({
  src: `/images/specialties/${file}.jpg`,
  alt,
  width: 1200,
  height: 900,
});

export const specialties: Specialty[] = [
  {
    slug: "knee-joints",
    title: "الركبة والمفاصل",
    description: "تقييم وعلاج آلام الركبة وخشونة المفاصل وإصابات الأربطة والغضاريف.",
    image: image("knee-joints", "رسم تشريحي لأربطة مفصل الركبة"),
    icon: "bone",
    href: `${routes.services}#knee-joint-pain`,
    order: 1,
  },
  {
    slug: "spine",
    title: "العمود الفقري",
    description: "تشخيص آلام الظهر والرقبة والانزلاق الغضروفي، مع البدء بالعلاج التحفظي كلما أمكن.",
    image: image("spine", "صورة أشعة جانبية للرأس وفقرات الرقبة"),
    icon: "spine",
    href: `${routes.services}#spine-back-pain`,
    order: 2,
  },
  {
    slug: "sports-rehab",
    title: "الإصابات الرياضية والتأهيل",
    description: "متابعة الإصابة من التشخيص حتى العودة الآمنة إلى الملعب ببرنامج تأهيل تدريجي.",
    image: image("sports-rehab", "أخصائي تأهيل يوجّه مريضة أثناء تمرين بشريط مقاومة"),
    icon: "activity",
    href: `${routes.services}#sports-injuries`,
    order: 3,
  },
  {
    slug: "fractures-trauma",
    title: "الكسور والإصابات",
    description: "التعامل مع الكسور ومتابعة الالتئام، ثم استعادة الحركة والقوة بعد الإصابة.",
    image: image("fractures-trauma", "صورة أشعة لكسر في عظمة الترقوة"),
    icon: "boneFracture",
    href: `${routes.services}#fractures`,
    order: 4,
  },
];
