-- Makes an existing Supabase Auth user the first owner of the CMS.
--
-- 1. Supabase → Authentication → Users → "Add user" (or "Invite user") with
--    the doctor's / administrator's email. Choose a strong password.
-- 2. Replace the email below, paste this into the SQL editor and run it.
--
-- Afterwards, owners add further administrators from the dashboard
-- (Admin users). Running it again is harmless.

insert into public.admins (user_id, email, role)
select id, lower(email), 'owner'
from auth.users
where lower(email) = lower('REPLACE-WITH-THE-OWNER-EMAIL@example.com')
on conflict (user_id) do update set role = 'owner';

-- Should list the owner:
select email, role, created_at from public.admins;
