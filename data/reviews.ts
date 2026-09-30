import type { Review } from "@/types/content";

/**
 * PLACEHOLDER CONTENT — these are NOT real patients or real reviews.
 * Names and texts exist only to lay out the design. Replace with genuine,
 * consented patient reviews (or remove) before the site goes live.
 */
export const reviews: Review[] = [
  {
    id: "review-1",
    name: "اسم المراجع ١",
    rating: 5,
    text: "شرح واضح للحالة من أول زيارة، واهتمام حقيقي بكل تفصيلة في الشكوى. خرجت وأنا فاهم خطة العلاج وخطواتها.",
    context: "استشارة آلام الركبة",
    featured: true,
  },
  {
    id: "review-2",
    name: "اسم المراجع ٢",
    rating: 5,
    text: "مواعيد منظمة وتعامل راقٍ من الفريق. الطبيب استمع جيدًا وأجاب عن كل أسئلتي بصبر ووضوح.",
    context: "متابعة آلام الظهر",
    featured: true,
  },
  {
    id: "review-3",
    name: "اسم المراجع ٣",
    rating: 5,
    text: "بعد إصابتي في التمرين كنت قلقًا من العودة للرياضة، والمتابعة كانت مطمئنة ومنظمة خطوة بخطوة.",
    context: "إصابة رياضية",
    featured: true,
  },
  {
    id: "review-4",
    name: "اسم المراجع ٤",
    rating: 4,
    text: "تجربة مريحة وخطة واضحة، وأعجبني أن المتابعة لم تتوقف بعد الزيارة الأولى.",
    context: "استشارة آلام الكتف",
    featured: true,
  },
];
