-- Futuristic Backend Lab Portfolio CMS Supabase Storage policies.
-- Run this after:
-- 1. supabase/schema.sql
-- 2. supabase/rls.sql
-- 3. creating the Storage buckets:
--    - project-thumbnails
--    - project-screenshots

-- Storage policies target Supabase's built-in storage.objects table.
-- Public read is allowed for portfolio media, but writes are admin-only.
-- RLS is already enabled on Supabase Storage's managed objects table, so we only create policies here.

-- Helper used by Storage policies.
-- A user is an admin only when their auth.uid() exists in public.admin_profiles.user_id.
-- This does not grant write access to every authenticated user.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Keep this script re-runnable by replacing policies.
drop policy if exists "Public can read project media" on storage.objects;
drop policy if exists "Admins can upload project media" on storage.objects;
drop policy if exists "Admins can update project media" on storage.objects;
drop policy if exists "Admins can delete project media" on storage.objects;

-- Public read policy.
-- Anyone can read files from the portfolio media buckets so thumbnails and screenshots can display publicly.
create policy "Public can read project media"
on storage.objects
for select
using (
  bucket_id in ('project-thumbnails', 'project-screenshots')
);

-- Admin upload policy.
-- Only users whitelisted in admin_profiles can upload files to the project media buckets.
create policy "Admins can upload project media"
on storage.objects
for insert
with check (
  bucket_id in ('project-thumbnails', 'project-screenshots')
  and public.is_admin()
);

-- Admin update policy.
-- Only users whitelisted in admin_profiles can replace or move files inside the project media buckets.
create policy "Admins can update project media"
on storage.objects
for update
using (
  bucket_id in ('project-thumbnails', 'project-screenshots')
  and public.is_admin()
)
with check (
  bucket_id in ('project-thumbnails', 'project-screenshots')
  and public.is_admin()
);

-- Admin delete policy.
-- Only users whitelisted in admin_profiles can delete files from the project media buckets.
create policy "Admins can delete project media"
on storage.objects
for delete
using (
  bucket_id in ('project-thumbnails', 'project-screenshots')
  and public.is_admin()
);
