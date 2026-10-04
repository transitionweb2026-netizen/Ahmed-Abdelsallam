import type { ContactText } from "@/types/content";

/**
 * Clinic address, hours and map label — English (pin and flags in
 * data/shared/contact.ts).
 *
 * PLACEHOLDER CONTENT — the address and opening hours are NOT the real clinic.
 */
export const contactText: ContactText = {
  addressLines: ["Clinic address to be added", "City — Governorate"],
  hours: [
    { days: "Working days", time: "To be confirmed" },
    { days: "Consultations", time: "By appointment" },
  ],
  mapLabel: "Clinic location",
};
