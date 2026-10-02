import type { Qualification } from "@/types/content";

/**
 * Qualifications & certifications on the About page.
 *
 * PLACEHOLDER CONTENT — deliberately generic slots. Nothing here describes
 * a real degree, institution, year or certificate of the doctor. Replace
 * every field (and the artwork in /public/images/certificates) with the
 * verified details, then remove the page note in data/pages/about.ts.
 */
const certificate = (n: number, alt: string) => ({
  src: `/images/certificates/certificate-0${n}.jpg`,
  alt,
  width: 1200,
  height: 900,
});

export const qualifications: Qualification[] = [
  {
    id: "qualification-1",
    kind: "qualification",
    title: "المؤهل الجامعي",
    institution: "اسم الجامعة — يُضاف لاحقًا",
    year: "20XX",
    description: "الدرجة الجامعية في الطب؛ تُضاف تفاصيلها بعد اعتمادها من الطبيب.",
    image: certificate(1, "رسم توضيحي لشهادة جامعية (صورة مؤقتة)"),
    order: 1,
  },
  {
    id: "qualification-2",
    kind: "qualification",
    title: "مؤهل الدراسات العليا",
    institution: "اسم الجهة المانحة — يُضاف لاحقًا",
    year: "20XX",
    description: "درجة التخصص أو الدراسات العليا؛ تُضاف بعد التحقق منها.",
    image: certificate(2, "رسم توضيحي لشهادة دراسات عليا (صورة مؤقتة)"),
    order: 2,
  },
  {
    id: "qualification-3",
    kind: "qualification",
    title: "مؤهل تخصصي إضافي",
    institution: "اسم الجهة المانحة — يُضاف لاحقًا",
    year: "20XX",
    description: "مكان مخصص لزمالة أو دبلومة تخصصية إن وُجدت.",
    image: certificate(3, "رسم توضيحي لشهادة تخصصية (صورة مؤقتة)"),
    order: 3,
  },
  {
    id: "certification-1",
    kind: "certification",
    title: "شهادة تدريبية",
    institution: "اسم الجهة المانحة — يُضاف لاحقًا",
    year: "20XX",
    description: "دورة أو ورشة عمل تخصصية؛ يُضاف اسمها ومحتواها لاحقًا.",
    image: certificate(4, "رسم توضيحي لشهادة تدريبية (صورة مؤقتة)"),
    order: 4,
  },
  {
    id: "certification-2",
    kind: "certification",
    title: "برنامج تعليم طبي مستمر",
    institution: "اسم الجهة المانحة — يُضاف لاحقًا",
    year: "20XX",
    description: "مكان مخصص لبرامج التعليم الطبي المستمر المعتمدة.",
    image: certificate(5, "رسم توضيحي لشهادة تعليم طبي مستمر (صورة مؤقتة)"),
    order: 5,
  },
  {
    id: "certification-3",
    kind: "certification",
    title: "شهادة تدريبية إضافية",
    institution: "اسم الجهة المانحة — يُضاف لاحقًا",
    year: "20XX",
    description: "مكان مخصص لشهادة أو اعتماد إضافي بعد التحقق منه.",
    image: certificate(6, "رسم توضيحي لشهادة إضافية (صورة مؤقتة)"),
    order: 6,
  },
];
