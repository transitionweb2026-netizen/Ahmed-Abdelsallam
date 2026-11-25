# Static export for Hostinger

The public website is deployed two ways from this one codebase:

- **Hostinger** — a static export (`output: 'export'`), no server at all.
- **Vercel** — the ordinary Next.js app, unchanged, now reached only through `admin.<domain>`. This is where the CMS dashboard lives.

`npm run build` (the ordinary build, used by Vercel) is untouched by anything below — it only runs when `DEPLOYMENT_TARGET=export` is set, which the export script sets itself.

## Why this needs a script, not just `output: 'export'`

Next.js statically renders every route at build time when `output: 'export'` is set, and hard-fails the whole build if any route anywhere in `app/` uses a Server Action, `cookies()`, or another server-only API — even a route nobody is about to deploy. The `/admin` dashboard uses all three.

`scripts/build-export.mjs` physically moves the admin-only code closure out of the project (into the OS temp directory, not just renamed in place — `tsc`'s `include` glob still finds a renamed-in-place file) before running the build, and always moves it back afterward, including on a crash or Ctrl+C. The closure, confirmed by grep to have no importers outside itself:

- `app/admin/**`
- `components/admin/**`
- `lib/cms/admin/**`
- `lib/cms/upload.ts`
- `app/[lang]/[...rest]` — the catch-all that renders the branded 404 on the live server (see below)

If you add a new file that is exclusively for the admin dashboard, check with `grep -rl` whether anything outside `app/admin`/`components/admin`/`lib/cms/admin` imports it. If not, and it would otherwise break the export build, add it to the `ADMIN_CLOSURE` list in `scripts/build-export.mjs`.

## Why the 404 and the bare domain root work differently in each build

On Vercel, `proxy.ts` (this version's middleware) redirects the bare domain to `/ar` or `/en`, and sets a real 404 status for unknown paths under a language prefix (rendered by `app/[lang]/[...rest]`). Both rely on a server running per request, which `output: 'export'` doesn't have — Next's own docs list "Proxy" as unsupported for static export.

The export build instead ships two small root-level pages that work with no server:

- `app/page.tsx` — the bare domain root. A client component that reads the saved language cookie, then the browser's language, then defaults to Arabic, and redirects. On Vercel this page never actually renders — `proxy.ts` already redirected before Next would reach it.
- `app/not-found.tsx` — becomes `out/404.html`. Hostinger's `.htaccess` must point `ErrorDocument 404` at it so unmatched requests get a real HTTP 404 status with this branded page, not a 200. It detects the intended language from the URL client-side (the browser keeps the real requested URL in the address bar even though Apache substitutes this page's body).

## Running it

```bash
npm run build:export
```

Produces `out/`. Test it with any static file server before uploading (`npx serve out`, or equivalent) — this doesn't exercise Apache's `ErrorDocument`/trailing-slash behavior, so also sanity-check the real upload once it's live.
