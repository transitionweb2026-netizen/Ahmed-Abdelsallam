"use client";

import { useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

interface TiltCardProps {
  className?: string;
  children: ReactNode;
}

/**
 * Pointer-driven 3D tilt, spring-smoothed. Exposes `--tilt-x` / `--tilt-y`
 * (-1…1) and `--mx` / `--my` (pointer position) as CSS variables so the
 * stylesheet decides how each layer reacts. Disabled for touch input and
 * reduced motion.
 */
export function TiltCard({ className, children }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const finePointer = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });

  useMotionValueEvent(springX, "change", (v) => ref.current?.style.setProperty("--tilt-x", v.toFixed(4)));
  useMotionValueEvent(springY, "change", (v) => ref.current?.style.setProperty("--tilt-y", v.toFixed(4)));

  useEffect(() => {
    finePointer.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || reduce || !finePointer.current) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    x.set(px * 2 - 1);
    y.set(py * 2 - 1);
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div ref={ref} className={className} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      {children}
    </div>
  );
}
