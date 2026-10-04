import type { CareerStepId } from "@/data/shared/career";
import type { CareerStepText } from "@/types/content";

/**
 * Career journey — English text, keyed by id.
 *
 * PLACEHOLDER CONTENT — generic stages only. Years ("20XX"), institutions
 * and positions are intentionally left blank; replace them with the
 * doctor's verified career history.
 */
export const careerText: Record<CareerStepId, CareerStepText> = {
  education: {
    meta: "20XX",
    title: "Medical school",
    description: "The years of medical study; the university and graduation year will be added once approved.",
  },
  training: {
    meta: "20XX",
    title: "Clinical training",
    description: "The hands-on training years; the training institution and duration will be added.",
  },
  specialization: {
    meta: "20XX",
    title: "Specializing in orthopedics",
    description: "The specialty training stage; the degree and awarding body will be added.",
  },
  development: {
    meta: "20XX",
    title: "Professional development",
    description: "Courses, conferences and advanced training; details will be added later.",
  },
  practice: {
    meta: "Present",
    title: "Current practice",
    description: "The current place of practice; the clinic or hospital name will be added.",
  },
};
