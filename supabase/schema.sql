-- Futuristic Backend Lab Portfolio CMS database schema.
-- This file creates the base tables only. RLS policies are intentionally not included here.

create extension if not exists pgcrypto;

-- Stores public portfolio projects for the future CMS.
-- Only title is required; all descriptive and media fields are optional.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  short_description text null,
  overview text null,
  problem text null,
  solution text null,
  result text null,
  features text[] null,
  tech_stack text[] null,
  category text null,
  year integer null,
  thumbnail_url text null,
  github_url text null,
  demo_video_url text null,
  documentation_url text null,
  what_i_learned text null,
  is_featured boolean default false,
  display_order integer null,
  is_archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.projects is
  'Public portfolio projects for the CMS. Only title is required; all other project fields may be null.';

-- Stores optional screenshots for project detail pages.
-- This supports future storage/table integration without requiring screenshots for every project.
create table if not exists public.project_screenshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  image_url text not null,
  caption text null,
  display_order integer null,
  created_at timestamptz default now()
);

comment on table public.project_screenshots is
  'Optional project screenshots linked to public portfolio projects.';

-- Stores future admin profile metadata for a single-owner CMS flow.
-- Authentication, whitelist checks, and RLS policies will be added in separate tasks.
create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null,
  github_username text null,
  email text null,
  role text default 'owner',
  created_at timestamptz default now()
);

comment on table public.admin_profiles is
  'Future admin profile metadata for the hidden CMS. Auth and RLS are intentionally handled separately.';

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_is_archived_idx on public.projects (is_archived);
create index if not exists projects_is_featured_idx on public.projects (is_featured);
create index if not exists projects_display_order_idx on public.projects (display_order);
create index if not exists project_screenshots_project_id_idx on public.project_screenshots (project_id);
create index if not exists admin_profiles_user_id_idx on public.admin_profiles (user_id);

-- Keeps projects.updated_at current when a project row is edited.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;

create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();
