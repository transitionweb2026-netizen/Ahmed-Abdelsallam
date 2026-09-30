import type { Video } from "@/types/content";

/**
 * The single 9-video dataset shared by the homepage (entries flagged
 * `featured`) and the future /videos page.
 *
 * PLACEHOLDER CONTENT — titles, durations and posters are placeholders and
 * every entry points at the same local placeholder clip. Replace `sources`
 * with the real files (MP4/H.264 recommended, ideally a WebM alternative)
 * or set `youtubeId` and remove `sources`.
 */
const placeholderPortraitClip = [{ src: "/videos/placeholder-portrait.webm", type: "video/webm" as const }];

const poster = (n: number, alt: string) => ({
  src: `/images/videos/video-${String(n).padStart(2, "0")}.jpg`,
  alt,
  width: 720,
  height: 1280,
});

export const videos: Video[] = [
  {
    slug: "knee-pain-causes",
    title: "أسباب شائعة لآلام الركبة",
    description: "نظرة سريعة على أكثر أسباب ألم الركبة شيوعًا ومتى تحتاج إلى الفحص.",
    poster: poster(1, "غلاف فيديو عن أسباب آلام الركبة"),
    sources: placeholderPortraitClip,
    duration: "1:20",
    orientation: "portrait",
    featured: true,
    order: 1,
  },
  {
    slug: "correct-sitting-posture",
    title: "الجلوس الصحيح لتجنّب آلام الظهر",
    description: "نصائح عملية لوضعية الجلوس أثناء العمل والمذاكرة.",
    poster: poster(2, "غلاف فيديو عن وضعية الجلوس الصحيحة"),
    sources: placeholderPortraitClip,
    duration: "0:58",
    orientation: "portrait",
    featured: true,
    order: 2,
  },
  {
    slug: "when-do-you-need-mri",
    title: "متى تحتاج إلى أشعة الرنين؟",
    description: "متى تكون الأشعة ضرورية، وكيف تستعد لها.",
    poster: poster(3, "غلاف فيديو عن أشعة الرنين المغناطيسي"),
    sources: placeholderPortraitClip,
    duration: "1:05",
    orientation: "portrait",
    order: 3,
  },
  {
    slug: "shoulder-strengthening",
    title: "تمارين بسيطة لتقوية الكتف",
    poster: poster(4, "غلاف فيديو عن تمارين تقوية الكتف"),
    sources: placeholderPortraitClip,
    duration: "1:40",
    orientation: "portrait",
    order: 4,
  },
  {
    slug: "ankle-sprain-first-aid",
    title: "الإسعافات الأولية لالتواء الكاحل",
    poster: poster(5, "غلاف فيديو عن الإسعافات الأولية للالتواء"),
    sources: placeholderPortraitClip,
    duration: "0:52",
    orientation: "portrait",
    order: 5,
  },
  {
    slug: "knee-osteoarthritis",
    title: "خشونة الركبة: الأعراض والتعامل معها",
    poster: poster(6, "غلاف فيديو عن خشونة الركبة"),
    sources: placeholderPortraitClip,
    duration: "1:35",
    orientation: "portrait",
    order: 6,
  },
  {
    slug: "return-to-sport",
    title: "العودة للرياضة بعد الإصابة",
    description: "خطوات تدريجية للعودة إلى التمرين بأمان بعد الإصابة.",
    poster: poster(7, "غلاف فيديو عن العودة للرياضة بعد الإصابة"),
    sources: placeholderPortraitClip,
    duration: "1:12",
    orientation: "portrait",
    featured: true,
    order: 7,
  },
  {
    slug: "neck-pain",
    title: "آلام الرقبة وقلة الحركة",
    poster: poster(8, "غلاف فيديو عن آلام الرقبة"),
    sources: placeholderPortraitClip,
    duration: "0:47",
    orientation: "portrait",
    order: 8,
  },
  {
    slug: "bone-health-with-age",
    title: "نصائح لصحة العظام مع التقدّم في العمر",
    poster: poster(9, "غلاف فيديو عن صحة العظام مع التقدم في العمر"),
    sources: placeholderPortraitClip,
    duration: "1:28",
    orientation: "portrait",
    order: 9,
  },
];

/** Landscape introduction video used by the homepage intro section. */
export const introVideo: Video = {
  slug: "doctor-introduction",
  title: "فيديو تعريفي مع د. أحمد عبد السلام",
  description: "فيديو تعريفي قصير عن أسلوب د. أحمد عبد السلام في التعامل مع الحالات.",
  poster: {
    src: "/images/videos/intro-poster.jpg",
    alt: "غلاف الفيديو التعريفي لـ د. أحمد عبد السلام",
    width: 1920,
    height: 1080,
  },
  // PLACEHOLDER clip — replace with the real introduction video.
  sources: [{ src: "/videos/placeholder-landscape.webm", type: "video/webm" }],
  duration: "2:30",
  orientation: "landscape",
  order: 0,
};
