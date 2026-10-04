import type { CareerStepId } from "@/data/shared/career";
import type { CareerStepText } from "@/types/content";

/**
 * Career journey — Arabic text, keyed by id.
 *
 * PLACEHOLDER CONTENT — generic stages only. Years ("20XX"), institutions
 * and positions are intentionally left blank; replace them with the
 * doctor's verified career history.
 */
export const careerText: Record<CareerStepId, CareerStepText> = {
  education: {
    meta: "20XX",
    title: "الدراسة الجامعية",
    description: "سنوات دراسة الطب؛ تُضاف الجامعة وسنة التخرج بعد اعتمادها.",
  },
  training: {
    meta: "20XX",
    title: "سنوات التدريب",
    description: "مرحلة التدريب العملي؛ تُضاف جهة التدريب ومدته.",
  },
  specialization: {
    meta: "20XX",
    title: "التخصص في العظام",
    description: "مرحلة التخصص؛ تُضاف الدرجة العلمية والجهة المانحة.",
  },
  development: {
    meta: "20XX",
    title: "التطوير المهني",
    description: "دورات ومؤتمرات وتدريب متقدم؛ تُضاف تفاصيلها لاحقًا.",
  },
  practice: {
    meta: "الآن",
    title: "الممارسة الحالية",
    description: "مكان الممارسة الحالي؛ يُضاف اسم العيادة أو المستشفى.",
  },
};
