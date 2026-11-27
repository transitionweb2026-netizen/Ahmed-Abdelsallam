# Publishing to Hostinger

The admin dashboard's "Publish Live Site" button (`components/admin/PublishButton.tsx`) calls a Server Action (`app/admin/_actions/publish.ts`) that dispatches `.github/workflows/publish-site.yml` via the GitHub API, then polls it. The workflow does the actual work: build, back up, upload, verify, and roll back automatically if anything looks wrong.

## One-time setup

**Vercel → this project's environment variables:**
- `GITHUB_PUBLISH_TOKEN` — a fine-grained GitHub personal access token, scoped to **only** this repo, with "Actions: Read and write" permission and nothing else.

**GitHub → repo Settings → Secrets and variables → Actions → Secrets:**
- `SFTP_HOST`, `SFTP_PORT`, `SFTP_USERNAME`, `SFTP_PRIVATE_KEY`, `SFTP_REMOTE_DIR` — connection details for a dedicated SSH keypair created for this project (never one shared with another client's deployment). The private key is uploaded with `gh secret set SFTP_PRIVATE_KEY < path/to/key` so it's never pasted anywhere, including chat.

**GitHub → same page → Variables:**
- `SFTP_HOST_KEY_FINGERPRINT` — the server's SSH host key fingerprint, confirmed out of band (from hPanel). Public by nature; this is what pins the connection against a MITM, not a secret.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL` — same values the Vercel deployment already uses.

**GitHub → repo Settings → Environments → `production`:** add a required reviewer here to make every deploy pause for manual approval before it touches Hostinger. Both the `deploy` and `rollback` jobs run under this environment.

## What a publish actually does

1. **`build`** — `npm run build:export`, which also writes `out/build-id.txt` (the commit SHA).
2. **`deploy`**:
   - Pins the SSH host key against `SFTP_HOST_KEY_FINGERPRINT` before connecting at all — a mismatch aborts immediately.
   - Downloads the *current* live site over SFTP into a GitHub Actions artifact (90-day retention) before touching anything.
   - Refuses to continue if that backup looks implausible (too few files, missing `.htaccess`).
   - Uploads the new build (no `--delete` — nothing on the server is ever removed, only added to or overwritten).
   - Verifies by fetching `/build-id.txt` from the live domain, resolved straight to Hostinger's IP (so this works even before DNS points there).
   - If the upload or that verification failed, automatically re-uploads the pre-deploy backup.
   - Only on real success, records this build on the `export-last-known-good` branch.
3. **Rollback** — the same workflow with `rollback: true`: skips building, re-deploys `export-last-known-good` instead.

## Known limitations (see the audit this was built from)

- Deployment is file-sync based, not atomic — a visitor could in principle see a brief mix of old/new files during an upload. A true atomic swap (upload to a sibling directory, then rename it over `public_html`) would need the hosting account to support creating a sibling directory and renaming it over SFTP — unconfirmed. A safe, non-destructive probe for this (create → rename → delete a throwaway test directory, never touching `public_html`) is designed but not yet run.
- File permissions after upload haven't been verified against what Apache/LiteSpeed expects — worth checking once real content is live.
