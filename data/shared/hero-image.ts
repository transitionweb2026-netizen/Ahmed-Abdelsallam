import type { ArtDirectedImage } from "@/types/content";

/**
 * Page cover: a 16:9 desktop crop plus a portrait crop for phones, in
 * /public/images/hero (`<name>-cover.jpg` 3200×1800, `<name>-cover-mobile.jpg`
 * 1200×1667). Keep the subject on the left so the right-hand (RTL) text side
 * stays calm.
 *
 * PLACEHOLDER stock photos (Unsplash License) — credits in README.md.
 */
export function heroImage(
  name: string,
  alt: string,
  position: { desktop?: string; mobile?: string } = {},
): ArtDirectedImage {
  return {
    desktop: {
      src: `/images/hero/${name}-cover.jpg`,
      alt,
      width: 3200,
      height: 1800,
      objectPosition: position.desktop ?? "center",
    },
    mobile: {
      src: `/images/hero/${name}-cover-mobile.jpg`,
      alt,
      width: 1200,
      height: 1667,
      objectPosition: position.mobile ?? "center top",
    },
  };
}
