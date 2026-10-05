-- =============================================================================
-- Dr. Ahmed Abdelsalam — CMS schema
--
-- Content for the public website (Arabic + English), media metadata, admin
-- authorization and the contact-form inbox. Every table has Row Level
-- Security:
--   * visitors (anon / authenticated) read only published / visible rows;
--   * administrators (rows in public.admins, checked server-side by
--     public.is_admin()) read and write everything;
--   * contact submissions can be inserted by anyone but read only by admins.
--
-- Idempotent where practical (IF NOT EXISTS / OR REPLACE); never drops data.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Safe link check shared by the tables below: site paths, in-page anchors,
-- http(s), tel: and mailto: only (no javascript:, data:, protocol-relative).
create or replace function public.is_safe_href(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select value is not null
     and length(value) <= 2048
     and value !~ '[[:cntrl:][:space:]]'
     and (
       (value ~ '^/' and value !~ '^//')
       or value ~ '^#[A-Za-z0-9_-]*$'
       or value ~* '^https?://[^/[:space:]]+'
       or value ~* '^tel:\+?[0-9]{4,20}$'
       or value ~* '^mailto:[^@[:space:]]+@[^@[:space:]]+$'
     );
$$;

-- -----------------------------------------------------------------------------
-- Administrators and authorization
-- -----------------------------------------------------------------------------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

comment on table public.admins is
  'CMS administrators. A row here (not a client-side flag) is what grants access; owners manage this list.';

-- SECURITY DEFINER so policies can call them without granting read access to
-- public.admins; search_path is pinned and every name is schema-qualified.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid() and a.role = 'owner');
$$;

-- An owner can never remove or demote the last owner.
create or replace function public.admins_keep_an_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (tg_op = 'DELETE' and old.role = 'owner')
     or (tg_op = 'UPDATE' and old.role = 'owner' and new.role <> 'owner') then
    if not exists (
      select 1 from public.admins a where a.role = 'owner' and a.user_id <> old.user_id
    ) then
      raise exception 'The CMS must keep at least one owner.' using errcode = 'check_violation';
    end if;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists admins_keep_an_owner on public.admins;
create trigger admins_keep_an_owner
  before update or delete on public.admins
  for each row execute function public.admins_keep_an_owner();

-- Grants CMS access to an existing Supabase Auth user (owners only).
create or replace function public.admin_grant(p_email text, p_role text default 'editor')
returns public.admins
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user auth.users%rowtype;
  v_row public.admins;
begin
  if not public.is_owner() then
    raise exception 'Only owners can manage administrators.' using errcode = 'insufficient_privilege';
  end if;
  if p_role not in ('owner', 'editor') then
    raise exception 'Unknown role %.', p_role using errcode = 'check_violation';
  end if;
  select * into v_user from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1;
  if not found then
    raise exception 'No Supabase Auth user with this email. Create the user first (Authentication → Users).'
      using errcode = 'no_data_found';
  end if;
  insert into public.admins (user_id, email, role)
  values (v_user.id, lower(v_user.email), p_role)
  on conflict (user_id) do update set role = excluded.role, email = excluded.email
  returning * into v_row;
  return v_row;
end;
$$;

create or replace function public.admin_revoke(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_owner() then
    raise exception 'Only owners can manage administrators.' using errcode = 'insufficient_privilege';
  end if;
  delete from public.admins where user_id = p_user_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- Media library
-- -----------------------------------------------------------------------------

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('image', 'video')),
  -- Storage bucket, or NULL for a file shipped with the site (path = '/images/…').
  bucket text,
  path text not null,
  mime_type text not null check (mime_type ~ '^(image|video)/[a-z0-9.+-]+$'),
  size_bytes bigint check (size_bytes >= 0),
  width integer check (width > 0),
  height integer check (height > 0),
  duration_seconds numeric(10, 3) check (duration_seconds >= 0),
  title text not null default '' check (length(title) <= 200),
  alt_ar text not null default '' check (length(alt_ar) <= 400),
  alt_en text not null default '' check (length(alt_en) <= 400),
  -- Path of the original file in /public when imported (keeps imports idempotent).
  legacy_path text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path),
  check ((bucket is null and path ~ '^/') or (bucket is not null and path !~ '^/' and path !~ '\.\.'))
);

create index if not exists media_kind_created_idx on public.media (kind, created_at desc);

-- -----------------------------------------------------------------------------
-- Global settings (single row), social links, navigation
-- -----------------------------------------------------------------------------

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  -- Identity (header, footer, metadata, structured data)
  doctor_name_ar text not null default '',
  doctor_name_en text not null default '',
  doctor_role_ar text not null default '',
  doctor_role_en text not null default '',
  -- Default <title> and description for pages without their own
  default_title_ar text not null default '',
  default_title_en text not null default '',
  default_description_ar text not null default '' check (length(default_description_ar) <= 500),
  default_description_en text not null default '' check (length(default_description_en) <= 500),
  og_image_ar_id uuid references public.media (id) on delete restrict,
  og_image_en_id uuid references public.media (id) on delete restrict,
  logo_id uuid references public.media (id) on delete restrict,
  favicon_id uuid references public.media (id) on delete restrict,
  -- Contact (empty = not configured yet; the site shows a placeholder)
  phone_digits text not null default '' check (phone_digits ~ '^([0-9]{8,15})?$'),
  whatsapp_digits text not null default '' check (whatsapp_digits ~ '^([0-9]{8,15})?$'),
  email text not null default '' check (email = '' or email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  address_lines_ar text[] not null default '{}',
  address_lines_en text[] not null default '{}',
  address_is_placeholder boolean not null default true,
  hours_ar jsonb not null default '[]' check (jsonb_typeof(hours_ar) = 'array'),
  hours_en jsonb not null default '[]' check (jsonb_typeof(hours_en) = 'array'),
  hours_are_placeholder boolean not null default true,
  map_lat numeric(9, 6) check (map_lat between -90 and 90),
  map_lng numeric(9, 6) check (map_lng between -180 and 180),
  map_zoom smallint not null default 15 check (map_zoom between 1 and 19),
  map_label_ar text not null default '',
  map_label_en text not null default '',
  map_is_placeholder boolean not null default true,
  -- Shared actions
  booking_href text not null default '/contact' check (public.is_safe_href(booking_href)),
  -- Contact form: keep submissions in the CMS inbox
  form_store_submissions boolean not null default true,
  -- Site-wide search indexing switch (e.g. off while the site is in preparation)
  robots_index boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique check (platform in ('facebook', 'instagram', 'youtube', 'tiktok', 'x', 'linkedin')),
  url text not null check (url ~* '^https://[^/[:space:]]+' and public.is_safe_href(url)),
  sort_order integer not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z][a-z0-9-]*$'),
  href text not null check (public.is_safe_href(href)),
  label_ar text not null default '' check (length(label_ar) <= 80),
  label_en text not null default '' check (length(label_en) <= 80),
  sort_order integer not null default 0,
  visible boolean not null default true,
  show_in_header boolean not null default true,
  show_in_footer boolean not null default true,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Collections
-- -----------------------------------------------------------------------------

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  icon text not null check (icon ~ '^[a-zA-Z]{2,40}$'),
  image_id uuid references public.media (id) on delete restrict,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  title_ar text not null default '' check (length(title_ar) <= 160),
  title_en text not null default '' check (length(title_en) <= 160),
  description_ar text not null default '' check (length(description_ar) <= 600),
  description_en text not null default '' check (length(description_en) <= 600),
  details_ar jsonb not null default '{"lead": "", "sections": []}' check (jsonb_typeof(details_ar) = 'object'),
  details_en jsonb not null default '{"lead": "", "sections": []}' check (jsonb_typeof(details_en) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conditions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  icon text not null check (icon ~ '^[a-zA-Z]{2,40}$'),
  image_id uuid references public.media (id) on delete restrict,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  title_ar text not null default '' check (length(title_ar) <= 160),
  title_en text not null default '' check (length(title_en) <= 160),
  excerpt_ar text not null default '' check (length(excerpt_ar) <= 600),
  excerpt_en text not null default '' check (length(excerpt_en) <= 600),
  symptoms_ar text[] not null default '{}',
  symptoms_en text[] not null default '{}',
  details_ar jsonb not null default '{"lead": "", "sections": []}' check (jsonb_typeof(details_ar) = 'object'),
  details_en jsonb not null default '{"lead": "", "sections": []}' check (jsonb_typeof(details_en) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.specialties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  icon text not null check (icon ~ '^[a-zA-Z]{2,40}$'),
  -- The service whose detail dialog the card opens.
  service_id uuid references public.services (id) on delete restrict,
  image_id uuid references public.media (id) on delete restrict,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  title_ar text not null default '' check (length(title_ar) <= 160),
  title_en text not null default '' check (length(title_en) <= 160),
  description_ar text not null default '' check (length(description_ar) <= 600),
  description_en text not null default '' check (length(description_en) <= 600),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.qualifications (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  kind text not null check (kind in ('qualification', 'certification')),
  year text not null default '' check (length(year) <= 40),
  image_id uuid references public.media (id) on delete restrict,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  title_ar text not null default '' check (length(title_ar) <= 200),
  title_en text not null default '' check (length(title_en) <= 200),
  institution_ar text not null default '' check (length(institution_ar) <= 200),
  institution_en text not null default '' check (length(institution_en) <= 200),
  description_ar text not null default '' check (length(description_ar) <= 600),
  description_en text not null default '' check (length(description_en) <= 600),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Patient journey (home), diagnosis steps (services) and career milestones (about).
create table if not exists public.timeline_steps (
  id uuid primary key default gen_random_uuid(),
  group_key text not null check (group_key in ('journey', 'diagnosis', 'career')),
  key text not null check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  icon text not null check (icon ~ '^[a-zA-Z]{2,40}$'),
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  title_ar text not null default '' check (length(title_ar) <= 160),
  title_en text not null default '' check (length(title_en) <= 160),
  description_ar text not null default '' check (length(description_ar) <= 600),
  description_en text not null default '' check (length(description_en) <= 600),
  meta_ar text not null default '' check (length(meta_ar) <= 60),
  meta_en text not null default '' check (length(meta_en) <= 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_key, key)
);

-- Counters: fixed values (home) or counts of the site's own collections (about).
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  group_key text not null check (group_key in ('home', 'about')),
  key text not null check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  icon text not null check (icon ~ '^[a-zA-Z]{2,40}$'),
  value numeric(12, 2) check (value >= 0),
  count_of text check (count_of in ('services', 'conditions', 'videos', 'articles')),
  prefix text not null default '' check (length(prefix) <= 8),
  suffix text not null default '' check (length(suffix) <= 8),
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  label_ar text not null default '' check (length(label_ar) <= 160),
  label_en text not null default '' check (length(label_en) <= 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_key, key),
  check ((value is null) <> (count_of is null))
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  orientation text not null default 'portrait' check (orientation in ('portrait', 'landscape')),
  duration text check (duration ~ '^[0-9]{1,2}:[0-5][0-9](:[0-5][0-9])?$'),
  youtube_id text check (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  poster_id uuid references public.media (id) on delete restrict,
  -- One file per language (e.g. burned-in subtitles); English falls back to Arabic.
  file_ar_id uuid references public.media (id) on delete restrict,
  file_en_id uuid references public.media (id) on delete restrict,
  -- Shown in the /videos gallery (the introduction video is not).
  listed boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  title_ar text not null default '' check (length(title_ar) <= 160),
  title_en text not null default '' check (length(title_en) <= 160),
  description_ar text not null default '' check (length(description_ar) <= 600),
  description_en text not null default '' check (length(description_en) <= 600),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  rating smallint not null check (rating between 1 and 5),
  avatar_id uuid references public.media (id) on delete restrict,
  featured boolean not null default false,
  -- Marks layout placeholders so they are never mistaken for real feedback.
  is_placeholder boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  name_ar text not null default '' check (length(name_ar) <= 120),
  name_en text not null default '' check (length(name_en) <= 120),
  text_ar text not null default '' check (length(text_ar) <= 1200),
  text_en text not null default '' check (length(text_en) <= 1200),
  context_ar text not null default '' check (length(context_ar) <= 120),
  context_en text not null default '' check (length(context_en) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  question_ar text not null default '' check (length(question_ar) <= 300),
  question_en text not null default '' check (length(question_en) <= 300),
  answer_ar text not null default '' check (length(answer_ar) <= 2000),
  answer_en text not null default '' check (length(answer_en) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  name_ar text not null default '' check (length(name_ar) <= 80),
  name_en text not null default '' check (length(name_en) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  published_at date not null default current_date,
  category_id uuid references public.article_categories (id) on delete restrict,
  cover_id uuid references public.media (id) on delete restrict,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  title_ar text not null default '' check (length(title_ar) <= 200),
  title_en text not null default '' check (length(title_en) <= 200),
  excerpt_ar text not null default '' check (length(excerpt_ar) <= 600),
  excerpt_en text not null default '' check (length(excerpt_en) <= 600),
  body_ar jsonb not null default '[]' check (jsonb_typeof(body_ar) = 'array'),
  body_en jsonb not null default '[]' check (jsonb_typeof(body_en) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Pages and sections
-- -----------------------------------------------------------------------------

create table if not exists public.pages (
  key text primary key check (key ~ '^[a-z][a-z0-9-]*$'),
  -- Path without the language prefix; NULL for the shared 'global' blocks.
  path text unique check (path is null or (path ~ '^/' and public.is_safe_href(path))),
  seo_title_ar text not null default '' check (length(seo_title_ar) <= 120),
  seo_title_en text not null default '' check (length(seo_title_en) <= 120),
  seo_description_ar text not null default '' check (length(seo_description_ar) <= 320),
  seo_description_en text not null default '' check (length(seo_description_en) <= 320),
  og_image_ar_id uuid references public.media (id) on delete restrict,
  og_image_en_id uuid references public.media (id) on delete restrict,
  robots_index boolean not null default true,
  updated_at timestamptz not null default now()
);

-- One row per section of a page, in display order. `type` is one of the
-- section types defined in lib/cms/sections.ts; `content` holds its text
-- (localized leaves {"ar": …, "en": …}) and settings, validated by the
-- application before every write.
create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null references public.pages (key) on delete cascade,
  key text not null check (key ~ '^[a-z][a-zA-Z0-9-]*$'),
  type text not null check (type ~ '^[a-z][a-zA-Z0-9.-]*$'),
  sort_order integer not null default 0,
  visible boolean not null default true,
  content jsonb not null default '{}' check (jsonb_typeof(content) = 'object'),
  video_id uuid references public.videos (id) on delete restrict,
  updated_at timestamptz not null default now(),
  unique (page_key, key)
);

create index if not exists page_sections_page_order_idx on public.page_sections (page_key, sort_order);

-- Images used by a section, by slot (e.g. hero 'desktop' / 'mobile').
create table if not exists public.section_media (
  section_id uuid not null references public.page_sections (id) on delete cascade,
  slot text not null check (slot ~ '^[a-z][a-zA-Z0-9]*$'),
  media_id uuid not null references public.media (id) on delete restrict,
  object_position text check (object_position ~ '^[a-z0-9%. -]{1,40}$'),
  -- Alt text for this use only (NULL = the media's own alt text).
  alt_ar text check (length(alt_ar) <= 400),
  alt_en text check (length(alt_en) <= 400),
  primary key (section_id, slot)
);

-- -----------------------------------------------------------------------------
-- Interface strings (navigation labels, accessible names, form messages …)
-- -----------------------------------------------------------------------------

create table if not exists public.ui_strings (
  key text primary key check (key ~ '^[a-z][a-zA-Z0-9]*(\.[a-zA-Z0-9]+)*$'),
  value_ar text not null default '' check (length(value_ar) <= 600),
  value_en text not null default '' check (length(value_en) <= 600),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Contact form inbox (never publicly readable)
-- -----------------------------------------------------------------------------

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  locale text not null check (locale in ('ar', 'en')),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 6 and 30),
  email text check (email is null or (char_length(email) <= 200 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')),
  subject text not null check (char_length(subject) between 1 and 120),
  message text not null check (char_length(message) between 10 and 1500),
  page text check (page is null or char_length(page) <= 200),
  status text not null default 'new' check (status in ('new', 'read', 'archived'))
);

create index if not exists contact_submissions_created_idx on public.contact_submissions (created_at desc);

-- Simple flood guard: refuse more than 30 submissions per minute in total.
create or replace function public.contact_submissions_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.contact_submissions where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Too many messages right now. Please try again in a minute.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists contact_submissions_rate_limit on public.contact_submissions;
create trigger contact_submissions_rate_limit
  before insert on public.contact_submissions
  for each row execute function public.contact_submissions_rate_limit();

-- -----------------------------------------------------------------------------
-- Indexes on foreign keys (media usage lookups, joins)
-- -----------------------------------------------------------------------------

create index if not exists services_image_idx on public.services (image_id);
create index if not exists services_order_idx on public.services (status, sort_order);
create index if not exists conditions_image_idx on public.conditions (image_id);
create index if not exists conditions_order_idx on public.conditions (status, sort_order);
create index if not exists specialties_image_idx on public.specialties (image_id);
create index if not exists specialties_service_idx on public.specialties (service_id);
create index if not exists qualifications_image_idx on public.qualifications (image_id);
create index if not exists timeline_steps_group_idx on public.timeline_steps (group_key, status, sort_order);
create index if not exists stats_group_idx on public.stats (group_key, status, sort_order);
create index if not exists videos_poster_idx on public.videos (poster_id);
create index if not exists videos_file_ar_idx on public.videos (file_ar_id);
create index if not exists videos_file_en_idx on public.videos (file_en_id);
create index if not exists videos_order_idx on public.videos (status, sort_order);
create index if not exists reviews_avatar_idx on public.reviews (avatar_id);
create index if not exists faqs_order_idx on public.faqs (status, sort_order);
create index if not exists articles_cover_idx on public.articles (cover_id);
create index if not exists articles_category_idx on public.articles (category_id);
create index if not exists articles_order_idx on public.articles (status, sort_order);
create index if not exists section_media_media_idx on public.section_media (media_id);
create index if not exists page_sections_video_idx on public.page_sections (video_id);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'media', 'site_settings', 'social_links', 'navigation_items', 'services', 'conditions', 'specialties',
    'qualifications', 'timeline_steps', 'stats', 'videos', 'reviews', 'faqs', 'article_categories', 'articles',
    'pages', 'page_sections', 'ui_strings'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t
    );
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- Where each media file is used (admin media library). security_invoker so
-- the caller's Row Level Security applies.
-- -----------------------------------------------------------------------------

create or replace view public.media_usages
with (security_invoker = true)
as
  select image_id as media_id, 'services'::text as source, id::text as record_id, slug as record_key, 'image'::text as field from public.services where image_id is not null
  union all select image_id, 'conditions', id::text, slug, 'image' from public.conditions where image_id is not null
  union all select image_id, 'specialties', id::text, slug, 'image' from public.specialties where image_id is not null
  union all select image_id, 'qualifications', id::text, key, 'image' from public.qualifications where image_id is not null
  union all select poster_id, 'videos', id::text, slug, 'poster' from public.videos where poster_id is not null
  union all select file_ar_id, 'videos', id::text, slug, 'file_ar' from public.videos where file_ar_id is not null
  union all select file_en_id, 'videos', id::text, slug, 'file_en' from public.videos where file_en_id is not null
  union all select avatar_id, 'reviews', id::text, key, 'avatar' from public.reviews where avatar_id is not null
  union all select cover_id, 'articles', id::text, slug, 'cover' from public.articles where cover_id is not null
  union all select sm.media_id, 'sections', s.id::text, s.page_key || '.' || s.key, sm.slot
    from public.section_media sm join public.page_sections s on s.id = sm.section_id
  union all select og_image_ar_id, 'pages', key, key, 'og_image_ar' from public.pages where og_image_ar_id is not null
  union all select og_image_en_id, 'pages', key, key, 'og_image_en' from public.pages where og_image_en_id is not null
  union all select og_image_ar_id, 'settings', '1', 'site', 'og_image_ar' from public.site_settings where og_image_ar_id is not null
  union all select og_image_en_id, 'settings', '1', 'site', 'og_image_en' from public.site_settings where og_image_en_id is not null
  union all select logo_id, 'settings', '1', 'site', 'logo' from public.site_settings where logo_id is not null
  union all select favicon_id, 'settings', '1', 'site', 'favicon' from public.site_settings where favicon_id is not null;

-- -----------------------------------------------------------------------------
-- Public snapshot: everything the website renders, in one call. Runs with
-- the caller's rights (security invoker), so Row Level Security applies, and
-- filters to published / visible rows explicitly as well.
-- -----------------------------------------------------------------------------

create or replace function public.cms_snapshot()
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'settings', (select to_jsonb(s) from public.site_settings s where s.id = 1),
    'socials', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.platform) from public.social_links x where x.visible), '[]'::jsonb),
    'navigation', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.key) from public.navigation_items x where x.visible), '[]'::jsonb),
    'pages', coalesce((select jsonb_agg(to_jsonb(x) order by x.key) from public.pages x), '[]'::jsonb),
    'sections', coalesce((select jsonb_agg(to_jsonb(x) order by x.page_key, x.sort_order, x.key) from public.page_sections x where x.visible), '[]'::jsonb),
    'sectionMedia', coalesce((
      select jsonb_agg(to_jsonb(m) order by m.section_id, m.slot)
      from public.section_media m join public.page_sections s on s.id = m.section_id
      where s.visible
    ), '[]'::jsonb),
    'media', coalesce((select jsonb_agg(to_jsonb(x) order by x.id) from public.media x), '[]'::jsonb),
    'services', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.slug) from public.services x where x.status = 'published'), '[]'::jsonb),
    'conditions', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.slug) from public.conditions x where x.status = 'published'), '[]'::jsonb),
    'specialties', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.slug) from public.specialties x where x.status = 'published'), '[]'::jsonb),
    'qualifications', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.key) from public.qualifications x where x.status = 'published'), '[]'::jsonb),
    'timelineSteps', coalesce((select jsonb_agg(to_jsonb(x) order by x.group_key, x.sort_order, x.key) from public.timeline_steps x where x.status = 'published'), '[]'::jsonb),
    'stats', coalesce((select jsonb_agg(to_jsonb(x) order by x.group_key, x.sort_order, x.key) from public.stats x where x.status = 'published'), '[]'::jsonb),
    'videos', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.slug) from public.videos x where x.status = 'published'), '[]'::jsonb),
    'reviews', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.key) from public.reviews x where x.status = 'published'), '[]'::jsonb),
    'faqs', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.key) from public.faqs x where x.status = 'published'), '[]'::jsonb),
    'articleCategories', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.key) from public.article_categories x), '[]'::jsonb),
    'articles', coalesce((select jsonb_agg(to_jsonb(x) order by x.sort_order, x.slug) from public.articles x where x.status = 'published'), '[]'::jsonb),
    'uiStrings', coalesce((select jsonb_agg(to_jsonb(x) order by x.key) from public.ui_strings x), '[]'::jsonb)
  );
$$;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.admins enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.navigation_items enable row level security;
alter table public.services enable row level security;
alter table public.conditions enable row level security;
alter table public.specialties enable row level security;
alter table public.qualifications enable row level security;
alter table public.timeline_steps enable row level security;
alter table public.stats enable row level security;
alter table public.videos enable row level security;
alter table public.reviews enable row level security;
alter table public.faqs enable row level security;
alter table public.article_categories enable row level security;
alter table public.articles enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.section_media enable row level security;
alter table public.ui_strings enable row level security;
alter table public.contact_submissions enable row level security;

-- Admins: members see their own row, owners see and manage everyone (via
-- admin_grant / admin_revoke or direct writes).
drop policy if exists "admins: read own row or all for owners" on public.admins;
create policy "admins: read own row or all for owners" on public.admins
  for select to authenticated
  using (user_id = auth.uid() or public.is_owner());

drop policy if exists "admins: owners manage" on public.admins;
create policy "admins: owners manage" on public.admins
  for all to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- Public read + admin write, generated for every content table.
do $$
declare
  t text;
  visibility text;
begin
  for t, visibility in
    select * from (values
      ('media', 'true'),
      ('site_settings', 'true'),
      ('social_links', 'visible'),
      ('navigation_items', 'visible'),
      ('services', $q$status = 'published'$q$),
      ('conditions', $q$status = 'published'$q$),
      ('specialties', $q$status = 'published'$q$),
      ('qualifications', $q$status = 'published'$q$),
      ('timeline_steps', $q$status = 'published'$q$),
      ('stats', $q$status = 'published'$q$),
      ('videos', $q$status = 'published'$q$),
      ('reviews', $q$status = 'published'$q$),
      ('faqs', $q$status = 'published'$q$),
      ('article_categories', 'true'),
      ('articles', $q$status = 'published'$q$),
      ('pages', 'true'),
      ('page_sections', 'visible'),
      ('section_media', 'exists (select 1 from public.page_sections s where s.id = section_id and s.visible)'),
      ('ui_strings', 'true')
    ) as v(tbl, vis)
  loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (%s)', t, visibility);
    execute format('drop policy if exists "admins read all" on public.%I', t);
    execute format('create policy "admins read all" on public.%I for select to authenticated using (public.is_admin())', t);
    execute format('drop policy if exists "admins insert" on public.%I', t);
    execute format('create policy "admins insert" on public.%I for insert to authenticated with check (public.is_admin())', t);
    execute format('drop policy if exists "admins update" on public.%I', t);
    execute format('create policy "admins update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('drop policy if exists "admins delete" on public.%I', t);
    execute format('create policy "admins delete" on public.%I for delete to authenticated using (public.is_admin())', t);
  end loop;
end;
$$;

-- Contact submissions: anyone may send, only admins may read or change.
drop policy if exists "anyone can send" on public.contact_submissions;
create policy "anyone can send" on public.contact_submissions
  for insert to anon, authenticated
  with check (status = 'new');

drop policy if exists "admins read" on public.contact_submissions;
create policy "admins read" on public.contact_submissions
  for select to authenticated using (public.is_admin());

drop policy if exists "admins update" on public.contact_submissions;
create policy "admins update" on public.contact_submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete" on public.contact_submissions;
create policy "admins delete" on public.contact_submissions
  for delete to authenticated using (public.is_admin());

-- -----------------------------------------------------------------------------
-- Privileges (Row Level Security above narrows them further)
-- -----------------------------------------------------------------------------

-- Only the CMS's own tables: other tables in a shared project keep their grants.
revoke all on
  public.admins, public.media, public.site_settings, public.social_links, public.navigation_items,
  public.services, public.conditions, public.specialties, public.qualifications, public.timeline_steps,
  public.stats, public.videos, public.reviews, public.faqs, public.article_categories, public.articles,
  public.pages, public.page_sections, public.section_media, public.ui_strings, public.contact_submissions,
  public.media_usages
  from anon, authenticated;

grant select on
  public.media, public.site_settings, public.social_links, public.navigation_items, public.services,
  public.conditions, public.specialties, public.qualifications, public.timeline_steps, public.stats,
  public.videos, public.reviews, public.faqs, public.article_categories, public.articles, public.pages,
  public.page_sections, public.section_media, public.ui_strings
  to anon, authenticated;

grant insert, update, delete on
  public.media, public.site_settings, public.social_links, public.navigation_items, public.services,
  public.conditions, public.specialties, public.qualifications, public.timeline_steps, public.stats,
  public.videos, public.reviews, public.faqs, public.article_categories, public.articles, public.pages,
  public.page_sections, public.section_media, public.ui_strings
  to authenticated;

grant select, insert, update, delete on public.admins to authenticated;
grant select on public.media_usages to authenticated;

-- Visitors can only set the message fields; status and timestamps keep their defaults.
grant insert (locale, name, phone, email, subject, message, page) on public.contact_submissions to anon, authenticated;
grant select, update, delete on public.contact_submissions to authenticated;

revoke execute on function public.cms_snapshot() from public;
grant execute on function public.cms_snapshot() to anon, authenticated;
revoke execute on function public.admin_grant(text, text) from public, anon;
grant execute on function public.admin_grant(text, text) to authenticated;
revoke execute on function public.admin_revoke(uuid) from public, anon;
grant execute on function public.admin_revoke(uuid) to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_owner() to anon, authenticated;
grant execute on function public.is_safe_href(text) to anon, authenticated;
