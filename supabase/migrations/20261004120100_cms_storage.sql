-- =============================================================================
-- Dr. Ahmed Abdelsalam — media storage
--
-- One public bucket for website images and videos: files are readable by URL
-- (they are shown on the public site), but only CMS administrators can
-- upload, replace or delete them. The bucket enforces a size limit and a
-- list of allowed file types; the dashboard validates the same rules before
-- uploading.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  209715200, -- 200 MB (the project-wide upload limit may be lower; see docs/cms/SETUP.md)
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
    'image/x-icon', 'image/vnd.microsoft.icon',
    'video/mp4', 'video/webm'
  ]
)
on conflict (id) do nothing;

drop policy if exists "media: admins read" on storage.objects;
create policy "media: admins read" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admins upload" on storage.objects;
create policy "media: admins upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admins update" on storage.objects;
create policy "media: admins update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admins delete" on storage.objects;
create policy "media: admins delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
