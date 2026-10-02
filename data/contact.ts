import type { ContactInfo } from "@/types/content";

/**
 * Clinic contact details. Phone and WhatsApp come from environment variables
 * (see config/site.ts); everything else lives here.
 *
 * PLACEHOLDER CONTENT — the address, opening hours and map pin are NOT the
 * real clinic. The pin is a generic central-Cairo coordinate so the map has
 * something to show; while `map.isPlaceholder` is true the page labels the
 * map as provisional and hides the directions link. Replace `lat`/`lng`
 * with the clinic's coordinates and set the flags to false.
 */
export const contactInfo: ContactInfo = {
  address: {
    lines: ["عنوان العيادة يُضاف لاحقًا", "المدينة — المحافظة"],
    isPlaceholder: true,
  },
  hours: [
    { days: "أيام العمل", time: "تُحدَّد لاحقًا" },
    { days: "مواعيد الاستشارات", time: "بالحجز المسبق" },
  ],
  hoursArePlaceholder: true,
  // email: "clinic@example.com",
  map: {
    lat: 30.0444,
    lng: 31.2357,
    zoom: 15,
    label: "موقع العيادة",
    isPlaceholder: true,
  },
};
