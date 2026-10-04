import type { VideoBase } from "@/types/content";

/**
 * The single 9-video dataset shared by the homepage (entries flagged
 * `featured`) and /videos — language-neutral fields. Titles, descriptions,
 * poster alt text and video files live in data/{ar,en}/videos.ts.
 *
 * PLACEHOLDER CONTENT — durations and posters are placeholders.
 */
const poster = (n: number) => ({
  src: `/images/videos/video-${String(n).padStart(2, "0")}.jpg`,
  width: 720,
  height: 1280,
});

export const videoBase = [
  { slug: "knee-pain-causes", poster: poster(1), duration: "1:20", orientation: "portrait", featured: true, order: 1 },
  { slug: "correct-sitting-posture", poster: poster(2), duration: "0:58", orientation: "portrait", featured: true, order: 2 },
  { slug: "when-do-you-need-mri", poster: poster(3), duration: "1:05", orientation: "portrait", order: 3 },
  { slug: "shoulder-strengthening", poster: poster(4), duration: "1:40", orientation: "portrait", order: 4 },
  { slug: "ankle-sprain-first-aid", poster: poster(5), duration: "0:52", orientation: "portrait", order: 5 },
  { slug: "knee-osteoarthritis", poster: poster(6), duration: "1:35", orientation: "portrait", order: 6 },
  { slug: "return-to-sport", poster: poster(7), duration: "1:12", orientation: "portrait", featured: true, order: 7 },
  { slug: "neck-pain", poster: poster(8), duration: "0:47", orientation: "portrait", order: 8 },
  { slug: "bone-health-with-age", poster: poster(9), duration: "1:28", orientation: "portrait", order: 9 },
] as const satisfies readonly VideoBase[];

export type VideoSlug = (typeof videoBase)[number]["slug"];

/** Landscape introduction video (homepage intro and /about). */
export const introVideoBase = {
  slug: "doctor-introduction",
  poster: { src: "/images/videos/intro-poster.jpg", width: 1920, height: 1080 },
  duration: "2:30",
  orientation: "landscape",
  order: 0,
} as const satisfies VideoBase;

/** Placeholder clips, one per language (the on-screen label is translated). */
export const placeholderClips = {
  ar: {
    portrait: [{ src: "/videos/placeholder-portrait.webm", type: "video/webm" }],
    landscape: [{ src: "/videos/placeholder-landscape.webm", type: "video/webm" }],
  },
  en: {
    portrait: [{ src: "/videos/placeholder-portrait-en.webm", type: "video/webm" }],
    landscape: [{ src: "/videos/placeholder-landscape-en.webm", type: "video/webm" }],
  },
} as const;
