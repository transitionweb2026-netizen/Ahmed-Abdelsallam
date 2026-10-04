import type { QualificationId } from "@/data/shared/qualifications";
import type { QualificationText } from "@/types/content";

/**
 * Qualifications & certifications — Arabic text, keyed by id.
 *
 * PLACEHOLDER CONTENT — deliberately generic slots. Nothing here describes
 * a real degree, institution, year or certificate of the doctor.
 */
export const qualificationsText: Record<QualificationId, QualificationText> = {
  "qualification-1": {
    title: "المؤهل الجامعي",
    institution: "اسم الجامعة — يُضاف لاحقًا",
    description: "الدرجة الجامعية في الطب؛ تُضاف تفاصيلها بعد اعتمادها من الطبيب.",
    imageAlt: "رسم توضيحي لشهادة جامعية (صورة مؤقتة)",
  },
  "qualification-2": {
    title: "مؤهل الدراسات العليا",
    institution: "اسم الجهة المانحة — يُضاف لاحقًا",
    description: "درجة التخصص أو الدراسات العليا؛ تُضاف بعد التحقق منها.",
    imageAlt: "رسم توضيحي لشهادة دراسات عليا (صورة مؤقتة)",
  },
  "qualification-3": {
    title: "مؤهل تخصصي إضافي",
    institution: "اسم الجهة المانحة — يُضاف لاحقًا",
    description: "مكان مخصص لزمالة أو دبلومة تخصصية إن وُجدت.",
    imageAlt: "رسم توضيحي لشهادة تخصصية (صورة مؤقتة)",
  },
  "certification-1": {
    title: "شهادة تدريبية",
    institution: "اسم الجهة المانحة — يُضاف لاحقًا",
    description: "دورة أو ورشة عمل تخصصية؛ يُضاف اسمها ومحتواها لاحقًا.",
    imageAlt: "رسم توضيحي لشهادة تدريبية (صورة مؤقتة)",
  },
  "certification-2": {
    title: "برنامج تعليم طبي مستمر",
    institution: "اسم الجهة المانحة — يُضاف لاحقًا",
    description: "مكان مخصص لبرامج التعليم الطبي المستمر المعتمدة.",
    imageAlt: "رسم توضيحي لشهادة تعليم طبي مستمر (صورة مؤقتة)",
  },
  "certification-3": {
    title: "شهادة تدريبية إضافية",
    institution: "اسم الجهة المانحة — يُضاف لاحقًا",
    description: "مكان مخصص لشهادة أو اعتماد إضافي بعد التحقق منه.",
    imageAlt: "رسم توضيحي لشهادة إضافية (صورة مؤقتة)",
  },
};
