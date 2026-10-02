# Dr. Ahmed Abdelsalam — Website

Arabic-first (RTL) site for Dr. Ahmed Abdelsalam, orthopedic doctor: Home, About, Services, Videos, Reviews & FAQs, Articles and Contact.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 + CSS Modules · Motion · Lucide.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
npm run lint
npm run build && npm start
```

## Project structure

| Path | What lives there |
| --- | --- |
| `app/` | Root layout (RTL, font, metadata, JSON-LD), one folder per page, 404, `robots.ts`, `sitemap.ts`, icons |
| `app/contact/actions.ts` | Server Action that receives the contact form |
| `app/globals.css` | **Design system**: tokens, Tailwind theme, type scale, glass primitives, reduced-motion rules |
| `components/hero/` | `Hero` — the full-bleed cover used by every page (`size="full"` or `"compact"`) |
| `components/cta/` | `SiteCTA` — the global call-to-action band that closes every page |
| `components/modal/` | `Modal` — the single dialog implementation used site-wide |
| `components/timeline/` | `JourneyTimeline` — patient journey (home), diagnosis steps (services), career (about) |
| `components/home/` | Homepage-only sections (`IntroSection`, `StatsSection`, `AboutDoctor`, …) |
| `components/about/`, `services/`, `conditions/`, `videos/`, `reviews/`, `faq/`, `articles/`, `contact/` | Page sections, cards, catalogs and dialog content |
| `components/ui/` | Primitives: `GlassButton`, `AppLink`, `SectionHeading`, `Eyebrow`, `Icon`, `Decor`, … |
| `components/motion/` | `Reveal`, `AnimatedCounter`, `InView`, `TiltCard`, `MotionProvider` |
| `components/media/` | `VideoPlayer` (click-to-load), `VideoFrame`, `ArtDirectedImage` |
| `components/layout/` | `SiteHeader` (with the mobile drawer), `SiteFooter` |
| `hooks/` | `useScrollLock`, `useFocusTrap`, `useHashDialog`, `useMediaQuery` |
| `config/` | `site.ts` (name, contact, socials), `routes.ts` (every URL, navigation, which pages exist) |
| `data/` | Collections (`services`, `conditions`, `specialties`, `qualifications`, `career`, `videos`, `reviews`, `faqs`, `articles`, `contact`, `cta`) |
| `data/pages/` | Copy and SEO for each page (`about.ts`, `services.ts`, `videos.ts`, `reviews.ts`, `articles.ts`, `contact.ts`) |
| `lib/content.ts` | **Content access layer** — the only place pages get data from |
| `lib/seo.ts`, `lib/structured-data.ts` | Page metadata builder; JSON-LD (Physician, BreadcrumbList, FAQPage) |
| `lib/contact-form.ts` | Contact form model and validation, shared by browser and server |
| `types/content.ts` | Content model shared by data, CMS and components |

## Content and CMS

Pages never import from `data/` directly. Each page loads everything through the async getters in `lib/content.ts` (`getAboutPage`, `getServices`, `getArticles`, `getSiteCta`, …) and passes plain props down. To move to Supabase or a headless CMS, re-implement those functions against the same `types/content.ts` shapes; no component changes are needed.

- Every collection item has a stable `slug`/`id` and an `order`, which map directly to table columns.
- Long text is structured, not HTML: service and condition dialogs use `details.sections` (paragraphs and/or bullet items), and articles use typed `body` blocks (`paragraph`, `heading`, `list`, `callout`). Both fit a JSON column.
- Icons are stored as string keys (`IconName`) and resolved in `components/ui/Icon.tsx`.
- Headings are arrays of `TitlePart` (`{ text, accent?, breakAfter? }`), so editors choose the accent words without writing markup.
- `featured` flags pick the homepage subset from each full collection. `/videos` and the homepage read the same nine-video dataset.
- Derived values are computed, never stored: article reading time comes from the word count, and the About page counters are the sizes of the site's own collections (services, conditions, videos, articles).
- Page copy lives in `data/pages/*` (one object per page, including its SEO title and description), ready to become one CMS entry per page and per locale.

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

`config/routes.ts` is the single source of truth. Every page is marked `implemented: true`, which adds it to `sitemap.xml` and enables link prefetching. A future page can be wired into the navigation with `implemented: false` until it ships.

The header shows every page inline from 1024px; below that, the menu button opens an accessible drawer. The active page is marked with `aria-current="page"` in the header, the drawer and each inner page's breadcrumb.

## Contact form

The form validates in the browser (Arabic messages, first invalid field focused, Arabic-Indic digits accepted in the phone field) and again in the Server Action `app/contact/actions.ts`. A hidden honeypot field filters simple bots.

Set `CONTACT_FORM_ENDPOINT` to any HTTPS endpoint that accepts a JSON `POST` (a form service, a Supabase Edge Function, a CRM webhook). It receives `{ name, phone, email, subject, message, source, submittedAt }`. Until it is set, the form says that sending is not enabled yet and offers to send the same message through WhatsApp, so no enquiry is lost.

## Map

`data/contact.ts` holds the clinic pin (`map.lat`, `map.lng`, `map.zoom`), rendered as an OpenStreetMap embed (no API key, no cookies). While `map.isPlaceholder` is `true`, a caption under the map says the location is provisional and the directions button stays hidden. Set the real coordinates and `isPlaceholder: false` to show a Google Maps directions link.

## SEO

Each page exports `generateMetadata` built by `lib/seo.ts`: title (`page | site name`), description, canonical URL, Open Graph and Twitter card. Inner pages add `BreadcrumbList` JSON-LD that matches the breadcrumb shown in the hero; `/reviews` carries the `FAQPage` JSON-LD; the root layout adds `Physician`. Set `NEXT_PUBLIC_SITE_URL` so canonical, Open Graph and sitemap URLs are absolute and correct.

For an English version, add a locale segment, give each `data/pages/*` object a translation, and pass `alternates.languages` through `pageMetadata`. Layout already uses logical properties and the `--dir` variable, so the CSS needs no rewrite.

## Design system

- **Colours:** navy `#1B275B` (`--primary`) and lavender `#A8B6F3` (`--secondary`) plus derived tones, all in `:root` in `app/globals.css`. Tailwind's default palette is reset, so only brand colours exist as utilities (`bg-primary`, `text-muted`, …). `--danger` and `--success` exist only for form feedback.
- **Liquid glass:** `.glass`, `.glass-navy`, `.glass-sheen`, `.icon-chip` and friends. `backdrop-filter` is used only where glass sits over imagery (header, hero, video chrome, dialog backdrop); elsewhere glass is layered gradients, which cost nothing to scroll.
- **Typography:** IBM Plex Sans Arabic via `next/font`. Scale utilities are `type-display`, `type-h2`, `type-h3`, `type-lead`, `type-body`, `type-caption`, `type-micro`. Never add letter-spacing to Arabic.
- **Layout:** `site-container` (max 1320px, fluid gutter) and `page-section` (vertical rhythm, clips decoration horizontally).
- **Direction:** logical properties throughout. Physical transforms multiply by `--dir` (−1 in RTL), so an LTR/English version needs no CSS rewrite. A positioned element with its own `dir="ltr"` resolves its logical offsets left-to-right, so put `dir` on an inner span instead.
- **Motion:** Motion (`motion/react`, `LazyMotion` + `domAnimation`) for scroll reveals, counters, the CTA tilt and dialog transitions. Pure CSS handles hover states, timelines and the hero entrance/parallax. `prefers-reduced-motion` removes movement, blur and scaling site-wide.

## Replacing media

| Asset | Path | Recommended source |
| --- | --- | --- |
| Homepage cover (desktop / mobile crop) | `public/images/hero/hero-cover.jpg`, `hero-cover-mobile.jpg` | 3200×1800 and 1200×1667; full-bleed, keep the subject on the left so the right-hand (RTL) text side stays calm |
| Page covers | `public/images/hero/<page>-cover.jpg`, `<page>-cover-mobile.jpg` (`about`, `services`, `videos`, `reviews`, `articles`, `contact`) | Same sizes and composition as the homepage cover; focal points are set in `data/pages/<page>.ts` |
| Service images | `public/images/services/<slug>.jpg` | 1200×900 (4:3), one per service in `data/services.ts` |
| Condition images | `public/images/conditions/<slug>.jpg` | 1200×900 (4:3), one per condition in `data/conditions.ts`; keep the subject centred |
| Specialty images | `public/images/specialties/<slug>.jpg` | 1200×900 (4:3), one per entry in `data/specialties.ts` |
| Certificate images | `public/images/certificates/certificate-0N.jpg` | 1200×900 (4:3) scans or photos of the real certificates |
| Article covers | `public/images/articles/<slug>.jpg` | 1600×1000 (16:10), one per article in `data/articles.ts` |
| Doctor portraits | `public/images/doctor/doctor-portrait-01.jpg`, `-02.jpg` | 1200×1500 (4:5) |
| Doctor cut-out (CTA band) | `public/images/doctor/doctor-cutout.png` | Transparent PNG/WebP, ~1000×1250 |
| Intro video poster | `public/images/videos/intro-poster.jpg` | 1920×1080 |
| Vertical video posters | `public/images/videos/video-01…09.jpg` | 720×1280 (9:16) |
| Video files | `public/videos/` or a CDN | MP4 (H.264) plus optional WebM; or set `youtubeId` |
| Social share image | `public/images/og/og-default.jpg` | 1200×630 |

Update the matching `src`, `width`, `height` and `alt` in `data/` when swapping files. Images go through `next/image`, served as AVIF/WebP.

**Use a new file name when replacing an image.** The image optimiser caches by URL for hours, so overwriting a file under the same name keeps showing the old picture (or delete `.next/cache/images` and `.next/dev/cache/images`).

### Placeholder photo credits

The cover, service, condition, specialty and article photos are free stock placeholders under the [Unsplash License](https://unsplash.com/license) (no attribution required; credited here for traceability). None of them shows the doctor. The certificate images, doctor portraits, video posters and social image are generated placeholder art.

| Used for | Photographer | Source |
| --- | --- | --- |
| Homepage cover (mirrored, cropped) | Tom Claes | [unsplash.com/photos/CfdzNybONzc](https://unsplash.com/photos/CfdzNybONzc) |
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
| Contact cover (mirrored) | @nightingale-home-nurse | [unsplash.com/photos/4e017fuMeXE](https://unsplash.com/photos/4e017fuMeXE) |
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

All placeholders are marked `PLACEHOLDER` in code comments. Nothing on the site states a real degree, institution, year, certificate, membership, award, patient count, success rate or address of the doctor.

- **Contact:** phone and WhatsApp number (`.env.local`); social profile URLs (`config/site.ts`, then set `socialsArePlaceholder: false`); clinic address, opening hours and map pin (`data/contact.ts`, then set the `isPlaceholder` flags to `false`); `CONTACT_FORM_ENDPOINT`.
- **About:** qualifications and certificates (`data/qualifications.ts` plus the certificate artwork; remove the page note in `data/pages/about.ts` afterwards), career years and places (`data/career.ts`, shown as "20XX"), key specialties (`data/specialties.ts`).
- **Doctor's words:** the philosophy quote in `data/pages/about.ts` is written in the doctor's voice and must be approved or rewritten by him. The introduction paragraphs are draft copy.
- **Copy:** every text in `data/home.ts` and `data/pages/*` is draft copy written to avoid factual claims.
- **Statistics:** the homepage figures are deliberately non-claims; the About counters are counts of the site's own content. Swap in verified figures (years, patients, …) once the doctor provides them.
- **Services and conditions:** general orthopedic areas, and dialog text written as general patient education with treatment options phrased as possibilities. Have the doctor confirm the list, especially which procedures he offers.
- **Articles:** seven draft patient-education articles with placeholder dates. Each needs the doctor's medical review and approval before publishing.
- **Reviews:** entirely fictional placeholders ("اسم المراجع ١" …). Replace with genuine, consented reviews or remove them.
- **FAQs:** generic answers pending the clinic's real policies.
- **Media:** stock and generated placeholders (credits above). Both video files are 6-second placeholder clips labelled as such.
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` so canonical, Open Graph and sitemap URLs are correct.
