# Content inventory

Everything on the public website that the CMS manages, in Arabic and English. Generated from `lib/cms/pages.ts` and `lib/cms/registry.ts` by `npm run cms:inventory` — do not edit by hand.

Fixed in code (not editable, by design): the page layouts and section components, the URL structure (`/ar/…`, `/en/…`), the design system (colours, typography, glass effects, animations), structured-data shapes, and the security rules.

## Pages and sections

### Home — `/`

| # | Section | Type | Anchor | Images | Video | Order / visibility |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero | Hero | — | Cover image (desktop) (+ English variant); Cover image (phones) (+ English variant) | — | always first, always visible |
| 2 | Introduction video | Introduction video | `#intro` | — | yes | movable, can be hidden |
| 3 | Statistics | Statistics | `#stats` | Doctor photo | — | movable, can be hidden |
| 4 | Featured services | Heading and link | `#services` | — | — | movable, can be hidden |
| 5 | About the doctor | About the doctor | `#about` | Photo | — | movable, can be hidden |
| 6 | Conditions and symptoms | Heading and link | `#conditions` | — | — | movable, can be hidden |
| 7 | Patient journey | Timeline | `#journey` | — | — | movable, can be hidden |
| 8 | Featured videos | Heading and link | `#videos` | — | — | movable, can be hidden |
| 9 | Reviews and FAQs | Reviews and FAQs | `#reviews-faq` | — | — | movable, can be hidden |
| 10 | Closing call-to-action | Closing call-to-action | `#site-cta` | — | — | movable, can be hidden |

SEO: SEO title, Meta description, Sharing image (Arabic), Sharing image (English), Allow search engines to index this page (per language).

### About — `/about`

| # | Section | Type | Anchor | Images | Video | Order / visibility |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero | Hero | — | Cover image (desktop) (+ English variant); Cover image (phones) (+ English variant) | — | always first, always visible |
| 2 | Introduction video | Introduction video | `#about-video` | — | yes | movable, can be hidden |
| 3 | Doctor introduction | Doctor introduction | `#doctor` | Photo | — | movable, can be hidden |
| 4 | Qualifications and certificates | Qualifications | `#qualifications` | — | — | movable, can be hidden |
| 5 | Key specialties | Heading and link | `#specialties` | — | — | movable, can be hidden |
| 6 | Statistics | Statistics | `#about-stats` | — | — | movable, can be hidden |
| 7 | Treatment philosophy | Philosophy | `#philosophy` | Photo | — | movable, can be hidden |
| 8 | Career milestones | Timeline | `#career` | — | — | movable, can be hidden |
| 9 | Closing call-to-action | Closing call-to-action | `#site-cta` | — | — | movable, can be hidden |

SEO: SEO title, Meta description, Sharing image (Arabic), Sharing image (English), Allow search engines to index this page (per language).

### Services — `/services`

| # | Section | Type | Anchor | Images | Video | Order / visibility |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero | Hero | — | Cover image (desktop) (+ English variant); Cover image (phones) (+ English variant) | — | always first, always visible |
| 2 | Services and procedures | Section heading | `#procedures` | — | — | movable, can be hidden |
| 3 | Conditions | Section heading | `#conditions` | — | — | movable, can be hidden |
| 4 | Diagnosis steps | Timeline | `#diagnosis` | — | — | movable, can be hidden |
| 5 | Detail dialog text | Detail dialog text | — | — | — | copy only (dialog / shared) |
| 6 | Closing call-to-action | Closing call-to-action | `#site-cta` | — | — | movable, can be hidden |

SEO: SEO title, Meta description, Sharing image (Arabic), Sharing image (English), Allow search engines to index this page (per language).

### Videos — `/videos`

| # | Section | Type | Anchor | Images | Video | Order / visibility |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero | Hero | — | Cover image (desktop) (+ English variant); Cover image (phones) (+ English variant) | — | always first, always visible |
| 2 | Video gallery | Section heading | `#videos-gallery` | — | — | movable, can be hidden |
| 3 | Closing call-to-action | Closing call-to-action | `#site-cta` | — | — | movable, can be hidden |

SEO: SEO title, Meta description, Sharing image (Arabic), Sharing image (English), Allow search engines to index this page (per language).

### Reviews & FAQs — `/reviews`

| # | Section | Type | Anchor | Images | Video | Order / visibility |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero | Hero | — | Cover image (desktop) (+ English variant); Cover image (phones) (+ English variant) | — | always first, always visible |
| 2 | Patient reviews | Section heading | `#reviews` | — | — | movable, can be hidden |
| 3 | Frequently asked questions | Frequently asked questions | `#faq` | — | — | movable, can be hidden |
| 4 | Closing call-to-action | Closing call-to-action | `#site-cta` | — | — | movable, can be hidden |

SEO: SEO title, Meta description, Sharing image (Arabic), Sharing image (English), Allow search engines to index this page (per language).

### Articles — `/articles`

| # | Section | Type | Anchor | Images | Video | Order / visibility |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero | Hero | — | Cover image (desktop) (+ English variant); Cover image (phones) (+ English variant) | — | always first, always visible |
| 2 | Articles list | Articles list | `#articles` | — | — | movable, can be hidden |
| 3 | Closing call-to-action | Closing call-to-action | `#site-cta` | — | — | movable, can be hidden |

SEO: SEO title, Meta description, Sharing image (Arabic), Sharing image (English), Allow search engines to index this page (per language).

### Contact — `/contact`

| # | Section | Type | Anchor | Images | Video | Order / visibility |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero | Hero | — | Cover image (desktop) (+ English variant); Cover image (phones) (+ English variant) | — | always first, always visible |
| 2 | Contact form | Contact form | `#contact-form` | — | — | movable, can be hidden |
| 3 | Clinic location | Clinic location | `#clinic-location` | — | — | movable, can be hidden |
| 4 | Closing call-to-action | Closing call-to-action | `#site-cta` | — | — | movable, can be hidden |

SEO: SEO title, Meta description, Sharing image (Arabic), Sharing image (English), Allow search engines to index this page (per language).

### Shared blocks

| # | Section | Type | Anchor | Images | Video | Order / visibility |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Call-to-action band (all pages) | Call-to-action band | — | Doctor cut-out | — | copy only (dialog / shared) |


## Section fields

### Hero (`hero`)

- **Small label above the title** — text · AR+EN
- **Main heading** — heading (accent parts) · AR+EN · required
- **Description** — text · AR+EN
- **Main button** — button · AR+EN
- **Second button** — button · AR+EN
- **Floating cards (desktop)** — repeatable items
  - **Icon** — icon
  - **Title** — text · AR+EN
  - **Text** — text · AR+EN
- **Scroll cue label** — text · AR+EN

### Introduction video (`homeIntro`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- **Highlights** — repeatable items
  - **Icon** — icon
  - **Label** — text · AR+EN
- **Link** — button · AR+EN

### Statistics (`homeStats`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- _The figures themselves are edited under Statistics._

### Heading and link (`collection`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- **Link button** — button · AR+EN

### About the doctor (`homeAbout`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- **Points** — repeatable items
  - **Icon** — icon
  - **Title** — text · AR+EN
  - **Text** — text · AR+EN
- **Badge on the photo** — group
  - **Icon** — icon
  - **Label** — text · AR+EN
- **Button** — button · AR+EN

### Timeline (`timeline`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- _The steps are edited under Timelines._

### Reviews and FAQs (`homeReviewsFaq`)

- **Reviews column** — group
  - **Section heading** — group
    - **Small label above the heading** — text · AR+EN
    - **Heading** — heading (accent parts) · AR+EN · required
    - **Description** — text · AR+EN
  - **Link** — button · AR+EN
- **FAQ column** — group
  - **Section heading** — group
    - **Small label above the heading** — text · AR+EN
    - **Heading** — heading (accent parts) · AR+EN · required
    - **Description** — text · AR+EN
  - **Link** — button · AR+EN
- **Button below both columns** — button · AR+EN

### Call-to-action band (`siteCta`)

- **Small label** — text · AR+EN
- **Heading** — heading (accent parts) · AR+EN · required
- **Description** — text · AR+EN
- **Main button (white)** — link or WhatsApp button · AR+EN
- **Second button (lavender)** — link or WhatsApp button · AR+EN

### Closing call-to-action (`pageCta`)

- **Content** — choice (shared / custom)
- **Small label** — text · AR+EN (only when mode = custom)
- **Heading** — heading (accent parts) · AR+EN · required (only when mode = custom)
- **Description** — text · AR+EN (only when mode = custom)
- **Main button (white)** — link or WhatsApp button · AR+EN (only when mode = custom)
- **Second button (lavender)** — link or WhatsApp button · AR+EN (only when mode = custom)

### Introduction video (`aboutVideo`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN

### Doctor introduction (`aboutIntro`)

- **Small label** — text · AR+EN
- **Heading** — heading (accent parts) · AR+EN · required
- **Paragraphs** — list of lines · AR+EN
- **Bullet points** — list of lines · AR+EN
- **Icon of the name caption** — icon
- **Button** — button · AR+EN

### Qualifications (`aboutQualifications`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- **Note under the heading** — text · AR+EN
- _The certificates are edited under Qualifications._

### Statistics (`aboutStats`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- _The counters are edited under Statistics (About)._

### Philosophy (`aboutPhilosophy`)

- **Small label** — text · AR+EN
- **Heading** — heading (accent parts) · AR+EN · required
- **Quote** — text · AR+EN
- **Values** — repeatable items
  - **Icon** — icon
  - **Label** — text · AR+EN

### Section heading (`headingOnly`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN

### Detail dialog text (`servicesDialog`)

- **Booking button** — text · AR+EN
- **WhatsApp button** — text · AR+EN
- **WhatsApp message** — text · AR+EN
- **Medical disclaimer** — text · AR+EN

### Frequently asked questions (`reviewsFaq`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- **Help card** — group
  - **Title** — text · AR+EN
  - **Text** — text · AR+EN
  - **WhatsApp button** — text · AR+EN
  - **WhatsApp message** — text · AR+EN
  - **Call button** — text · AR+EN
- _The questions are edited under FAQs._

### Articles list (`articlesList`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- **Featured article label** — text · AR+EN
- **Title above the other articles** — text · AR+EN
- **Read button** — text · AR+EN
- **Article dialog** — group
  - **Medical disclaimer** — text · AR+EN
  - **Booking button** — text · AR+EN
- _The articles are edited under Articles._

### Contact form (`contactForm`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- **Form** — group
  - **Field labels** — group
    - **Name** — text · AR+EN
    - **Phone** — text · AR+EN
    - **Email** — text · AR+EN
    - **Subject** — text · AR+EN
    - **Message** — text · AR+EN
  - **Placeholders** — group
    - **Name** — text · AR+EN
    - **Phone** — text · AR+EN
    - **Email** — text · AR+EN
    - **Subject** — text · AR+EN
    - **Message** — text · AR+EN
  - **Subjects to choose from** — list of lines · AR+EN
  - **“Optional” marker** — text · AR+EN
  - **Send button** — text · AR+EN
  - **Sending… label** — text · AR+EN
  - **Message when fields are invalid** — text · AR+EN
  - **After sending** — group
    - **Title** — text · AR+EN
    - **Text** — text · AR+EN
  - **When sending is not set up** — group
    - **Title** — text · AR+EN
    - **Text** — text · AR+EN
    - **WhatsApp button** — text · AR+EN
  - **When sending fails** — group
    - **Title** — text · AR+EN
    - **Text** — text · AR+EN
- **WhatsApp button under the form** — text · AR+EN
- **WhatsApp message** — text · AR+EN
- **Call button under the form** — text · AR+EN

### Clinic location (`contactLocation`)

- **Section heading** — group
  - **Small label above the heading** — text · AR+EN
  - **Heading** — heading (accent parts) · AR+EN · required
  - **Description** — text · AR+EN
- **Labels** — group
  - **Address** — text · AR+EN
  - **Opening hours** — text · AR+EN
  - **Phone** — text · AR+EN
  - **Email** — text · AR+EN
  - **Directions button** — text · AR+EN
  - **Note while the map is provisional** — text · AR+EN
- _Address, hours, phone and map pin are edited in Global settings._

## Collections

| Collection | Table | Items now | Status | Featured | Shown on |
| --- | --- | --- | --- | --- | --- |
| Services and procedures | `services` | 8 | draft / published | yes | Services page (all), Home (featured), About specialties (linked) |
| Medical conditions | `conditions` | 8 | draft / published | yes | Services page (all), Home (featured) |
| Key specialties | `specialties` | 4 | draft / published | — | About page |
| Qualifications and certificates | `qualifications` | 6 | draft / published | — | About page |
| Patient journey steps | `timeline_steps` (journey) | 5 | draft / published | — | Home page — patient journey |
| Diagnosis steps | `timeline_steps` (diagnosis) | 5 | draft / published | — | Services page — how we diagnose |
| Career milestones | `timeline_steps` (career) | 5 | draft / published | — | About page — career |
| Statistics (Home) | `stats` (home) | 4 | draft / published | — | Home page — statistics |
| Statistics (About) | `stats` (about) | 4 | draft / published | — | About page — counters of the site's own content |
| Videos | `videos` | 10 | draft / published | yes | Videos page (all listed), Home (featured), introduction video on Home and About |
| Patient reviews | `reviews` | 8 | draft / published | yes | Reviews & FAQs page (all), Home (featured) |
| FAQs | `faqs` | 10 | draft / published | yes | Reviews & FAQs page (all), Home (featured) |
| Articles | `articles` | 7 | draft / published | yes | Articles page (opens in a dialog) |
| Article categories | `article_categories` | 7 | — | — | Articles page (category labels) |

> 8 of the 8 reviews are **layout placeholders**, flagged `is_placeholder` in the database and in the dashboard. They are not genuine patient feedback and should be replaced or unpublished before launch.

### Services and procedures

- **Identifier (URL)** — identifier · required
- **Title** — text · AR+EN · required
- **Card description** — text · AR+EN
- **Icon** — icon
- **Card image** — media (image) · required
- **Featured** — yes / no
- **Detail dialog** — detail dialog (intro + sections) · AR+EN

### Medical conditions

- **Identifier (URL)** — identifier · required
- **Title** — text · AR+EN · required
- **Card description** — text · AR+EN
- **Symptoms (tags)** — list of lines · AR+EN
- **Icon** — icon
- **Card image** — media (image) · required
- **Featured** — yes / no
- **Detail dialog** — detail dialog (intro + sections) · AR+EN

### Key specialties

- **Identifier (URL)** — identifier · required
- **Title** — text · AR+EN · required
- **Description** — text · AR+EN
- **Icon** — icon
- **Card image** — media (image) · required
- **Opens the service** — link to another item

### Qualifications and certificates

- **Identifier** — identifier · required
- **Type** — choice (qualification / certification)
- **Title** — text · AR+EN · required
- **Institution / awarding body** — text · AR+EN
- **Year** — text
- **Description** — text · AR+EN
- **Certificate image** — media (image) · required

### Patient journey steps

- **Identifier** — identifier · required
- **Icon** — icon
- **Title** — text · AR+EN · required
- **Description** — text · AR+EN

### Diagnosis steps

- **Identifier** — identifier · required
- **Icon** — icon
- **Title** — text · AR+EN · required
- **Description** — text · AR+EN

### Career milestones

- **Identifier** — identifier · required
- **Icon** — icon
- **Year or phase** — text · AR+EN
- **Title** — text · AR+EN · required
- **Description** — text · AR+EN

### Statistics (Home)

- **Identifier** — identifier · required
- **Icon** — icon
- **Value** — number
- **Before the number** — text
- **After the number** — text
- **Label** — text · AR+EN · required

### Statistics (About)

- **Identifier** — identifier · required
- **Icon** — icon
- **Counts** — choice (services / conditions / videos / articles)
- **Label** — text · AR+EN · required

### Videos

- **Identifier (URL)** — identifier · required
- **Title** — text · AR+EN · required
- **Description** — text · AR+EN
- **Format** — choice (portrait / landscape)
- **Thumbnail / poster** — media (image) · required
- **Video file** — media (video)
- **Video file for the English page** — media (video)
- **YouTube video id** — text (format checked)
- **Duration** — text (format checked)
- **Show in the video gallery** — yes / no
- **Featured** — yes / no

### Patient reviews

- **Identifier** — identifier · required
- **Patient name (as they agreed to show it)** — text · AR+EN · required
- **Review** — text · AR+EN
- **Context (e.g. knee pain consultation)** — text · AR+EN
- **Rating (1–5)** — number
- **Photo (optional)** — media (image)
- **Placeholder, not a real review** — yes / no
- **Featured** — yes / no

### FAQs

- **Identifier** — identifier · required
- **Question** — text · AR+EN · required
- **Answer** — text · AR+EN
- **Featured** — yes / no

### Articles

- **Identifier (URL)** — identifier · required
- **Title** — text · AR+EN · required
- **Summary** — text · AR+EN
- **Category** — link to another item
- **Publication date** — date
- **Cover image** — media (image) · required
- **Featured** — yes / no
- **Article text** — article blocks · AR+EN

### Article categories

- **Identifier** — identifier · required
- **Name** — text · AR+EN · required

## Global settings

### Identity

- **Doctor's display name** — text · AR+EN · required
- **Doctor's title** — text · AR+EN · required
- **Default page title** — text · AR+EN · required
- **Default description** — text · AR+EN

### Logo, icon and sharing image

- **Logo** — media (image)
- **Browser icon (favicon)** — media (image)
- **Sharing image (Arabic)** — media (image)
- **Sharing image (English)** — media (image)

### Contact

- **Phone number** — text (format checked)
- **WhatsApp number** — text (format checked)
- **Email address** — text (format checked)
- **Booking link** — link

### Clinic address and hours

- **Address lines** — list of lines · AR+EN
- **The address is still provisional** — yes / no
- **Opening hours** — opening hours · AR+EN
- **The hours are still provisional** — yes / no

### Map

- **Latitude** — number
- **Longitude** — number
- **Zoom** — number
- **Map label** — text · AR+EN
- **The pin is still provisional** — yes / no

### Contact form and search engines

- **Save contact-form messages in the dashboard (Inbox)** — yes / no
- **Allow search engines to index the website** — yes / no

## Navigation and social links

Menu items (7): `home`, `about`, `services`, `videos`, `reviews`, `articles`, `contact`. Per item:

- **Label** — text · AR+EN · required
- **Link** — link
- **Visible** — yes / no
- **In the header and menu** — yes / no
- **In the footer** — yes / no

Social links (3): platform, https address, visible, order.

## Interface text

75 short texts (buttons, labels, accessible names, form messages), each in Arabic and English. An empty value falls back to the built-in wording.

| Group | Texts |
| --- | --- |
| About page | 3 |
| Articles | 5 |
| Cards | 5 |
| Shared labels | 5 |
| Contact page | 1 |
| Footer | 8 |
| Form validation messages | 9 |
| Header and menu | 8 |
| Language switch | 1 |
| Page not found (404) | 7 |
| Reviews | 3 |
| Accessibility | 1 |
| Social networks | 6 |
| Timelines | 2 |
| Video player | 11 |

## Media

70 files referenced by the content today (66 images, 4 videos). They ship with the site under `public/` and are registered in the media library with their alt text in both languages; new uploads go to the Supabase Storage bucket `media`. Images and videos can be replaced in place (every use updates), and a file in use cannot be deleted.
