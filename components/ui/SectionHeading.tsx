import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichTitle } from "@/components/ui/RichTitle";
import { cn } from "@/lib/utils";
import type { SectionHeading as SectionHeadingValue } from "@/types/content";

interface SectionHeadingProps {
  heading: SectionHeadingValue;
  id: string;
  align?: "center" | "start";
  as?: "h2" | "h3";
  className?: string;
}

export function SectionHeading({ heading, id, align = "center", as: Tag = "h2", className }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      variant="blur"
      className={cn(
        "flex flex-col gap-4",
        centered ? "mx-auto max-w-2xl items-center text-center" : "items-start text-start",
        className,
      )}
    >
      <Eyebrow>{heading.eyebrow}</Eyebrow>
      <Tag id={id} className="type-h2">
        <RichTitle title={heading.title} />
      </Tag>
      {centered ? <Ornament gradientId={`${id}-ornament`} /> : null}
      {heading.description ? (
        <p className={cn("type-lead text-muted", centered ? "max-w-xl" : "max-w-lg")}>{heading.description}</p>
      ) : null}
    </Reveal>
  );
}

/** Thin lavender swash under centred headings. */
function Ornament({ gradientId }: { gradientId: string }) {
  return (
    <svg width="120" height="12" viewBox="0 0 120 12" fill="none" aria-hidden="true" className="-mt-1">
      <path d="M2 8c20-6 38-6 58-1s38 5 58-1" stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8B6F3" stopOpacity="0" />
          <stop offset="0.5" stopColor="#A8B6F3" />
          <stop offset="1" stopColor="#1B275B" stopOpacity="0.35" />
        </linearGradient>
      </defs>
    </svg>
  );
}
