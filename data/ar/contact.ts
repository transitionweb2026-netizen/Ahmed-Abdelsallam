import type { ContactText } from "@/types/content";

/**
 * Clinic address, hours and map label — Arabic (pin and flags in
 * data/shared/contact.ts).
 *
 * PLACEHOLDER CONTENT — the address and opening hours are NOT the real clinic.
 */
export const contactText: ContactText = {
  addressLines: ["عنوان العيادة يُضاف لاحقًا", "المدينة — المحافظة"],
  hours: [
    { days: "أيام العمل", time: "تُحدَّد لاحقًا" },
    { days: "مواعيد الاستشارات", time: "بالحجز المسبق" },
  ],
  mapLabel: "موقع العيادة",
};
