# Dr. Ahmed Abdelsalam — Website

Bilingual site for Dr. Ahmed Abdelsalam, orthopedic doctor — Arabic (default, RTL) at `/ar/…` and English (LTR) at `/en/…`: Home, About, Services, Videos, Reviews & FAQs, Articles and Contact.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 + CSS Modules · Motion · Lucide.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
npm run lint && npm run typecheck && npm test
npm run build && npm start
```

## Project structure

| Path | What lives there |
| --- | --- |
| `app/[lang]/` | Root layout (`lang`/`dir` from the URL, fonts, metadata, JSON-LD), one folder per page, 404 (`not-found.tsx`, `[...rest]/page.tsx`) |
| `app/[lang]/contact/actions.ts` | Server Action that receives the contact form |
| `app/robots.ts`, `app/sitemap.ts`, icons | Language-independent metadata routes |
| `app/globals.css` | **Design system**: tokens, Tailwind theme, type scale, glass primitives, per-language typography, reduced-motion rules |
| `app/fonts.css`, `config/fonts.ts` | Self-hosted font faces, and the files each language preloads |
| `proxy.ts` | Redirects URLs without a language to the saved/default language; gives unknown pages their 404 status |
| `i18n/` | Locales and URL helpers (`config.ts`), interface strings (`dictionaries/ar.ts`, `dictionaries/en.ts`), date/plural formatting, `getI18n()` for Server Components |
| `components/i18n/` | `LocaleProvider`, `useLocale()` and `useDictionary()` for Client Components |
| `components/hero/` | `Hero` — the full-bleed cover used by every page (`size="full"` or `"compact"`) |
| `components/cta/` | `SiteCTA` — the global call-to-action band that closes every page |
| `components/modal/` | `Modal` — the single dialog implementation used site-wide |
| `components/timeline/` | `JourneyTimeline` — patient journey (home), diagnosis steps (services), career (about) |
| `components/home/` | Homepage-only sections (`IntroSection`, `StatsSection`, `AboutDoctor`, …) |
| `components/about/`, `services/`, `conditions/`, `videos/`, `reviews/`, `faq/`, `articles/`, `contact/` | Page sections, cards, catalogs and dialog content |
| `components/ui/` | Primitives: `GlassButton`, `AppLink`, `SectionHeading`, `Eyebrow`, `Icon`, `Decor`, … |
| `components/motion/` | `Reveal`, `AnimatedCounter`, `InView`, `TiltCard`, `MotionProvider` |
| `components/media/` | `VideoPlayer` (click-to-load), `VideoFrame`, `ArtDirectedImage` |
| `components/layout/` | `SiteHeader` (with the mobile drawer), `LanguageToggle` (AR / EN), `SiteFooter` |
| `components/not-found/` | `NotFoundSection` — the branded 404 content |
| `hooks/` | `useScrollLock`, `useFocusTrap`, `useHashDialog`, `useMediaQuery` |
| `config/` | `site.ts` (contact, socials, and the doctor's name and role per language), `routes.ts` (every URL, navigation, which pages exist) |
| `data/shared/` | Language-neutral fields of each collection: slugs, order, icons, images, ratings, `featured` flags, map pin |
| `data/ar/`, `data/en/` | The text of each collection (`services`, `conditions`, `specialties`, `qualifications`, `career`, `videos`, `reviews`, `faqs`, `articles`, `contact`, `cta`, `home`), keyed by slug/id |
| `data/ar/pages/`, `data/en/pages/` | Copy and SEO for each page (`about.ts`, `services.ts`, `videos.ts`, `reviews.ts`, `articles.ts`, `contact.ts`) |
| `lib/content.ts` | **Content access layer** — the only place pages get data from (always for a given locale) |
| `lib/seo.ts`, `lib/structured-data.ts` | Page metadata builder; JSON-LD (Physician, BreadcrumbList, FAQPage) |
| `lib/contact-form.ts` | Contact form model and validation, shared by browser and server |
| `types/content.ts` | Content model shared by data, CMS and components |
| `app/admin/`, `components/admin/` | CMS dashboard (own root layout), Server Actions in `app/admin/_actions/` |
| `lib/cms/` | CMS: field definitions and registry, snapshot source and mapper, bundled content, import plan, upload, admin session and validation |
| `lib/supabase/` | Supabase clients (cookie session for the dashboard, anonymous for the public site) and the `/admin` proxy guard |
| `supabase/` | Migrations (schema, RLS, storage) and seed SQL (current content, first owner) |
| `scripts/`, `tests/`, `docs/cms/` | CMS scripts, tests, setup guide and content inventory |

## Content and CMS

All content — every page section, collection item, setting, menu item, SEO field and interface text, in both languages — is managed in a dashboard at **`/admin`**, backed by Supabase (Postgres, Auth, Storage). **Setup: [`docs/cms/SETUP.md`](docs/cms/SETUP.md)**. Everything the CMS manages: [`docs/cms/CONTENT-INVENTORY.md`](docs/cms/CONTENT-INVENTORY.md).

- **Two sources, one shape.** Pages never import from `data/`. They read through `lib/content.ts`, which maps a *CMS snapshot* to the shapes in `types/content.ts` (`lib/cms/content-map.ts`). The snapshot comes from Supabase (`cms_snapshot()`, published rows only) once `NEXT_PUBLIC_SUPABASE_URL` and the publishable key are set, and from the content bundled in `data/` and `config/` before that (`lib/cms/bundled.ts`). A test proves both render exactly the pre-CMS website. Once Supabase is configured there is no silent fallback: an empty or unreachable database fails loudly.
- **Dashboard** (`app/admin/`, `components/admin/`): overview with real counts and warnings, pages & sections (edit, reorder, hide), content explorer (search both languages, missing-translation filter), collections with draft/published, media library (resumable uploads, alt text per language, replace everywhere, usage, safe delete), global settings, navigation & social links, per-page SEO with a search preview, interface text, contact-form inbox, administrators.
- **What is editable** is declared once in `lib/cms/registry.ts` (fields, labels, limits) and `lib/cms/pages.ts` (sections per page). The same definitions drive the forms, browser validation, server validation (`lib/cms/admin/mutations.ts`), the content explorer and the missing-translation checks.
- **Security:** only the publishable key is used. Administrators are rows in `public.admins`, checked in the proxy, in every dashboard page and Server Action, and by Row Level Security in the database. Content is structured text, never HTML, and links are restricted to site paths, anchors, https, tel and mailto.
- **Publishing:** saving rebuilds the affected pages (`revalidatePath`), live on the next page load. Drafts and hidden sections never reach visitors.
- **Content model details:**
  - Headings are arrays of `TitlePart` (`{ text, accent?, breakAfter? }`).
  - Service and condition dialogs use structured `details` (intro and sections).
  - Articles use typed blocks (`paragraph`, `heading`, `list`, `callout`).
  - Icons are string keys resolved in `components/ui/Icon.tsx`.
  - Derived values are computed, never stored: article reading time, and the About counters (counts of published content).

| Command | Does |
| --- | --- |
| `npm test` | Unit and database tests (Vitest + in-process Postgres running the real migrations: RLS, import, dashboard saves, golden content) |
| `npm run typecheck` | TypeScript |
| `npm run cms:seed-sql` | Regenerates `supabase/seed/content.sql` from `data/` (a test fails if it is stale) |
| `npm run cms:inventory` | Regenerates `docs/cms/CONTENT-INVENTORY.md` |
| `npm run cms:verify` | Checks a connected Supabase project as an anonymous visitor: content imported, drafts / admins / inbox unreadable, no anonymous writes or uploads |

## Languages

- **URLs:** every page exists as `/ar/…` (Arabic, `dir="rtl"`) and `/en/…` (English, `dir="ltr"`); the root layout sets `lang` and `dir` from the URL on the server, so there is no language detection in the browser and no flash of the wrong language. `proxy.ts` sends URLs without a language (`/`, `/about`, old links) to the language saved in the `NEXT_LOCALE` cookie, or to Arabic.
- **Toggle:** `components/layout/LanguageToggle.tsx` sits in the header bar from 768px and at the top of the mobile drawer below that. The other language is a real link to the same page (same query and `#section`); with JavaScript it switches with a client-side navigation, no reload. It saves the choice in the cookie, and keyboard users get focus back on the toggle.
- **Interface strings** (navigation, buttons, labels, accessible names, form errors) live in `i18n/dictionaries/ar.ts` and `en.ts`. Both implement the `Dictionary` interface in `i18n/dictionary.ts`, so a missing translation fails the type check. Server Components use `await getI18n()`; Client Components use `useLocale()` / `useDictionary()`.
- **Page text** lives in `data/ar/` and `data/en/`; both must provide every slug/id (also type-checked through `lib/content.ts`). The doctor's name, role and site description per language are in `config/site.ts`.
- **Internal links** are written without a language (`routes.services`); `AppLink` and `GlassButton` add the current one.
- **Unknown pages** (`/en/old-page`) render the branded 404 in that language from `app/[lang]/[...rest]/page.tsx`, with a 404 status set by `proxy.ts`.
- **Typography:** Arabic uses IBM Plex Sans Arabic, English uses IBM Plex Sans; each language preloads only its own font files. English line-heights are about 10% tighter (`--lh-scale`), and large English headings get slight negative tracking. Arabic is never letter-spaced.
- **Numbers and dates** use Western digits in both languages (`18 سبتمبر 2026` / `September 18, 2026`).
- **Adding a language:** add it to `locales` in `i18n/config.ts` and to the `matcher` in `proxy.ts`, add a dictionary and a `data/<locale>/` folder, then add its fonts in `config/fonts.ts`.

## Pages

| Page | Sections |
| --- | --- |
| `/` | Hero · intro video · stats + doctor card · services · about · conditions · patient journey · videos · reviews + FAQ · CTA |
| `/about` | Hero · wide intro video · doctor introduction · qualifications & certifications · key specialties · statistics · philosophy · career journey · CTA |
| `/services` | Compact hero · procedures (all services) · conditions · diagnosis steps · CTA |
| `/videos` | Hero · all nine vertical videos with a viewer dialog · CTA |
| `/reviews` | Hero ("Reviews & FAQs") · all reviews · all FAQs with a help card · CTA |
| `/articles` | Hero · featured article · six article cards · CTA |
| `/contact` | Compact hero · contact form + WhatsApp/Call buttons · map and clinic details · CTA (onward links only) |

## Dialogs

`components/modal/Modal.tsx` is the one dialog used for services, conditions, articles and the video viewer. It is portalled to `<body>`, labelled by its heading and `aria-modal`. The page behind becomes `inert`. Focus moves in on open and is trapped, then returns to the card that opened it. Escape, the close button and the backdrop all close it, page scroll is locked while the dialog content scrolls, and phones get a bottom sheet.

The open item lives in the URL hash (`hooks/useHashDialog.ts`):

- `/services#fractures`, `/services#condition-back-pain`, `/articles#article-mri-guide` and `/videos#video-neck-pain` open the matching dialog directly.
- Homepage and About cards link straight into those dialogs.
- The browser Back button closes the dialog.

## Routes

`config/routes.ts` is the single source of truth. Every page is marked `implemented: true`, which adds it to `sitemap.xml` (in both languages) and enables link prefetching. A future page can be wired into the navigation with `implemented: false` until it ships. Each new page must also be listed in `routes`: `proxy.ts` answers any other path with the 404 page.

The header shows every page inline from 1024px; below that, the menu button opens an accessible drawer. The active page is marked with `aria-current="page"` in the header, the drawer and each inner page's breadcrumb.

## Contact form

The form validates in the browser (messages in the page's language, first invalid field focused, Arabic-Indic digits accepted in the phone field) and again in the Server Action `app/[lang]/contact/actions.ts`, which returns error codes that each language words itself. A hidden honeypot field filters simple bots.

With the CMS connected, messages are saved to the dashboard **Inbox** (switchable in Global settings; only administrators can read them, and the database refuses more than 30 messages a minute). Additionally or instead, set `CONTACT_FORM_ENDPOINT` to any HTTPS endpoint that accepts a JSON `POST` (a form service, a Supabase Edge Function, a CRM webhook). It receives `{ name, phone, email, subject, message, source, submittedAt }`. With neither, the form says that sending is not enabled yet and offers to send the same message through WhatsApp, so no enquiry is lost.

## Map

`data/shared/contact.ts` holds the clinic pin (`map.lat`, `map.lng`, `map.zoom`); the address, hours and map label are in `data/{ar,en}/contact.ts`. The pin is rendered as an OpenStreetMap embed (no API key, no cookies). While `map.isPlaceholder` is `true`, a caption under the map says the location is provisional and the directions button stays hidden. Set the real coordinates and `isPlaceholder: false` to show a Google Maps directions link.

## SEO

Each page exports `generateMetadata` built by `lib/seo.ts`, in the page's language: title (`page | site name`), description, a self-referencing canonical, reciprocal `hreflang` alternates (`ar`, `en`, and `x-default` → Arabic), Open Graph (`og:locale` plus the other language as `og:locale:alternate`, and a share image per language) and Twitter card. Inner pages add `BreadcrumbList` JSON-LD that matches the breadcrumb shown in the hero; `/reviews` carries the `FAQPage` JSON-LD; the root layout adds `Physician` — all in the page's language. `sitemap.xml` lists every page in both languages with its alternates. The 404 page is `noindex`. Set `NEXT_PUBLIC_SITE_URL` so canonical, Open Graph and sitemap URLs are absolute and correct.

## Design system

- **Colours:** navy `#1B275B` (`--primary`) and lavender `#A8B6F3` (`--secondary`) plus derived tones, all in `:root` in `app/globals.css`. Tailwind's default palette is reset, so only brand colours exist as utilities (`bg-primary`, `text-muted`, …). `--danger` and `--success` exist only for form feedback.
- **Liquid glass:** `.glass`, `.glass-navy`, `.glass-sheen`, `.icon-chip` and friends. `backdrop-filter` is used only where glass sits over imagery (header, hero, video chrome, dialog backdrop); elsewhere glass is layered gradients, which cost nothing to scroll.
- **Typography:** IBM Plex Sans Arabic (Arabic) and IBM Plex Sans (English), self-hosted in `public/fonts` (`app/fonts.css`). Scale utilities are `type-display`, `type-h2`, `type-h3`, `type-lead`, `type-body`, `type-caption`, `type-micro`; their line-heights scale with `--lh-scale` per language. Never add letter-spacing to Arabic.
- **Layout:** `site-container` (max 1320px, fluid gutter) and `page-section` (vertical rhythm, clips decoration horizontally).
- **Direction:** logical properties throughout. Physical transforms multiply by `--dir` (−1 in RTL), so the English (LTR) pages use the same CSS: arrows, timelines, drawers and card layouts mirror automatically. A positioned element with its own `dir="ltr"` resolves its logical offsets left-to-right, so put `dir` on an inner span instead. Language-specific tweaks are scoped with `:root[lang="en"]` (e.g. the header fits wider English labels).
- **Motion:** Motion (`motion/react`, `LazyMotion` + `domAnimation`) for scroll reveals, counters, the CTA tilt and dialog transitions. Pure CSS handles hover states, timelines and the hero entrance/parallax. `prefers-reduced-motion` removes movement, blur and scaling site-wide.

## Replacing media

| Asset | Path | Recommended source |
| --- | --- | --- |
| Homepage cover (desktop / mobile crop) | `public/images/hero/hero-cover.jpg`, `hero-cover-mobile.jpg` (Arabic); `hero-cover-en.jpg`, `hero-cover-en-mobile.jpg` (English) | 3200×1800 and 1200×1667; full-bleed. Keep the subject away from the text: on the left for Arabic (text on the right), on the right for English |
| Page covers | `public/images/hero/<page>-cover.jpg`, `<page>-cover-mobile.jpg` (`about`, `services`, `videos`, `reviews`, `articles`, `contact`; plus `contact-en-cover*.jpg` for English) | Same sizes and composition as the homepage cover; focal points are set in `data/{ar,en}/pages/<page>.ts` |
| Service images | `public/images/services/<slug>.jpg` | 1200×900 (4:3), one per service in `data/shared/services.ts` (alt text in `data/{ar,en}/services.ts`) |
| Condition images | `public/images/conditions/<slug>.jpg` | 1200×900 (4:3), one per condition in `data/shared/conditions.ts`; keep the subject centred |
| Specialty images | `public/images/specialties/<slug>.jpg` | 1200×900 (4:3), one per entry in `data/shared/specialties.ts` |
| Certificate images | `public/images/certificates/certificate-0N.jpg` | 1200×900 (4:3) scans or photos of the real certificates |
| Article covers | `public/images/articles/<slug>.jpg` | 1600×1000 (16:10), one per article in `data/shared/articles.ts` |
| Doctor portraits | `public/images/doctor/doctor-portrait-01.jpg`, `-02.jpg` | 1200×1500 (4:5) |
| Doctor cut-out (CTA band) | `public/images/doctor/doctor-cutout.png` | Transparent PNG/WebP, ~1000×1250 |
| Intro video poster | `public/images/videos/intro-poster.jpg` | 1920×1080 |
| Vertical video posters | `public/images/videos/video-01…09.jpg` | 720×1280 (9:16) |
| Video files | `public/videos/` or a CDN | MP4 (H.264) plus optional WebM; or set `youtubeId`. The placeholder clips exist per language (`placeholder-*.webm`, `placeholder-*-en.webm`) |
| Social share image | `public/images/og/og-default.jpg` (Arabic), `og-default-en.jpg` (English) | 1200×630; it contains text, so one per language |

Update the matching `src`, `width` and `height` in `data/shared/` (and the `alt` text in `data/ar/` and `data/en/`) when swapping files. Images go through `next/image`, served as AVIF/WebP.

**Use a new file name when replacing an image.** The image optimiser caches by URL for hours, so overwriting a file under the same name keeps showing the old picture (or delete `.next/cache/images` and `.next/dev/cache/images`).

### Placeholder photo credits

The cover, service, condition, specialty and article photos are free stock placeholders under the [Unsplash License](https://unsplash.com/license) (no attribution required; credited here for traceability). None of them shows the doctor. The certificate images, doctor portraits, video posters and social image are generated placeholder art.

| Used for | Photographer | Source |
| --- | --- | --- |
| Homepage cover (cropped; mirrored for Arabic) | Tom Claes | [unsplash.com/photos/CfdzNybONzc](https://unsplash.com/photos/CfdzNybONzc) |
| Knee & joint pain | Yury Kirillov | [unsplash.com/photos/pbUWW-CBoqY](https://unsplash.com/photos/pbUWW-CBoqY) |
| Back & neck pain | Julius Toltesi | [unsplash.com/photos/5thrMBqG5E0](https://unsplash.com/photos/5thrMBqG5E0) |
| Sports injuries | Eagle Media Pro | [unsplash.com/photos/246P33S3aFk](https://unsplash.com/photos/246P33S3aFk) |
| Fractures | Tom Claes | [unsplash.com/photos/D08zbHvIOM8](https://unsplash.com/photos/D08zbHvIOM8) |
| Shoulder pain | Sincerely Media | [unsplash.com/photos/wGFibXDQlBI](https://unsplash.com/photos/wGFibXDQlBI) |
| Osteoarthritis | Towfiqu Barbhuiya | [unsplash.com/photos/dNe6TyX_laM](https://unsplash.com/photos/dNe6TyX_laM) |
| Hand & wrist | Cara Shelton | [unsplash.com/photos/_GpJpHnyCSw](https://unsplash.com/photos/_GpJpHnyCSw) |
| Foot & ankle | Tom Claes | [unsplash.com/photos/gkgLYinrRtM](https://unsplash.com/photos/gkgLYinrRtM) |
| Condition: joint pain | Imani Bahati | [unsplash.com/photos/L1kLSwdclYQ](https://unsplash.com/photos/L1kLSwdclYQ) |
| Condition: back pain | Sasun Bughdaryan | [unsplash.com/photos/bNdiJ1FEbV4](https://unsplash.com/photos/bNdiJ1FEbV4) |
| Condition: sports injuries | CHUTTERSNAP | [unsplash.com/photos/XuZCMNC0NQ4](https://unsplash.com/photos/XuZCMNC0NQ4) |
| Condition: stiffness & osteoarthritis | Europeana (anatomical drawing) | [unsplash.com/photos/OcDGCRNfgPc](https://unsplash.com/photos/OcDGCRNfgPc) |
| About cover | @vitaly-gariev | [unsplash.com/photos/8WYkI3cEZm8](https://unsplash.com/photos/8WYkI3cEZm8) |
| Services cover | @rodrigo-porto | [unsplash.com/photos/vfy71fExF7g](https://unsplash.com/photos/vfy71fExF7g) |
| Videos cover | @jakub-zerdzicki | [unsplash.com/photos/wE1wOCWUXHE](https://unsplash.com/photos/wE1wOCWUXHE) |
| Reviews cover | @nappy | [unsplash.com/photos/J5UTvRgse7Q](https://unsplash.com/photos/J5UTvRgse7Q) |
| Articles cover | @bermix-studio | [unsplash.com/photos/00heEp9LFP0](https://unsplash.com/photos/00heEp9LFP0) |
| Contact cover (mirrored for Arabic) | @nightingale-home-nurse | [unsplash.com/photos/4e017fuMeXE](https://unsplash.com/photos/4e017fuMeXE) |
| Specialty: knee & joints | @europeana | [unsplash.com/photos/aefTY7PEPkY](https://unsplash.com/photos/aefTY7PEPkY) |
| Specialty: spine | @rohit-choudhari | [unsplash.com/photos/syaEIuKA-DA](https://unsplash.com/photos/syaEIuKA-DA) |
| Specialty: sports injuries & rehab | @sincerely-media | [unsplash.com/photos/mvHuY-t4QII](https://unsplash.com/photos/mvHuY-t4QII) |
| Specialty: fractures & trauma | @harlie-raethel | [unsplash.com/photos/ouyjDk-KdfY](https://unsplash.com/photos/ouyjDk-KdfY) |
| Condition: herniated disc | @sasun-bughdaryan | [unsplash.com/photos/X4gd4Lg8OwY](https://unsplash.com/photos/X4gd4Lg8OwY) |
| Condition: frozen shoulder | @julius-toltesi | [unsplash.com/photos/ZzkNkbUxFMc](https://unsplash.com/photos/ZzkNkbUxFMc) |
| Condition: carpal tunnel | @sasun-bughdaryan | [unsplash.com/photos/S52_QspnHYI](https://unsplash.com/photos/S52_QspnHYI) |
| Condition: osteoporosis | @rohit-choudhari | [unsplash.com/photos/RQuiTjveVIg](https://unsplash.com/photos/RQuiTjveVIg) |
| Article: knee osteoarthritis | @anna-auza | [unsplash.com/photos/dzhlKUgyI3M](https://unsplash.com/photos/dzhlKUgyI3M) |
| Article: lower back pain | @diana-light | [unsplash.com/photos/L98od1dnObo](https://unsplash.com/photos/L98od1dnObo) |
| Article: sports first aid | @omar-ramadan | [unsplash.com/photos/A9XmmNGthbc](https://unsplash.com/photos/A9XmmNGthbc) |
| Article: bone health | @roger-vaughan | [unsplash.com/photos/2Rs7suBBjkY](https://unsplash.com/photos/2Rs7suBBjkY) |
| Article: sitting posture | @effydesk | [unsplash.com/photos/zyMtujfaZ_I](https://unsplash.com/photos/zyMtujfaZ_I) |
| Article: physiotherapy | @annie-spratt | [unsplash.com/photos/Nt5eeIKH-1s](https://unsplash.com/photos/Nt5eeIKH-1s) |
| Article: MRI guide | @accuray | [unsplash.com/photos/MhM8LiIzmZw](https://unsplash.com/photos/MhM8LiIzmZw) |

## Placeholder content to replace before launch

Once the CMS is connected, all of the items below are edited in the dashboard (the files named here are only the initial content). The dashboard overview lists what still needs attention.

All placeholders are marked `PLACEHOLDER` in code comments, in both languages. Nothing on the site states a real degree, institution, year, certificate, membership, award, patient count, success rate or address of the doctor. Every item below has an Arabic and an English file — update both.

- **Contact:** phone and WhatsApp number (`.env.local`); social profile URLs (`config/site.ts`, then set `socialsArePlaceholder: false`); clinic address and opening hours (`data/{ar,en}/contact.ts`) and map pin (`data/shared/contact.ts`, then set the `isPlaceholder` flags to `false`); `CONTACT_FORM_ENDPOINT`.
- **About:** qualifications and certificates (`data/{ar,en}/qualifications.ts`, years in `data/shared/qualifications.ts`, plus the certificate artwork; remove the page note in `data/{ar,en}/pages/about.ts` afterwards), career years and places (`data/{ar,en}/career.ts`, shown as "20XX"), key specialties (`data/{ar,en}/specialties.ts`).
- **Doctor's words:** the philosophy quote in `data/{ar,en}/pages/about.ts` is written in the doctor's voice and must be approved or rewritten by him. The introduction paragraphs are draft copy.
- **Doctor's title:** "Orthopedic Doctor" mirrors «طبيب العظام» (`config/site.ts`); change both if he prefers another title.
- **Copy:** every text in `data/{ar,en}/home.ts` and `data/{ar,en}/pages/*` is draft copy written to avoid factual claims.
- **Statistics:** the homepage figures are deliberately non-claims; the About counters are counts of the site's own content. Swap in verified figures (years, patients, …) once the doctor provides them.
- **Services and conditions:** general orthopedic areas, and dialog text written as general patient education with treatment options phrased as possibilities. Have the doctor confirm the list, especially which procedures he offers.
- **Articles:** seven draft patient-education articles with placeholder dates. Each needs the doctor's medical review and approval before publishing.
- **Reviews:** entirely fictional placeholders ("اسم المراجع ١" / "Reviewer name 1" …). Replace with genuine, consented reviews or remove them; publish a review in the other language only with the reviewer's consent to the translation.
- **FAQs:** generic answers pending the clinic's real policies.
- **Media:** stock and generated placeholders (credits above). The video files are 6-second placeholder clips labelled as such (one set per language).
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` so canonical, Open Graph and sitemap URLs are correct.
