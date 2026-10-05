import type { IconName } from "@/types/content";

/** Every icon key the site can render (components/ui/Icon.tsx). */
export const ICON_NAMES = [
  "bone",
  "boneFracture",
  "spine",
  "activity",
  "footprints",
  "hand",
  "shoulder",
  "personStanding",
  "stethoscope",
  "scan",
  "calendar",
  "clipboard",
  "clipboardCheck",
  "route",
  "searchCheck",
  "repeat",
  "heartHandshake",
  "shieldPlus",
  "sparkles",
  "play",
  "users",
  "messages",
  "clock",
  "phone",
  "mapPin",
  "dumbbell",
  "graduationCap",
  "award",
  "bookOpen",
  "heartPulse",
  "mail",
  "target",
  "microscope",
  "pill",
  "syringe",
  "listChecks",
  "info",
  "lightbulb",
  "alertCircle",
  "timer",
] as const satisfies readonly IconName[];

// Compile-time check that the list above names every icon.
type Missing = Exclude<IconName, (typeof ICON_NAMES)[number]>;
const complete: Missing extends never ? true : Missing = true;
void complete;

export function isIconName(value: unknown): value is IconName {
  return typeof value === "string" && (ICON_NAMES as readonly string[]).includes(value);
}
