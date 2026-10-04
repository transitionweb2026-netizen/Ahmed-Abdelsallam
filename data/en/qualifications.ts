import type { QualificationId } from "@/data/shared/qualifications";
import type { QualificationText } from "@/types/content";

/**
 * Qualifications & certifications — English text, keyed by id.
 *
 * PLACEHOLDER CONTENT — deliberately generic slots. Nothing here describes
 * a real degree, institution, year or certificate of the doctor.
 */
export const qualificationsText: Record<QualificationId, QualificationText> = {
  "qualification-1": {
    title: "University degree",
    institution: "University name — to be added",
    description: "The doctor's medical degree; details will be added once approved by the doctor.",
    imageAlt: "Illustration of a university certificate (placeholder image)",
  },
  "qualification-2": {
    title: "Postgraduate qualification",
    institution: "Awarding body — to be added",
    description: "Specialty or postgraduate degree; to be added once verified.",
    imageAlt: "Illustration of a postgraduate certificate (placeholder image)",
  },
  "qualification-3": {
    title: "Additional specialty qualification",
    institution: "Awarding body — to be added",
    description: "Reserved for a fellowship or specialty diploma, if applicable.",
    imageAlt: "Illustration of a specialty certificate (placeholder image)",
  },
  "certification-1": {
    title: "Training certificate",
    institution: "Awarding body — to be added",
    description: "A specialist course or workshop; its name and content will be added later.",
    imageAlt: "Illustration of a training certificate (placeholder image)",
  },
  "certification-2": {
    title: "Continuing medical education",
    institution: "Awarding body — to be added",
    description: "Reserved for accredited continuing medical education programs.",
    imageAlt: "Illustration of a continuing medical education certificate (placeholder image)",
  },
  "certification-3": {
    title: "Additional training certificate",
    institution: "Awarding body — to be added",
    description: "Reserved for an additional certificate or accreditation once verified.",
    imageAlt: "Illustration of an additional certificate (placeholder image)",
  },
};
