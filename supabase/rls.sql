-- Futuristic Backend Lab Portfolio CMS Row Level Security policies.
-- Run this after supabase/schema.sql.

-- Enable Row Level Security on all CMS tables.
alter table public.projects enable row level security;
alter table public.project_screenshots enable row level security;
alter table public.admin_profiles enable row level security;

-- Helper used by admin policies.
-- A user is an admin only when their auth.uid() exists in public.admin_profiles.user_id.
-- This does not grant admin access to every authenticated user.
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
drop policy if exists "Public can read non-archived projects" on public.projects;
drop policy if exists "Admins can read all projects" on public.projects;
drop policy if exists "Admins can insert projects" on public.projects;
drop policy if exists "Admins can update projects" on public.projects;
drop policy if exists "Admins can delete projects" on public.projects;

drop policy if exists "Public can read screenshots for non-archived projects" on public.project_screenshots;
drop policy if exists "Admins can read all project screenshots" on public.project_screenshots;
drop policy if exists "Admins can insert project screenshots" on public.project_screenshots;
drop policy if exists "Admins can update project screenshots" on public.project_screenshots;
drop policy if exists "Admins can delete project screenshots" on public.project_screenshots;

drop policy if exists "Admins can read admin profiles" on public.admin_profiles;

-- Public project reads.
-- Anyone can read visible, non-archived portfolio projects.
create policy "Public can read non-archived projects"
on public.projects
for select
using (is_archived = false);

-- Admin project management.
-- Only users whitelisted in admin_profiles can read archived projects or mutate project rows.
create policy "Admins can read all projects"
on public.projects
for select
using (public.is_admin());

create policy "Admins can insert projects"
on public.projects
for insert
with check (public.is_admin());

create policy "Admins can update projects"
on public.projects
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete projects"
on public.projects
for delete
using (public.is_admin());

-- Public project screenshot reads.
-- Anyone can read screenshots only when the related project is not archived.
create policy "Public can read screenshots for non-archived projects"
on public.project_screenshots
for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_screenshots.project_id
      and projects.is_archived = false
  )
);

-- Admin project screenshot management.
-- Only whitelisted admins can read or mutate screenshot rows.
create policy "Admins can read all project screenshots"
on public.project_screenshots
for select
using (public.is_admin());

create policy "Admins can insert project screenshots"
on public.project_screenshots
for insert
with check (public.is_admin());

create policy "Admins can update project screenshots"
on public.project_screenshots
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete project screenshots"
on public.project_screenshots
for delete
using (public.is_admin());

-- Admin profile reads.
-- Public reads are intentionally not allowed. Initial admin rows should be inserted manually by the project owner.
create policy "Admins can read admin profiles"
on public.admin_profiles
for select
using (public.is_admin());
