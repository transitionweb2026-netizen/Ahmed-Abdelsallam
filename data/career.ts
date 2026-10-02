import type { JourneyStep } from "@/types/content";

/**
 * Career journey on the About page.
 *
 * PLACEHOLDER CONTENT — generic stages only. Years ("20XX"), institutions
 * and positions are intentionally left blank; replace them with the
 * doctor's verified career history.
 */
export const careerSteps: JourneyStep[] = [
  {
    id: "education",
    meta: "20XX",
    title: "الدراسة الجامعية",
    description: "سنوات دراسة الطب؛ تُضاف الجامعة وسنة التخرج بعد اعتمادها.",
    icon: "graduationCap",
  },
  {
    id: "training",
    meta: "20XX",
    title: "سنوات التدريب",
    description: "مرحلة التدريب العملي؛ تُضاف جهة التدريب ومدته.",
    icon: "stethoscope",
  },
  {
    id: "specialization",
    meta: "20XX",
    title: "التخصص في العظام",
    description: "مرحلة التخصص؛ تُضاف الدرجة العلمية والجهة المانحة.",
    icon: "bone",
  },
  {
    id: "development",
    meta: "20XX",
    title: "التطوير المهني",
    description: "دورات ومؤتمرات وتدريب متقدم؛ تُضاف تفاصيلها لاحقًا.",
    icon: "award",
  },
  {
    id: "practice",
    meta: "الآن",
    title: "الممارسة الحالية",
    description: "مكان الممارسة الحالي؛ يُضاف اسم العيادة أو المستشفى.",
    icon: "heartHandshake",
  },
];
