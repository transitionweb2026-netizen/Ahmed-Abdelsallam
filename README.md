# Dr. Ahmed Abdelsalam — Website

Arabic-first (RTL) site for Dr. Ahmed Abdelsalam, orthopedic doctor. Phase 1 ships the **homepage only**; the other routes are planned and wired but not built.

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
| `app/` | Root layout (RTL, font, metadata, JSON-LD), homepage, 404, `robots.ts`, `sitemap.ts`, icons |
| `app/globals.css` | **Design system**: tokens, Tailwind theme, type scale, glass primitives, reduced-motion rules |
| `components/home/` | One component per homepage section (`Hero`, `IntroSection`, `StatsSection`, …) |
| `components/{services,conditions,videos,reviews,faq,doctor}/` | Cards and widgets meant to be reused on the future pages |
| `components/ui/` | Primitives: `GlassButton`, `AppLink`, `SectionHeading`, `Eyebrow`, `Icon`, `Decor`, … |
| `components/motion/` | `Reveal`, `AnimatedCounter`, `InView`, `TiltCard`, `MotionProvider` |
| `components/media/` | `VideoPlayer` (click-to-load), `ArtDirectedImage` |
| `components/layout/` | `SiteHeader`, `SiteFooter` |
| `config/` | `site.ts` (name, contact, socials), `routes.ts` (every URL + which pages exist) |
| `data/` | Static content: `home.ts`, `services.ts`, `conditions.ts`, `videos.ts`, `reviews.ts`, `faqs.ts` |
| `lib/content.ts` | **Content access layer** — the only place components get data from |
| `types/content.ts` | Content model shared by data, CMS and components |

## Content and CMS

Sections never import from `data/` directly. `app/page.tsx` loads everything through the async getters in `lib/content.ts` (`getHomeContent`, `getServices`, `getVideos`, …) and passes plain props down. To move to Supabase or a headless CMS, re-implement those functions against the same `types/content.ts` shapes; no component changes are needed.

- Icons are stored as string keys (`IconName`) and resolved in `components/ui/Icon.tsx`, so a CMS can store them.
- Headings are arrays of `TitlePart` (`{ text, accent?, breakAfter? }`), so editors choose the accent words without writing markup.
- `featured` flags pick the homepage subset from each full collection. The homepage shows 3 of the 9 videos in `data/videos.ts`, and the future `/videos` page reads the same dataset.

## Routes

`config/routes.ts` is the single source of truth. Planned pages (`/about`, `/services`, `/videos`, `/reviews`, `/articles`, `/contact`) are linked already and currently show the branded 404.

When a page ships, set `implemented: true` for it in `mainNav`. That:

- adds it to `sitemap.xml`;
- turns on link prefetching. `AppLink` disables prefetch for unbuilt routes so visitors don't get 404 prefetch errors.

`mainNav` also drives the navigation (labels included, e.g. "الآراء والأسئلة الشائعة" for Reviews & FAQs). From 1024px the header shows every page inline; below that, the menu button opens an accessible drawer (focus trap, Escape and backdrop close, scroll lock).

## Design system

- **Colours:** navy `#1B275B` (`--primary`) and lavender `#A8B6F3` (`--secondary`) plus derived tones, all in `:root` in `app/globals.css`. Tailwind's default palette is reset, so only brand colours exist as utilities (`bg-primary`, `text-muted`, …).
- **Liquid glass:** `.glass`, `.glass-navy`, `.glass-sheen`, `.icon-chip` and friends. `backdrop-filter` is used only where glass sits over imagery (header, hero panel, video controls); elsewhere glass is layered gradients, which cost nothing to scroll.
- **Typography:** IBM Plex Sans Arabic via `next/font`. Scale utilities are `type-display`, `type-h2`, `type-h3`, `type-lead`, `type-body`, `type-caption`, `type-micro`. Never add letter-spacing to Arabic.
- **Layout:** `site-container` (max 1320px, fluid gutter) and `page-section` (vertical rhythm, clips decoration horizontally).
- **Direction:** logical properties throughout. Physical transforms multiply by `--dir` (−1 in RTL), so an LTR/English version needs no CSS rewrite.
- **Motion:** Motion (`motion/react`, `LazyMotion` + `domAnimation`) for scroll reveals, counters and the CTA tilt. Pure CSS handles hover states, the journey timeline and the hero entrance/parallax. `prefers-reduced-motion` removes movement, blur and scaling site-wide.

## Replacing media

| Asset | Path | Recommended source |
| --- | --- | --- |
| Hero cover (desktop / mobile crop) | `public/images/hero/hero-cover.jpg`, `hero-cover-mobile.jpg` | 3200×1800 and 1200×1667; full-bleed, keep the subject on the left so the right-hand (RTL) text side stays calm |
| Service images | `public/images/services/<slug>.jpg` | 1200×900 (4:3), one per service in `data/services.ts` |
| Condition images | `public/images/conditions/<slug>.jpg` | 1200×900 (4:3), one per condition in `data/conditions.ts`; keep the subject centred (the card crops to 16:10 on phones and taller on wide screens) |
| Doctor portraits | `public/images/doctor/doctor-portrait-01.jpg`, `-02.jpg` | 1200×1500 (4:5) |
| Doctor cut-out (final CTA) | `public/images/doctor/doctor-cutout.png` | Transparent PNG/WebP, ~1000×1250 |
| Intro video poster | `public/images/videos/intro-poster.jpg` | 1920×1080 |
| Vertical video posters | `public/images/videos/video-01…09.jpg` | 720×1280 (9:16) |
| Video files | `public/videos/` or a CDN | MP4 (H.264) plus optional WebM; or set `youtubeId` |
| Social share image | `public/images/og/og-default.jpg` | 1200×630 |

Update the matching `src`, `width`, `height` and `alt` in `data/` when swapping files. Images go through `next/image`, served as AVIF/WebP.

**Use a new file name when replacing an image.** The image optimiser caches by URL for hours, so overwriting a file under the same name keeps showing the old picture (or delete `.next/cache/images` and `.next/dev/cache/images`).

### Placeholder photo credits

The hero, service and condition photos are free stock placeholders under the [Unsplash License](https://unsplash.com/license) (no attribution required; credited here for traceability). None of them shows the doctor.

| Used for | Photographer | Source |
| --- | --- | --- |
| Hero cover (mirrored, cropped) | Tom Claes | [unsplash.com/photos/CfdzNybONzc](https://unsplash.com/photos/CfdzNybONzc) |
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

## Placeholder content to replace before launch

All placeholders are marked `PLACEHOLDER` in code comments.

- **Contact:** phone and WhatsApp number (`.env.local`); social profile URLs (`config/site.ts`, then set `socialsArePlaceholder: false`).
- **Copy:** every text in `data/home.ts` is draft copy written to avoid factual claims.
- **Statistics:** chosen deliberately to avoid invented credentials. Swap in verified figures (years, patients, …) once the doctor provides them.
- **Services and conditions:** general orthopedic areas pending the doctor's confirmed list.
- **Reviews:** entirely fictional placeholders ("اسم المراجع ١" …). Replace with genuine, consented reviews or remove them.
- **FAQs:** generic answers pending the clinic's real policies.
- **Media:** the hero, service and condition photos are stock placeholders (credits above); the doctor portraits, video posters and social image are generated placeholder art. Both video files are 6-second placeholder clips labelled as such.
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` so canonical, Open Graph and sitemap URLs are correct.
