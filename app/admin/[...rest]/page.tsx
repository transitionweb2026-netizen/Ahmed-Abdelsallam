import { notFound } from "next/navigation";

/** Unknown /admin URLs get the dashboard's 404 (instead of the public site's). */
export default function UnknownAdminPage() {
  notFound();
}
