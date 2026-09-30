import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Decorative primitives. All are aria-hidden, pointer-events: none, and
 * built from gradients (no filter: blur) so they cost nothing at runtime.
 */

const ORB_COLORS = {
  lavender: "rgba(168, 182, 243, 0.55)",
  navy: "rgba(27, 39, 91, 0.16)",
  blue: "rgba(195, 209, 248, 0.7)",
  white: "rgba(255, 255, 255, 0.9)",
} as const;

interface DecorProps {
  className?: string;
  style?: CSSProperties;
}

export function Orb({ className, style, color = "lavender" }: DecorProps & { color?: keyof typeof ORB_COLORS }) {
  return (
    <span
      aria-hidden="true"
      className={cn("orb", className)}
      style={{ ...style, ["--orb-color" as string]: ORB_COLORS[color] }}
    />
  );
}

export function GlassRing({ className, style }: DecorProps) {
  return <span aria-hidden="true" className={cn("glass-ring", className)} style={style} />;
}

export function DotGrid({ className, style }: DecorProps) {
  return <span aria-hidden="true" className={cn("dot-grid", className)} style={style} />;
}

/** Thin flowing lines, like contour lines of motion. */
export function CurveLines({ className, style }: DecorProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none absolute", className)}
      style={style}
      viewBox="0 0 600 240"
      fill="none"
      preserveAspectRatio="none"
    >
      <path d="M0 180C120 120 200 210 320 150S520 40 600 90" stroke="rgba(168,182,243,0.7)" strokeWidth="1.2" />
      <path d="M0 200C130 150 210 230 330 175S520 70 600 120" stroke="rgba(27,39,91,0.14)" strokeWidth="1" />
      <path d="M0 160C110 95 190 185 310 125S515 15 600 60" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
    </svg>
  );
}

/** Soft medical cross built from two glass bars. */
export function PlusMark({ className, style, id }: DecorProps & { id: string }) {
  const fill = `${id}-fill`;
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute", className)} style={style}>
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none">
        <defs>
          <linearGradient id={fill} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="1" stopColor="#A8B6F3" stopOpacity="0.75" />
          </linearGradient>
        </defs>
        <rect x="18" y="4" width="12" height="40" rx="6" fill={`url(#${fill})`} stroke="#FFFFFF" strokeOpacity="0.9" />
        <rect x="4" y="18" width="40" height="12" rx="6" fill={`url(#${fill})`} stroke="#FFFFFF" strokeOpacity="0.9" />
      </svg>
    </span>
  );
}
