import type { SpecialtySlug } from "@/data/shared/specialties";
import type { SpecialtyText } from "@/types/content";

/**
 * Key specialties on the About page — English text, keyed by slug.
 *
 * PLACEHOLDER CONTENT — general orthopedic areas pending the doctor's
 * confirmed focus.
 */
export const specialtiesText: Record<SpecialtySlug, SpecialtyText> = {
  "knee-joints": {
    title: "Knee and Joints",
    description: "Assessing and treating knee pain, osteoarthritis, and ligament and cartilage injuries.",
    imageAlt: "An anatomical drawing of the knee ligaments",
  },
  spine: {
    title: "Spine",
    description: "Diagnosing back and neck pain and herniated discs, starting with conservative treatment whenever possible.",
    imageAlt: "A side-view X-ray of the head and neck vertebrae",
  },
  "sports-rehab": {
    title: "Sports Injuries and Rehabilitation",
    description: "Following an injury from diagnosis to a safe return to play, with a gradual rehabilitation program.",
    imageAlt: "A rehabilitation specialist guiding a patient through a resistance-band exercise",
  },
  "fractures-trauma": {
    title: "Fractures and Injuries",
    description: "Managing fractures and monitoring healing, then restoring movement and strength after the injury.",
    imageAlt: "An X-ray of a collarbone fracture",
  },
};
