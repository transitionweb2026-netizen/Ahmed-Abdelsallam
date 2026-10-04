import { placeholderClips, type VideoSlug } from "@/data/shared/videos";
import type { VideoText } from "@/types/content";

/**
 * Videos — English text, keyed by slug (posters and durations in
 * data/shared/videos.ts).
 *
 * PLACEHOLDER CONTENT — titles are placeholders and every entry points at
 * the same English placeholder clip. When the real videos are in Arabic, keep
 * the English titles and add English `captions` (WebVTT) here.
 */
const clip = placeholderClips.en.portrait;

export const videosText: Record<VideoSlug, VideoText> = {
  "knee-pain-causes": {
    title: "Common causes of knee pain",
    description: "A quick look at the most common causes of knee pain, and when you need an examination.",
    posterAlt: "Cover of a video about the causes of knee pain",
    sources: [...clip],
  },
  "correct-sitting-posture": {
    title: "Sitting correctly to avoid back pain",
    description: "Practical tips for your posture while you work or study.",
    posterAlt: "Cover of a video about correct sitting posture",
    sources: [...clip],
  },
  "when-do-you-need-mri": {
    title: "When do you need an MRI?",
    description: "When a scan is really necessary, and how to prepare for it.",
    posterAlt: "Cover of a video about MRI scans",
    sources: [...clip],
  },
  "shoulder-strengthening": {
    title: "Simple shoulder-strengthening exercises",
    posterAlt: "Cover of a video about shoulder-strengthening exercises",
    sources: [...clip],
  },
  "ankle-sprain-first-aid": {
    title: "First aid for a sprained ankle",
    posterAlt: "Cover of a video about first aid for sprains",
    sources: [...clip],
  },
  "knee-osteoarthritis": {
    title: "Knee osteoarthritis: symptoms and self-care",
    posterAlt: "Cover of a video about knee osteoarthritis",
    sources: [...clip],
  },
  "return-to-sport": {
    title: "Returning to sport after an injury",
    description: "Gradual steps for getting back to training safely after an injury.",
    posterAlt: "Cover of a video about returning to sport after an injury",
    sources: [...clip],
  },
  "neck-pain": {
    title: "Neck pain and stiffness",
    posterAlt: "Cover of a video about neck pain",
    sources: [...clip],
  },
  "bone-health-with-age": {
    title: "Keeping your bones healthy as you age",
    posterAlt: "Cover of a video about bone health with age",
    sources: [...clip],
  },
};

/** Landscape introduction video (homepage intro and /about). */
export const introVideoText: VideoText = {
  title: "Meet Dr. Ahmed Abdelsalam",
  description: "A short introduction to Dr. Ahmed Abdelsalam's approach to patient care.",
  posterAlt: "Cover of Dr. Ahmed Abdelsalam's introductory video",
  // PLACEHOLDER clip — replace with the real introduction video.
  sources: [...placeholderClips.en.landscape],
};
