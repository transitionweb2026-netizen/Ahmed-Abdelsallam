import type { ReviewId } from "@/data/shared/reviews";
import type { ReviewText } from "@/types/content";

/**
 * Reviews — Arabic text, keyed by id (ratings in data/shared/reviews.ts).
 *
 * PLACEHOLDER CONTENT — these are NOT real patients or real reviews.
 * Names and texts exist only to lay out the design. Replace with genuine,
 * consented patient reviews (or remove) before the site goes live.
 */
export const reviewsText: Record<ReviewId, ReviewText> = {
  "review-1": {
    name: "اسم المراجع ١",
    text: "شرح واضح للحالة من أول زيارة، واهتمام حقيقي بكل تفصيلة في الشكوى. خرجت وأنا فاهم خطة العلاج وخطواتها.",
    context: "استشارة آلام الركبة",
  },
  "review-2": {
    name: "اسم المراجع ٢",
    text: "مواعيد منظمة وتعامل راقٍ من الفريق. الطبيب استمع جيدًا وأجاب عن كل أسئلتي بصبر ووضوح.",
    context: "متابعة آلام الظهر",
  },
  "review-3": {
    name: "اسم المراجع ٣",
    text: "بعد إصابتي في التمرين كنت قلقًا من العودة للرياضة، والمتابعة كانت مطمئنة ومنظمة خطوة بخطوة.",
    context: "إصابة رياضية",
  },
  "review-4": {
    name: "اسم المراجع ٤",
    text: "تجربة مريحة وخطة واضحة، وأعجبني أن المتابعة لم تتوقف بعد الزيارة الأولى.",
    context: "استشارة آلام الكتف",
  },
  "review-5": {
    name: "اسم المراجع ٥",
    text: "الطبيب شرح لي نتيجة الأشعة بالتفصيل وبلغة بسيطة، ووضّح ما أحتاجه فعلًا وما لا أحتاجه.",
    context: "متابعة خشونة المفاصل",
  },
  "review-6": {
    name: "اسم المراجع ٦",
    text: "بعد الكسر كنت قلقًا من طول فترة التعافي، لكن كل مرحلة كانت واضحة ومعروفة مسبقًا، وهذا طمأنني كثيرًا.",
    context: "متابعة كسر في الرسغ",
  },
  "review-7": {
    name: "اسم المراجع ٧",
    text: "حجز سهل عبر واتساب ورد سريع على الاستفسارات. الانتظار في العيادة كان قصيرًا والتنظيم جيد.",
    context: "استشارة آلام الظهر",
  },
  "review-8": {
    name: "اسم المراجع ٨",
    text: "أكثر ما أعجبني أن الطبيب أشركني في اختيار خطة العلاج، وشرح الخيارات المتاحة ومميزات كل خيار.",
    context: "استشارة آلام الركبة",
  },
};
