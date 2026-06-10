# Supabase Setup Guide

This guide explains the manual Supabase setup for the Futuristic Backend Lab Portfolio CMS.

No real secrets should be committed to this repository. Admin login, GitHub OAuth, storage, CRUD, and `admin_profiles` setup will be handled in later tasks.

## 1. Create A Supabase Project

1. Go to the Supabase dashboard.
2. Create a new project.
3. Choose an organization, project name, database password, and region.
4. Wait for the project to finish provisioning.

## 2. Get Project Credentials

In the Supabase dashboard:

1. Open the project.
2. Go to Project Settings.
3. Open API.
4. Copy the Project URL.
5. Copy the anon key or publishable key.

Use only the anon or publishable key in frontend code.

Never use the service role key in the frontend.

## 3. Create `.env.local`

Create a local file named `.env.local` in the project root.

Use placeholder format like this:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
```

Current project note: the existing app wrapper reads `VITE_SUPABASE_PUBLISHABLE_KEY`, matching `.env.example`.

For the app to connect with the current code, use:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
```

Do not commit `.env.local`. It should stay ignored by Git.

## 4. Security Rules

- Never use a Supabase service role key in frontend code.
- Never commit `.env.local`.
- Never commit real API keys.
- Keep local environment files ignored by Git.
- Use Supabase RLS before relying on live project data.

## 5. Run Database SQL

Run the SQL files manually in the Supabase SQL Editor.

Run them in this order:

1. `supabase/schema.sql`
2. `supabase/rls.sql`

`schema.sql` creates the database tables, indexes, and the `updated_at` trigger.

`rls.sql` enables Row Level Security and creates public read policies plus admin-only management policies.

## 6. Verify Tables

After running `schema.sql`, check the Table Editor for:

- `projects`
- `project_screenshots`
- `admin_profiles`

The `projects` table should require only `title`. Other project fields may be left empty.

## 7. Test Public Read

To test public project reads:

1. Open the `projects` table in Supabase.
2. Add a temporary test project manually.
3. Set `title` to any safe placeholder title.
4. Make sure `is_archived` is `false`.
5. Save the row.

Public reads should only return projects where `is_archived = false`.

Screenshots should only be publicly readable when their related project is not archived.

## 8. Admin Setup Later

Admin login is not implemented yet.

Future tasks will handle:

- GitHub login
- single-admin whitelist
- inserting or managing the initial `admin_profiles` row
- protected admin routes
- admin CRUD screens

Do not add random users to `admin_profiles`.

## 9. Fallback Behavior

If Supabase is not ready, missing environment variables, or the database table is unavailable, the app should continue using `fallbackProjects`.

This keeps the public portfolio usable during early setup and development.
