import Link from "next/link";

/** 404 inside the dashboard (unknown collection, deleted item …). */
export default function AdminNotFound() {
  return (
    <main className="grid min-h-[60dvh] place-items-center p-4">
      <div className="adm-card max-w-sm p-6 text-center">
        <h1 className="text-lg font-bold">Not found</h1>
        <p className="mt-2 text-sm text-muted">This page or item does not exist — it may have been deleted.</p>
        <Link href="/admin" className="adm-btn adm-btn-primary mt-5">
          Back to the dashboard
        </Link>
      </div>
    </main>
  );
}
