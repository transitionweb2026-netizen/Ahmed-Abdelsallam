import { placeholderClips, type VideoSlug } from "@/data/shared/videos";
import type { VideoText } from "@/types/content";

/**
 * Videos — Arabic text, keyed by slug (posters and durations in
 * data/shared/videos.ts).
 *
 * PLACEHOLDER CONTENT — titles are placeholders and every entry points at
 * the same local placeholder clip. Replace `sources` with the real files
 * (MP4/H.264 recommended, ideally a WebM alternative) or set `youtubeId` in
 * data/shared/videos.ts and remove `sources`.
 */
const clip = placeholderClips.ar.portrait;

export const videosText: Record<VideoSlug, VideoText> = {
  "knee-pain-causes": {
    title: "أسباب شائعة لآلام الركبة",
    description: "نظرة سريعة على أكثر أسباب ألم الركبة شيوعًا ومتى تحتاج إلى الفحص.",
    posterAlt: "غلاف فيديو عن أسباب آلام الركبة",
    sources: [...clip],
  },
  "correct-sitting-posture": {
    title: "الجلوس الصحيح لتجنّب آلام الظهر",
    description: "نصائح عملية لوضعية الجلوس أثناء العمل والمذاكرة.",
    posterAlt: "غلاف فيديو عن وضعية الجلوس الصحيحة",
    sources: [...clip],
  },
  "when-do-you-need-mri": {
    title: "متى تحتاج إلى أشعة الرنين؟",
    description: "متى تكون الأشعة ضرورية، وكيف تستعد لها.",
    posterAlt: "غلاف فيديو عن أشعة الرنين المغناطيسي",
    sources: [...clip],
  },
  "shoulder-strengthening": {
    title: "تمارين بسيطة لتقوية الكتف",
    posterAlt: "غلاف فيديو عن تمارين تقوية الكتف",
    sources: [...clip],
  },
  "ankle-sprain-first-aid": {
    title: "الإسعافات الأولية لالتواء الكاحل",
    posterAlt: "غلاف فيديو عن الإسعافات الأولية للالتواء",
    sources: [...clip],
  },
  "knee-osteoarthritis": {
    title: "خشونة الركبة: الأعراض والتعامل معها",
    posterAlt: "غلاف فيديو عن خشونة الركبة",
    sources: [...clip],
  },
  "return-to-sport": {
    title: "العودة للرياضة بعد الإصابة",
    description: "خطوات تدريجية للعودة إلى التمرين بأمان بعد الإصابة.",
    posterAlt: "غلاف فيديو عن العودة للرياضة بعد الإصابة",
    sources: [...clip],
  },
  "neck-pain": {
    title: "آلام الرقبة وقلة الحركة",
    posterAlt: "غلاف فيديو عن آلام الرقبة",
    sources: [...clip],
  },
  "bone-health-with-age": {
    title: "نصائح لصحة العظام مع التقدّم في العمر",
    posterAlt: "غلاف فيديو عن صحة العظام مع التقدم في العمر",
    sources: [...clip],
  },
};

/** Landscape introduction video (homepage intro and /about). */
export const introVideoText: VideoText = {
  title: "فيديو تعريفي مع د. أحمد عبد السلام",
  description: "فيديو تعريفي قصير عن أسلوب د. أحمد عبد السلام في التعامل مع الحالات.",
  posterAlt: "غلاف الفيديو التعريفي لـ د. أحمد عبد السلام",
  // PLACEHOLDER clip — replace with the real introduction video.
  sources: [...placeholderClips.ar.landscape],
};
