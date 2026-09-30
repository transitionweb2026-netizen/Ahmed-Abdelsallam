import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import type { ArtDirectedImage as ArtDirectedImageValue } from "@/types/content";

interface ArtDirectedImageProps {
  image: ArtDirectedImageValue;
  className?: string;
  /** Viewport width at which the desktop crop takes over. */
  breakpoint?: number;
  priority?: boolean;
}

/**
 * <picture> with a portrait crop for phones and a landscape crop above
 * `breakpoint`, both optimised by next/image. Object positions are exposed
 * as CSS variables (--pos-mobile / --pos-desktop) for the stylesheet.
 */
export function ArtDirectedImage({ image, className, breakpoint = 768, priority = false }: ArtDirectedImageProps) {
  const { desktop, mobile = image.desktop } = image;
  const common = { alt: desktop.alt, sizes: "100vw" };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktop.src, width: desktop.width, height: desktop.height });
  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({ ...common, src: mobile.src, width: mobile.width, height: mobile.height });

  const style = {
    "--pos-mobile": mobile.objectPosition ?? "center",
    "--pos-desktop": desktop.objectPosition ?? "center",
  } as CSSProperties;

  return (
    <picture>
      <source media={`(min-width: ${breakpoint}px)`} srcSet={desktopSrcSet} sizes="100vw" />
      {/* next/image cannot art-direct; getImageProps keeps the optimisation pipeline. */}
      <img
        {...rest}
        srcSet={mobileSrcSet}
        alt={desktop.alt}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
