/**
 * What can be edited in the dashboard: the fields of every section type,
 * every collection, the global settings, page SEO, navigation and social
 * links. Labels are written for the clinic's editors.
 */
import type { Field } from "@/lib/cms/fields";
import type { SectionType } from "@/lib/cms/section-docs";

/* ---- Shared building blocks ----------------------------------------------- */

const TOKENS_HELP = "Type {doctorName} or {doctorRole} to insert the name and title from Global settings.";

const text = (key: string, label: string, max = 160, extra: Partial<Extract<Field, { type: "text" }>> = {}): Field => ({
  type: "text",
  key,
  label,
  localized: true,
  max,
  ...extra,
});
const longText = (key: string, label: string, max = 600, extra: Partial<Extract<Field, { type: "text" }>> = {}): Field =>
  text(key, label, max, { multiline: true, rows: 3, ...extra });

export const headingField: Field = {
  type: "group",
  key: "heading",
  label: "Section heading",
  fields: [
    text("eyebrow", "Small label above the heading", 80),
    { type: "title", key: "title", label: "Heading", required: true, help: "Mark the words shown in the accent colour." },
    longText("description", "Description", 500),
  ],
};

const cta = (key: string, label: string, optional = false): Field => ({ type: "cta", key, label, optional });

const iconTextList = (key: string, label: string, itemLabel: string, max?: number): Field => ({
  type: "list",
  key,
  label,
  itemLabel,
  max,
  fields: [{ type: "icon", key: "icon", label: "Icon" }, text("title", "Title", 80), longText("text", "Text", 240)],
});

const iconLabelList = (key: string, label: string, itemLabel: string, max?: number): Field => ({
  type: "list",
  key,
  label,
  itemLabel,
  max,
  fields: [{ type: "icon", key: "icon", label: "Icon" }, text("label", "Label", 80)],
});

const bandFields: Field[] = [
  text("eyebrow", "Small label", 80),
  { type: "title", key: "title", label: "Heading", required: true },
  longText("description", "Description", 400),
  { type: "action", key: "primaryAction", label: "Main button (white)" },
  { type: "action", key: "secondaryAction", label: "Second button (lavender)" },
];

/* ---- Sections --------------------------------------------------------------- */

export interface SlotDef {
  key: string;
  label: string;
  required?: boolean;
  /** Offers an object-position (focal point) setting. */
  position?: boolean;
  /** Allows a different image on the English page (stored as `<key>En`). */
  englishOverride?: boolean;
  help?: string;
}

export interface SectionTypeDef {
  label: string;
  fields: Field[];
  slots?: SlotDef[];
  /** The section shows a video chosen from the Videos collection. */
  video?: boolean;
  /** Where related items are edited (shown above the form). */
  note?: { text: string; href: string; link: string };
}

export const sectionTypes: Record<SectionType, SectionTypeDef> = {
  hero: {
    label: "Hero",
    fields: [
      text("eyebrow", "Small label above the title", 120, { help: TOKENS_HELP }),
      { type: "title", key: "title", label: "Main heading", required: true, help: `Mark the words shown in the accent colour. ${TOKENS_HELP}` },
      longText("description", "Description", 500),
      cta("primaryCta", "Main button"),
      cta("secondaryCta", "Second button", true),
      iconTextList("floatingCards", "Floating cards (desktop)", "Card", 2),
      text("scrollCueLabel", "Scroll cue label", 40, { help: "Shown under full-height heroes only." }),
    ],
    slots: [
      { key: "desktop", label: "Cover image (desktop)", required: true, position: true, englishOverride: true, help: "16:9, at least 2400 px wide." },
      { key: "mobile", label: "Cover image (phones)", position: true, englishOverride: true, help: "Portrait crop, about 1200 × 1670 px." },
    ],
  },
  homeIntro: {
    label: "Introduction video",
    fields: [headingField, iconLabelList("highlights", "Highlights", "Highlight", 4), cta("link", "Link")],
    video: true,
  },
  homeStats: {
    label: "Statistics",
    fields: [headingField],
    slots: [{ key: "doctorImage", label: "Doctor photo", required: true, help: "Portrait, 4:5." }],
    note: { text: "The figures themselves are edited under Statistics.", href: "/admin/c/home-stats", link: "Edit figures" },
  },
  collection: { label: "Heading and link", fields: [headingField, cta("cta", "Link button")] },
  homeAbout: {
    label: "About the doctor",
    fields: [
      headingField,
      iconTextList("points", "Points", "Point", 4),
      { type: "group", key: "badge", label: "Badge on the photo", fields: [{ type: "icon", key: "icon", label: "Icon" }, text("label", "Label", 60)] },
      cta("cta", "Button"),
    ],
    slots: [{ key: "image", label: "Photo", required: true, help: "Portrait, 4:5." }],
  },
  timeline: {
    label: "Timeline",
    fields: [headingField],
    note: { text: "The steps are edited under Timelines.", href: "/admin/c/", link: "Edit steps" },
  },
  homeReviewsFaq: {
    label: "Reviews and FAQs",
    fields: [
      { type: "group", key: "reviews", label: "Reviews column", fields: [headingField, cta("cta", "Link")] },
      { type: "group", key: "faq", label: "FAQ column", fields: [headingField, cta("cta", "Link")] },
      cta("cta", "Button below both columns"),
    ],
  },
  siteCta: {
    label: "Call-to-action band",
    fields: bandFields,
    slots: [{ key: "image", label: "Doctor cut-out", required: true, help: "Transparent PNG or WebP, about 1000 × 1250 px." }],
  },
  pageCta: {
    label: "Closing call-to-action",
    fields: [
      {
        type: "select",
        key: "mode",
        label: "Content",
        options: [
          { value: "shared", label: "Use the shared band (Pages → Shared blocks)" },
          { value: "custom", label: "Custom text for this page" },
        ],
      },
      ...bandFields.map((field) => ({ ...field, when: { key: "mode", equals: "custom" } }) as Field),
    ],
  },
  aboutVideo: { label: "Introduction video", fields: [headingField], video: true },
  aboutIntro: {
    label: "Doctor introduction",
    fields: [
      text("eyebrow", "Small label", 80),
      { type: "title", key: "title", label: "Heading", required: true },
      { type: "stringList", key: "paragraphs", label: "Paragraphs", itemLabel: "Paragraph", multiline: true, max: 900 },
      { type: "stringList", key: "bullets", label: "Bullet points", itemLabel: "Point", max: 160 },
      { type: "icon", key: "captionIcon", label: "Icon of the name caption", help: "The caption shows the name and title from Global settings." },
      cta("cta", "Button"),
    ],
    slots: [{ key: "image", label: "Photo", required: true, help: "Portrait, 4:5." }],
  },
  aboutQualifications: {
    label: "Qualifications",
    fields: [headingField, longText("note", "Note under the heading", 300, { help: "Leave empty to hide it." })],
    note: { text: "The certificates are edited under Qualifications.", href: "/admin/c/qualifications", link: "Edit qualifications" },
  },
  aboutStats: {
    label: "Statistics",
    fields: [headingField],
    note: { text: "The counters are edited under Statistics (About).", href: "/admin/c/about-stats", link: "Edit counters" },
  },
  aboutPhilosophy: {
    label: "Philosophy",
    fields: [
      text("eyebrow", "Small label", 80),
      { type: "title", key: "title", label: "Heading", required: true },
      longText("quote", "Quote", 600, { help: "Written in the doctor's voice — have him approve it." }),
      iconLabelList("values", "Values", "Value", 4),
    ],
    slots: [{ key: "image", label: "Photo", required: true }],
  },
  headingOnly: { label: "Section heading", fields: [headingField] },
  servicesDialog: {
    label: "Detail dialog text",
    fields: [
      text("bookLabel", "Booking button", 60),
      text("whatsappLabel", "WhatsApp button", 60),
      longText("whatsappMessage", "WhatsApp message", 300, { help: "{title} is replaced with the service or condition name." }),
      longText("disclaimer", "Medical disclaimer", 400),
    ],
  },
  reviewsFaq: {
    label: "Frequently asked questions",
    fields: [
      headingField,
      {
        type: "group",
        key: "help",
        label: "Help card",
        fields: [
          text("title", "Title", 80),
          longText("text", "Text", 300),
          text("whatsappLabel", "WhatsApp button", 60),
          longText("whatsappMessage", "WhatsApp message", 300),
          text("callLabel", "Call button", 60),
        ],
      },
    ],
    note: { text: "The questions are edited under FAQs.", href: "/admin/c/faqs", link: "Edit FAQs" },
  },
  articlesList: {
    label: "Articles list",
    fields: [
      headingField,
      text("featuredLabel", "Featured article label", 60),
      text("moreTitle", "Title above the other articles", 80),
      text("readLabel", "Read button", 40),
      {
        type: "group",
        key: "dialog",
        label: "Article dialog",
        fields: [longText("disclaimer", "Medical disclaimer", 400), text("ctaLabel", "Booking button", 60)],
      },
    ],
    note: { text: "The articles are edited under Articles.", href: "/admin/c/articles", link: "Edit articles" },
  },
  contactForm: {
    label: "Contact form",
    fields: [
      headingField,
      {
        type: "group",
        key: "copy",
        label: "Form",
        fields: [
          {
            type: "group",
            key: "labels",
            label: "Field labels",
            fields: [text("name", "Name", 60), text("phone", "Phone", 60), text("email", "Email", 60), text("subject", "Subject", 60), text("message", "Message", 60)],
          },
          {
            type: "group",
            key: "placeholders",
            label: "Placeholders",
            fields: [text("name", "Name", 80), text("phone", "Phone", 80), text("email", "Email", 80), text("subject", "Subject", 80), text("message", "Message", 120)],
          },
          { type: "stringList", key: "subjects", label: "Subjects to choose from", itemLabel: "Subject", max: 80 },
          text("optional", "“Optional” marker", 30),
          text("submit", "Send button", 40),
          text("sending", "Sending… label", 40),
          longText("errorSummary", "Message when fields are invalid", 200),
          { type: "group", key: "success", label: "After sending", fields: [text("title", "Title", 80), longText("text", "Text", 300)] },
          {
            type: "group",
            key: "notConfigured",
            label: "When sending is not set up",
            fields: [text("title", "Title", 120), longText("text", "Text", 300), text("whatsappLabel", "WhatsApp button", 60)],
          },
          { type: "group", key: "failure", label: "When sending fails", fields: [text("title", "Title", 80), longText("text", "Text", 300)] },
        ],
      },
      text("whatsappLabel", "WhatsApp button under the form", 60),
      longText("whatsappMessage", "WhatsApp message", 300),
      text("callLabel", "Call button under the form", 60),
    ],
  },
  contactLocation: {
    label: "Clinic location",
    fields: [
      headingField,
      {
        type: "group",
        key: "labels",
        label: "Labels",
        fields: [
          text("address", "Address", 40),
          text("hours", "Opening hours", 40),
          text("phone", "Phone", 40),
          text("email", "Email", 40),
          text("directions", "Directions button", 40),
          longText("placeholderNote", "Note while the map is provisional", 300),
        ],
      },
    ],
    note: { text: "Address, hours, phone and map pin are edited in Global settings.", href: "/admin/settings", link: "Open settings" },
  },
};

/* ---- Collections -------------------------------------------------------------- */

export interface CollectionDef {
  /** URL segment: /admin/c/<key>. */
  key: string;
  table:
    | "services"
    | "conditions"
    | "specialties"
    | "qualifications"
    | "timeline_steps"
    | "stats"
    | "videos"
    | "reviews"
    | "faqs"
    | "articles"
    | "article_categories";
  label: string;
  singular: string;
  /** Where the items appear on the website. */
  usedOn: string;
  naturalKey: "slug" | "key";
  /** Collections that are one group of a shared table (timeline steps, stats). */
  group?: { column: "group_key"; value: string };
  fields: Field[];
  /** Localized field shown as the item's name. */
  titleField: string;
  hasStatus: boolean;
  hasFeatured: boolean;
  /** Public page to preview the items on. */
  previewPath: string;
}

const statusFields = { hasStatus: true };

const slugField: Field = {
  type: "slug",
  key: "slug",
  label: "Identifier (URL)",
  required: true,
  help: "Used in links such as /services#knee-pain. Fixed once created, so existing links never break.",
};
const keyField: Field = { type: "slug", key: "key", label: "Identifier", required: true, help: "Fixed once created." };
const iconField: Field = { type: "icon", key: "icon", label: "Icon" };
const featured = (help: string): Field => ({ type: "boolean", key: "featured", label: "Featured", help });

const timeline = (key: string, label: string, value: string, usedOn: string, withMeta: boolean): CollectionDef => ({
  key,
  table: "timeline_steps",
  label,
  singular: "Step",
  usedOn,
  naturalKey: "key",
  group: { column: "group_key", value },
  fields: [
    keyField,
    iconField,
    ...(withMeta ? [text("meta", "Year or phase", 40, { help: "e.g. 2015 – 2018, or Present." })] : []),
    text("title", "Title", 120, { required: true }),
    longText("description", "Description", 400),
  ],
  titleField: "title",
  ...statusFields,
  hasFeatured: false,
  previewPath: usedOn.startsWith("Home") ? "/" : usedOn.startsWith("Services") ? "/services#diagnosis" : "/about#career",
});

export const collections: CollectionDef[] = [
  {
    key: "services",
    table: "services",
    label: "Services and procedures",
    singular: "Service",
    usedOn: "Services page (all), Home (featured), About specialties (linked)",
    naturalKey: "slug",
    fields: [
      slugField,
      text("title", "Title", 120, { required: true }),
      longText("description", "Card description", 300),
      iconField,
      { type: "media", key: "image_id", label: "Card image", kind: "image", required: true, help: "4:3, about 1200 × 900 px." },
      featured("Shown on the homepage (the first four)."),
      { type: "details", key: "details", label: "Detail dialog" },
    ],
    titleField: "title",
    ...statusFields,
    hasFeatured: true,
    previewPath: "/services#procedures",
  },
  {
    key: "conditions",
    table: "conditions",
    label: "Medical conditions",
    singular: "Condition",
    usedOn: "Services page (all), Home (featured)",
    naturalKey: "slug",
    fields: [
      slugField,
      text("title", "Title", 120, { required: true }),
      longText("excerpt", "Card description", 300),
      { type: "stringList", key: "symptoms", label: "Symptoms (tags)", itemLabel: "Symptom", max: 60 },
      iconField,
      { type: "media", key: "image_id", label: "Card image", kind: "image", required: true, help: "4:3, about 1200 × 900 px." },
      featured("Shown on the homepage (the first four)."),
      { type: "details", key: "details", label: "Detail dialog" },
    ],
    titleField: "title",
    ...statusFields,
    hasFeatured: true,
    previewPath: "/services#conditions",
  },
  {
    key: "specialties",
    table: "specialties",
    label: "Key specialties",
    singular: "Specialty",
    usedOn: "About page",
    naturalKey: "slug",
    fields: [
      slugField,
      text("title", "Title", 120, { required: true }),
      longText("description", "Description", 300),
      iconField,
      { type: "media", key: "image_id", label: "Card image", kind: "image", required: true },
      { type: "reference", key: "service_id", label: "Opens the service", table: "services", labelColumn: "title_en", help: "The card opens this service's detail dialog." },
    ],
    titleField: "title",
    ...statusFields,
    hasFeatured: false,
    previewPath: "/about#specialties",
  },
  {
    key: "qualifications",
    table: "qualifications",
    label: "Qualifications and certificates",
    singular: "Qualification",
    usedOn: "About page",
    naturalKey: "key",
    fields: [
      keyField,
      {
        type: "select",
        key: "kind",
        label: "Type",
        options: [
          { value: "qualification", label: "Academic qualification" },
          { value: "certification", label: "Professional certificate" },
        ],
      },
      text("title", "Title", 160, { required: true }),
      text("institution", "Institution / awarding body", 160),
      { type: "text", key: "year", label: "Year", max: 40, dir: "ltr", help: "Free text: 2012, 2015 – 2018 …" },
      longText("description", "Description", 400),
      { type: "media", key: "image_id", label: "Certificate image", kind: "image", required: true },
    ],
    titleField: "title",
    ...statusFields,
    hasFeatured: false,
    previewPath: "/about#qualifications",
  },
  timeline("journey", "Patient journey steps", "journey", "Home page — patient journey", false),
  timeline("diagnosis", "Diagnosis steps", "diagnosis", "Services page — how we diagnose", false),
  timeline("career", "Career milestones", "career", "About page — career", true),
  {
    key: "home-stats",
    table: "stats",
    label: "Statistics (Home)",
    singular: "Figure",
    usedOn: "Home page — statistics",
    naturalKey: "key",
    group: { column: "group_key", value: "home" },
    fields: [
      keyField,
      iconField,
      { type: "number", key: "value", label: "Value", min: 0, max: 1_000_000_000, help: "Use verified figures only." },
      { type: "text", key: "prefix", label: "Before the number", max: 8, dir: "ltr" },
      { type: "text", key: "suffix", label: "After the number", max: 8, dir: "ltr", help: "e.g. % or +" },
      text("label", "Label", 120, { required: true }),
    ],
    titleField: "label",
    ...statusFields,
    hasFeatured: false,
    previewPath: "/#stats",
  },
  {
    key: "about-stats",
    table: "stats",
    label: "Statistics (About)",
    singular: "Counter",
    usedOn: "About page — counters of the site's own content",
    naturalKey: "key",
    group: { column: "group_key", value: "about" },
    fields: [
      keyField,
      iconField,
      {
        type: "select",
        key: "count_of",
        label: "Counts",
        options: [
          { value: "services", label: "Published services" },
          { value: "conditions", label: "Published conditions" },
          { value: "videos", label: "Published videos" },
          { value: "articles", label: "Published articles" },
        ],
      },
      text("label", "Label", 120, { required: true }),
    ],
    titleField: "label",
    ...statusFields,
    hasFeatured: false,
    previewPath: "/about#about-stats",
  },
  {
    key: "videos",
    table: "videos",
    label: "Videos",
    singular: "Video",
    usedOn: "Videos page (all listed), Home (featured), introduction video on Home and About",
    naturalKey: "slug",
    fields: [
      slugField,
      text("title", "Title", 160, { required: true }),
      longText("description", "Description", 400),
      {
        type: "select",
        key: "orientation",
        label: "Format",
        options: [
          { value: "portrait", label: "Vertical (9:16)" },
          { value: "landscape", label: "Horizontal (16:9)" },
        ],
      },
      { type: "media", key: "poster_id", label: "Thumbnail / poster", kind: "image", required: true },
      { type: "media", key: "file_ar_id", label: "Video file", kind: "video", help: "MP4 (H.264) or WebM." },
      { type: "media", key: "file_en_id", label: "Video file for the English page", kind: "video", help: "Optional — e.g. a version with English subtitles. Empty = same as above." },
      {
        type: "pattern",
        key: "youtube_id",
        label: "YouTube video id",
        pattern: "^([A-Za-z0-9_-]{11})?$",
        patternHelp: "the 11-character id from the YouTube link (or leave empty).",
        dir: "ltr",
        nullable: true,
        help: "Used only when no video file is set.",
      },
      { type: "pattern", key: "duration", label: "Duration", pattern: "^([0-9]{1,2}:[0-5][0-9](:[0-5][0-9])?)?$", patternHelp: "like 1:20.", dir: "ltr", nullable: true },
      { type: "boolean", key: "listed", label: "Show in the video gallery", help: "Turn off for the introduction video." },
      featured("Shown on the homepage (the first three)."),
    ],
    titleField: "title",
    ...statusFields,
    hasFeatured: true,
    previewPath: "/videos#videos-gallery",
  },
  {
    key: "reviews",
    table: "reviews",
    label: "Patient reviews",
    singular: "Review",
    usedOn: "Reviews & FAQs page (all), Home (featured)",
    naturalKey: "key",
    fields: [
      keyField,
      text("name", "Patient name (as they agreed to show it)", 120, { required: true }),
      longText("text", "Review", 1200),
      text("context", "Context (e.g. knee pain consultation)", 120),
      { type: "number", key: "rating", label: "Rating (1–5)", min: 1, max: 5, step: 1 },
      { type: "media", key: "avatar_id", label: "Photo (optional)", kind: "image" },
      {
        type: "boolean",
        key: "is_placeholder",
        label: "Placeholder, not a real review",
        help: "Reminder for editors only. Publish only genuine reviews with the patient's consent.",
      },
      featured("Shown on the homepage (the first four)."),
    ],
    titleField: "name",
    ...statusFields,
    hasFeatured: true,
    previewPath: "/reviews#reviews",
  },
  {
    key: "faqs",
    table: "faqs",
    label: "FAQs",
    singular: "Question",
    usedOn: "Reviews & FAQs page (all), Home (featured)",
    naturalKey: "key",
    fields: [
      keyField,
      text("question", "Question", 300, { required: true }),
      longText("answer", "Answer", 2000, { rows: 5 }),
      featured("Shown on the homepage (the first six)."),
    ],
    titleField: "question",
    ...statusFields,
    hasFeatured: true,
    previewPath: "/reviews#faq",
  },
  {
    key: "articles",
    table: "articles",
    label: "Articles",
    singular: "Article",
    usedOn: "Articles page (opens in a dialog)",
    naturalKey: "slug",
    fields: [
      slugField,
      text("title", "Title", 200, { required: true }),
      longText("excerpt", "Summary", 600),
      { type: "reference", key: "category_id", label: "Category", table: "article_categories", labelColumn: "name_en" },
      { type: "date", key: "published_at", label: "Publication date" },
      { type: "media", key: "cover_id", label: "Cover image", kind: "image", required: true, help: "16:10, about 1600 × 1000 px." },
      featured("The featured article is shown large at the top."),
      { type: "blocks", key: "body", label: "Article text" },
    ],
    titleField: "title",
    ...statusFields,
    hasFeatured: true,
    previewPath: "/articles#articles",
  },
  {
    key: "categories",
    table: "article_categories",
    label: "Article categories",
    singular: "Category",
    usedOn: "Articles page (category labels)",
    naturalKey: "key",
    fields: [keyField, text("name", "Name", 80, { required: true })],
    titleField: "name",
    hasStatus: false,
    hasFeatured: false,
    previewPath: "/articles",
  },
];

export function collectionDef(key: string): CollectionDef | undefined {
  return collections.find((collection) => collection.key === key);
}

/* ---- Settings, SEO, navigation ---------------------------------------------- */

const digits = (key: string, label: string, help: string): Field => ({
  type: "pattern",
  key,
  label,
  pattern: "^([0-9]{8,15})?$",
  patternHelp: "digits only, international format (e.g. 201001234567), or empty.",
  dir: "ltr",
  help,
});

export const settingsGroups: { title: string; description?: string; fields: Field[] }[] = [
  {
    title: "Identity",
    description: "Shown in the header, footer, page titles and search results.",
    fields: [
      text("doctor_name", "Doctor's display name", 80, { required: true }),
      text("doctor_role", "Doctor's title", 80, { required: true }),
      text("default_title", "Default page title", 120, { required: true, help: "Used for the home page and in search results." }),
      longText("default_description", "Default description", 300, { help: "Used when a page has no description of its own." }),
    ],
  },
  {
    title: "Logo, icon and sharing image",
    fields: [
      { type: "media", key: "logo_id", label: "Logo", kind: "image", help: "Square PNG or WebP. Empty = the built-in brand mark." },
      { type: "media", key: "favicon_id", label: "Browser icon (favicon)", kind: "image", help: "Square PNG or ICO, at least 180 × 180 px. Empty = the built-in icon." },
      { type: "media", key: "og_image_ar_id", label: "Sharing image (Arabic)", kind: "image", help: "1200 × 630 px, shown when a page is shared." },
      { type: "media", key: "og_image_en_id", label: "Sharing image (English)", kind: "image", help: "Empty = the Arabic one." },
    ],
  },
  {
    title: "Contact",
    description: "Used by every call and WhatsApp button, the footer, the contact page and structured data. Leave a number empty until it is confirmed — the site then shows a placeholder.",
    fields: [
      digits("phone_digits", "Phone number", "Digits only, with country code."),
      digits("whatsapp_digits", "WhatsApp number", "Empty = the phone number."),
      {
        type: "pattern",
        key: "email",
        label: "Email address",
        pattern: "^([^@\\s]+@[^@\\s]+\\.[^@\\s]+)?$",
        patternHelp: "a valid email address, or empty.",
        dir: "ltr",
        max: 200,
      },
      { type: "href", key: "booking_href", label: "Booking link", help: "Where every “Book” button leads. Usually /contact; can be an https:// booking page." },
    ],
  },
  {
    title: "Clinic address and hours",
    fields: [
      { type: "stringList", key: "address_lines", label: "Address lines", itemLabel: "Line", max: 160 },
      { type: "boolean", key: "address_is_placeholder", label: "The address is still provisional" },
      { type: "hours", key: "hours", label: "Opening hours" },
      { type: "boolean", key: "hours_are_placeholder", label: "The hours are still provisional" },
    ],
  },
  {
    title: "Map",
    fields: [
      { type: "number", key: "map_lat", label: "Latitude", min: -90, max: 90, step: 0.000001 },
      { type: "number", key: "map_lng", label: "Longitude", min: -180, max: 180, step: 0.000001 },
      { type: "number", key: "map_zoom", label: "Zoom", min: 1, max: 19, step: 1 },
      text("map_label", "Map label", 120),
      { type: "boolean", key: "map_is_placeholder", label: "The pin is still provisional", help: "Shows a notice and hides the directions button." },
    ],
  },
  {
    title: "Contact form and search engines",
    fields: [
      { type: "boolean", key: "form_store_submissions", label: "Save contact-form messages in the dashboard (Inbox)" },
      { type: "boolean", key: "robots_index", label: "Allow search engines to index the website", help: "Turn off while the site is in preparation." },
    ],
  },
];

export const settingsFields: Field[] = settingsGroups.flatMap((group) => group.fields);

export const pageSeoFields: Field[] = [
  text("seo_title", "SEO title", 120, { help: "Shown in search results and browser tabs (the site name is added after it)." }),
  longText("seo_description", "Meta description", 320, { help: "About 150 characters." }),
  { type: "media", key: "og_image_ar_id", label: "Sharing image (Arabic)", kind: "image", help: "Empty = the site's sharing image." },
  { type: "media", key: "og_image_en_id", label: "Sharing image (English)", kind: "image" },
  { type: "boolean", key: "robots_index", label: "Allow search engines to index this page" },
];

export const navigationFields: Field[] = [
  text("label", "Label", 80, { required: true }),
  { type: "href", key: "href", label: "Link", help: "A site path such as /services, or an https:// link." },
  { type: "boolean", key: "visible", label: "Visible" },
  { type: "boolean", key: "show_in_header", label: "In the header and menu" },
  { type: "boolean", key: "show_in_footer", label: "In the footer" },
];

export const SOCIAL_PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "x", label: "X" },
  { value: "linkedin", label: "LinkedIn" },
];
