import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { RichTitle as RichTitleValue } from "@/types/content";

interface RichTitleProps {
  title: RichTitleValue;
  /** "light" for navy surfaces. */
  tone?: "dark" | "light";
}

/** Renders CMS title parts, colouring accented words with the brand gradient. */
export function RichTitle({ title, tone = "dark" }: RichTitleProps) {
  if (typeof title === "string") return <>{title}</>;
  return (
    <>
      {title.map((part, index) => (
        <Fragment key={`${part.text}-${index}`}>
          {index > 0 && !title[index - 1].breakAfter ? " " : null}
          <span className={cn(part.accent && (tone === "light" ? "text-accent-light" : "text-accent-gradient"))}>{part.text}</span>
          {part.breakAfter ? <br /> : null}
        </Fragment>
      ))}
    </>
  );
}
