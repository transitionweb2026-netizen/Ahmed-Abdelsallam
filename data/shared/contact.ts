import type { ContactBase } from "@/types/content";

/**
 * Clinic location and flags — language-neutral. The address lines, hours and
 * map label live in data/{ar,en}/contact.ts. Phone and WhatsApp come from
 * environment variables (see config/site.ts).
 *
 * PLACEHOLDER CONTENT — the pin is a generic central-Cairo coordinate so the
 * map has something to show. While `map.isPlaceholder` is true the page
 * labels the map as provisional and hides the directions link. Replace
 * `lat`/`lng` with the clinic's coordinates and set the flags to false.
 */
export const contactBase: ContactBase = {
  address: { isPlaceholder: true },
  hoursArePlaceholder: true,
  // email: "clinic@example.com",
  map: {
    lat: 30.0444,
    lng: 31.2357,
    zoom: 15,
    isPlaceholder: true,
  },
};
