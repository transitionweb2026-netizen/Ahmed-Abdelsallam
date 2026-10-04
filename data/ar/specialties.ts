import type { SpecialtySlug } from "@/data/shared/specialties";
import type { SpecialtyText } from "@/types/content";

/**
 * Key specialties on the About page — Arabic text, keyed by slug.
 *
 * PLACEHOLDER CONTENT — general orthopedic areas pending the doctor's
 * confirmed focus.
 */
export const specialtiesText: Record<SpecialtySlug, SpecialtyText> = {
  "knee-joints": {
    title: "الركبة والمفاصل",
    description: "تقييم وعلاج آلام الركبة وخشونة المفاصل وإصابات الأربطة والغضاريف.",
    imageAlt: "رسم تشريحي لأربطة مفصل الركبة",
  },
  spine: {
    title: "العمود الفقري",
    description: "تشخيص آلام الظهر والرقبة والانزلاق الغضروفي، مع البدء بالعلاج التحفظي كلما أمكن.",
    imageAlt: "صورة أشعة جانبية للرأس وفقرات الرقبة",
  },
  "sports-rehab": {
    title: "الإصابات الرياضية والتأهيل",
    description: "متابعة الإصابة من التشخيص حتى العودة الآمنة إلى الملعب ببرنامج تأهيل تدريجي.",
    imageAlt: "أخصائي تأهيل يوجّه مريضة أثناء تمرين بشريط مقاومة",
  },
  "fractures-trauma": {
    title: "الكسور والإصابات",
    description: "التعامل مع الكسور ومتابعة الالتئام، ثم استعادة الحركة والقوة بعد الإصابة.",
    imageAlt: "صورة أشعة لكسر في عظمة الترقوة",
  },
};
