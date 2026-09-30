import type { Faq } from "@/types/content";

/**
 * PLACEHOLDER CONTENT — generic answers pending the clinic's confirmed
 * policies (booking, durations, documents). Replace before launch.
 */
export const faqs: Faq[] = [
  {
    id: "faq-booking",
    question: "كيف يمكنني حجز موعد؟",
    answer:
      "يمكنك الحجز عبر الاتصال الهاتفي أو من خلال واتساب، وسيتم تأكيد الموعد المناسب لك مع توضيح أي تعليمات قبل الزيارة.",
    featured: true,
  },
  {
    id: "faq-first-visit",
    question: "ماذا أُحضر معي في الزيارة الأولى؟",
    answer:
      "يُفضّل إحضار أي أشعة أو تحاليل سابقة، وقائمة بالأدوية التي تتناولها، وأي تقارير طبية متعلقة بالشكوى الحالية.",
    featured: true,
  },
  {
    id: "faq-duration",
    question: "كم تستغرق الاستشارة؟",
    answer:
      "تختلف مدة الاستشارة حسب طبيعة الحالة، والهدف دائمًا أن تحصل على وقت كافٍ لشرح شكواك وفهم خطة العلاج.",
    featured: true,
  },
  {
    id: "faq-imaging",
    question: "هل أحتاج إلى أشعة قبل الزيارة؟",
    answer:
      "ليس بالضرورة؛ يحدد الطبيب بعد الفحص السريري ما إذا كانت هناك حاجة لأشعة أو فحوصات إضافية.",
    featured: true,
  },
  {
    id: "faq-follow-up",
    question: "كيف تتم المتابعة بعد بدء العلاج؟",
    answer:
      "يتم تحديد مواعيد المتابعة وفق خطة العلاج، مع تقييم التقدم وتعديل الخطة عند الحاجة.",
    featured: true,
  },
  {
    id: "faq-whatsapp",
    question: "هل يمكنني التواصل عبر واتساب؟",
    answer:
      "نعم، يمكنك إرسال استفسارك أو طلب الحجز عبر واتساب، وسيتم الرد عليك في أقرب وقت ممكن.",
    featured: true,
  },
];
