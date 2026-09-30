import { routes } from "@/config/routes";
import type { Condition } from "@/types/content";

/**
 * PLACEHOLDER CONTENT — common orthopedic complaints, written as general
 * awareness text (not diagnoses or treatment promises). Replace or extend
 * once the doctor confirms the final list for the /services page.
 *
 * Images are placeholder stock photos (Unsplash License) — credits in
 * README.md. Replace `image` per condition; 4:3 at 1200×900 or larger.
 */
const image = (file: string, alt: string) => ({
  src: `/images/conditions/${file}.jpg`,
  alt,
  width: 1200,
  height: 900,
});

export const conditions: Condition[] = [
  {
    slug: "joint-pain",
    title: "آلام المفاصل",
    excerpt: "ألم مستمر أو متكرر في مفصل أو أكثر يؤثر على الحركة أو النوم، ويحتاج إلى تقييم لمعرفة سببه.",
    image: image("joint-pain", "شخص يجلس على الأرض ممسكًا بكاحله من الألم"),
    href: `${routes.services}#condition-joint-pain`,
    symptoms: ["ألم عند الحركة", "تورّم أو احمرار", "طقطقة مزعجة"],
    icon: "bone",
    featured: true,
    order: 1,
  },
  {
    slug: "back-pain",
    title: "آلام الظهر",
    excerpt: "ألم أسفل الظهر أو أعلاه يستمر لأيام أو يمتد إلى الساق، خاصة إذا صاحبه تنميل أو ضعف.",
    image: image("back-pain", "امرأة تضع يدها على أسفل ظهرها من الألم"),
    href: `${routes.services}#condition-back-pain`,
    symptoms: ["ألم ممتد للساق", "تنميل", "صعوبة في الانحناء"],
    icon: "spine",
    featured: true,
    order: 2,
  },
  {
    slug: "sports-injuries",
    title: "الإصابات الرياضية",
    excerpt: "التواءات أو تمزقات أو إصابات مفاجئة أثناء النشاط البدني تحتاج إلى فحص قبل العودة للتمرين.",
    image: image("sports-injuries", "لاعب يساعد زميله المصاب في الركبة أثناء المباراة"),
    href: `${routes.services}#condition-sports-injuries`,
    symptoms: ["ألم مفاجئ", "عدم ثبات المفصل", "كدمات وتورّم"],
    icon: "activity",
    featured: true,
    order: 3,
  },
  {
    slug: "stiffness-osteoarthritis",
    title: "تيبّس وخشونة المفاصل",
    excerpt: "تيبّس صباحي أو محدودية تدريجية في الحركة قد تكون من علامات خشونة المفاصل.",
    image: image("stiffness-osteoarthritis", "رسم تشريحي لمفصل الركبة"),
    href: `${routes.services}#condition-stiffness-osteoarthritis`,
    symptoms: ["تيبّس صباحي", "محدودية الحركة", "ألم مع المجهود"],
    icon: "personStanding",
    featured: true,
    order: 4,
  },
];
