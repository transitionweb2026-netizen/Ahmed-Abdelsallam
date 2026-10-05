# CMS setup — Supabase

The website's content (both languages) is managed in a dashboard at **`/admin`**, stored in Supabase (Postgres + Auth + Storage). This guide connects a Supabase project, imports the current content and creates the first administrator.

Until it is connected, the website keeps working with the content bundled in `data/`, and `/admin` shows a short version of these steps.

**No secret keys are needed anywhere.** The website, the dashboard and the scripts only use the project URL and the *publishable* key. What a key can do is decided by Row Level Security in the database. Administrators sign in with their own email and password, and their rights come from the `public.admins` table, checked on the server and again by the database.

---

## 1. Create the project

1. [supabase.com](https://supabase.com) → **New project**. A region close to the visitors (for Egypt, e.g. *Frankfurt* or *Paris*) keeps pages fast.
2. Save the database password in your password manager. This setup does not need it.

## 2. Create the tables (migrations)

The two files in `supabase/migrations/` create the tables, security policies and the `media` storage bucket. They never delete data and can be run again safely.

**Option A — SQL editor (simplest).** Open Supabase → **SQL Editor** → **New query**. Paste the whole of `20261004120000_cms_schema.sql`, run it, then do the same with `20261004120100_cms_storage.sql`, in that order.

**Option B — Supabase CLI.**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Future schema changes are new files in `supabase/migrations/`, applied the same way. Existing files are never edited.

## 3. Import the current content

Run `supabase/seed/content.sql` in the SQL editor: paste the whole file and run it. It copies every page section, collection item, setting, menu item and interface text of the current website into the database.

- It never overwrites anything. Rows that already exist are skipped, so it is safe to run again.
- It is generated from the code with `npm run cms:seed-sql`. A test fails if it is out of date.
- Images and videos stay where they are (`public/`), registered in the media library. New uploads go to Supabase Storage.

Alternative: skip this step, finish steps 4–6, start the site locally and use **Dashboard → Import content** (owners only). It does the same thing.

> Reviews: 8 of the imported reviews are **layout placeholders**, marked as such in the dashboard. They are not real patient feedback. Replace them with genuine reviews (with the patients' consent) or set them to *Draft* before launch. The dashboard shows a warning while any are published.

## 4. Create the first administrator

1. Supabase → **Authentication → Users → Add user → Create new user**. Enter the email and a strong password, and tick *Auto confirm user*.
2. Open `supabase/seed/first-owner.sql`, replace the email, then run it in the SQL editor. The last query should list that email with the role `owner`.

Owners add further people later from **Dashboard → Admin users**:

1. First create or invite the person in Supabase (**Authentication → Users → Invite user**).
2. Then add their email in the dashboard as an *editor* (content) or *owner* (content + administrators + import).

## 5. Authentication settings

Supabase → **Authentication → URL Configuration**:

| Setting | Value |
| --- | --- |
| Site URL | `https://www.your-domain.com` (your production address) |
| Redirect URLs | `https://www.your-domain.com/admin/auth/confirm`<br>`http://localhost:3000/admin/auth/confirm` (local development)<br>Vercel previews if needed, e.g. `https://*-your-team.vercel.app/admin/auth/confirm` |

**Sign-ups.** Supabase → **Authentication → Sign In / Providers → Email**: turn off **Allow new users to sign up**. Administrators are always created by an owner. Accounts that are not in `public.admins` cannot do anything, but there is no reason to allow them.

**Password-reset and invite emails** work with the default templates; the link lands on `/admin/auth/confirm`. Optionally, so the link also works in a different browser than the one that requested it, change the *Reset password* template's link to:

```
{{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/admin/account
```

and the *Invite user* template's link to the same with `type=invite`.

Supabase's built-in email sender is limited to a few emails per hour and is meant for testing. For production, set up your own SMTP under **Authentication → Emails → SMTP Settings**. Reset emails depend on this; it is a Supabase setting, not part of this code.

## 6. Storage limits

The migration creates the public bucket `media`. It holds images (JPG, PNG, WebP, AVIF, GIF, ICO) and videos (MP4, WebM), with a 200 MB limit per file. Only administrators can upload, replace or delete files; anyone can view them, because they are shown on the website.

Supabase also has a **project-wide upload limit** (Storage → Settings → *Upload file size limit*). On the Free plan it is 50 MB, which caps video uploads at 50 MB. Raise it there (paid plans) to allow larger videos. Uploads are resumable in 6 MB chunks, so large files survive a flaky connection.

## 7. Environment variables

From Supabase → **Project Settings → API Keys**, copy the **Project URL** and the **publishable key** (`sb_publishable_…`). The legacy *anon* key also works.

| Name | Where | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Vercel + `.env.local` | the publishable key |
| `NEXT_PUBLIC_SITE_URL` | Vercel (Production) | `https://www.your-domain.com` |
| `CONTACT_FORM_ENDPOINT` | optional, server-only | an HTTPS endpoint that also receives contact-form messages |

- **Local:** copy `.env.example` to `.env.local`, fill in the values, then restart `npm run dev`. `.env*` files are git-ignored, except the example.
- **Vercel:** Project → Settings → Environment Variables → add them for *Production* (and *Preview* if previews should use the CMS) → **Redeploy**.

**Order matters.** Import the content (step 3) before deploying with these variables. Pages are built from the database, and once Supabase is configured there is deliberately no silent fallback to the bundled content. A build against an empty database stops with a clear error.

Do **not** add the secret / service-role key to Vercel or to `.env.local`. Nothing uses it.

## 8. Check it

```bash
npm run cms:verify
```

It checks the project as an anonymous visitor would, using `.env.local`:

- the content is imported;
- drafts, hidden sections, administrators and contact messages are not readable;
- visitors cannot write content, grant rights or upload files.

It prints PASS / FAIL per check and never prints keys.

Then open `/admin`, sign in, and try one change, for example a FAQ answer. Saving rebuilds the affected pages: the change is live on the next page load, in both languages.

---

## How it works

| Part | Where |
| --- | --- |
| Tables, RLS policies, admin functions, `cms_snapshot()` | `supabase/migrations/20261004120000_cms_schema.sql` |
| Storage bucket + policies | `supabase/migrations/20261004120100_cms_storage.sql` |
| Current content as SQL | `supabase/seed/content.sql` (generated) |
| What is editable (fields, labels, validation) | `lib/cms/registry.ts`, `lib/cms/fields.ts`, `lib/cms/pages.ts` |
| Website → content | `lib/cms/source.ts` (one `cms_snapshot()` call per render) → `lib/cms/content-map.ts` → `lib/content.ts` |
| Dashboard | `app/admin/`, `components/admin/` |
| Server Actions (every save) | `app/admin/_actions/` → validation in `lib/cms/admin/mutations.ts` |
| Upload (browser → Storage, resumable) | `lib/cms/upload.ts`, `lib/cms/media-rules.ts` |
| Session / rights | `proxy.ts` + `lib/supabase/proxy.ts` (first gate), `lib/cms/admin/session.ts` (every page and action), RLS (final gate) |

**Publishing.** Collection items have *Draft* and *Published* states, and new items start as drafts. Sections can be hidden and reordered. The public site reads only published items and visible sections, through `cms_snapshot()` with the anonymous key. RLS enforces the same rule, so a draft cannot leak even through a direct API call. After each save the dashboard revalidates every page (`revalidatePath("/[lang]", "layout")`) and the sitemap.

**Safety rails.**

- Links accept site paths, `#anchors`, `https://`, `tel:` and `mailto:` only. This is checked in the form, on the server and by a database constraint.
- Content is structured text, never HTML, so nothing an editor types can run as code.
- Identifiers (slugs) are fixed after creation, so links never break.
- A media file in use cannot be deleted; the database refuses as well.
- The last owner cannot be removed.

## Everyday use (for editors)

| Task | Where |
| --- | --- |
| Find any text on the site | **Content explorer**: search both languages, filter by page / type / status, and filter *Missing a translation* |
| Page text, images, order, hide / show a section | **Pages & sections** |
| Services, conditions, videos, reviews, FAQs, articles … | the entries under **Collections** |
| Name, title, phone, WhatsApp, email, address, hours, map, logo, favicon | **Global settings** |
| Menu, social links | **Navigation & social** |
| Search titles and descriptions per page, sharing images | **SEO** |
| Button labels, form messages, accessible names | **Interface text** |
| Contact-form messages | **Inbox** |

Every form edits Arabic and English side by side. Use the switch at the top to show one language only. The form also flags texts that are filled in one language but not the other.

## Backups

Supabase takes daily backups on paid plans (Database → Backups). For an extra copy:

- **Database:** `npx supabase db dump --data-only -f backup.sql` (needs the CLI login from step 2).
- **Media:** Storage → `media` → download.

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Build or page error "holds no website content yet" | Step 3 was skipped. Run `supabase/seed/content.sql`. |
| "This account does not have access to the CMS" | The user exists in Auth but not in `public.admins`. Run step 4, or have an owner add them. |
| Reset email never arrives | Built-in email limit reached, or the Redirect URLs in step 5 are missing. Set up SMTP. |
| Reset link says "invalid or has expired" | It was opened in another browser (use the `token_hash` template from step 5) or is older than the expiry. Request a new one. |
| Upload fails with "larger than the storage limit" | Raise the project upload limit (step 6), or compress the video. |
| Images from Storage do not appear | `NEXT_PUBLIC_SUPABASE_URL` must be set when building (`next.config.ts` allows that host for images). Redeploy after setting it. |
