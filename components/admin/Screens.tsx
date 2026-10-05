import { signOut } from "@/app/admin/_actions/auth";

/** Shown instead of the dashboard until Supabase is configured. */
export function SetupScreen() {
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="adm-card w-full max-w-xl p-6 sm:p-8">
        <p className="adm-badge adm-badge-amber">Setup needed</p>
        <h1 className="mt-3 text-xl font-bold">The CMS is not connected to Supabase yet</h1>
        <p className="mt-2 text-sm text-muted">
          The website currently shows the content bundled with the code. To edit it here, connect a Supabase project — the steps are in <code className="rounded bg-[#eceffa] px-1">docs/cms/SETUP.md</code>:
        </p>
        <ol className="mt-4 grid list-decimal gap-2 ps-5 text-sm text-[#3a4472]">
          <li>Run the two SQL files in <code className="rounded bg-[#eceffa] px-1">supabase/migrations</code> (SQL editor or Supabase CLI).</li>
          <li>Import the current content: run <code className="rounded bg-[#eceffa] px-1">supabase/seed/content.sql</code>.</li>
          <li>Create your user in Authentication → Users and make it the first owner (see the guide).</li>
          <li>
            Set <code className="rounded bg-[#eceffa] px-1">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="rounded bg-[#eceffa] px-1">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> and restart or redeploy.
          </li>
        </ol>
        <p className="mt-4 text-xs text-muted">No secret keys are needed by the website or this dashboard.</p>
      </div>
    </main>
  );
}

export function NoAccessScreen({ email }: { email: string }) {
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="adm-card max-w-sm p-6 text-center">
        <h1 className="text-lg font-bold">No CMS access</h1>
        <p className="mt-2 text-sm text-muted">{email} is signed in but is not a CMS administrator. Ask an owner to add this account under Admin users.</p>
        <form action={signOut} className="mt-5">
          <button type="submit" className="adm-btn adm-btn-primary">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
