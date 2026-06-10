# GitHub OAuth Setup Guide

This guide explains the manual GitHub OAuth setup for the hidden admin login in the Futuristic Backend Lab Portfolio CMS.

No app code is implemented by this guide. Admin login UI, protected routes, CRUD, storage, and dashboard access checks will be added in later tasks.

## 1. Purpose

GitHub OAuth will be used only for the hidden admin login.

Public visitors do not need to log in. They should only see the public portfolio experience.

The admin route is accessed manually by typing `/admin` in the browser.

The public UI must not contain:

- Admin links
- Login links
- Dashboard links
- visible or hidden links to `/admin`

## 2. Create A GitHub OAuth App

Create a GitHub OAuth App from GitHub Developer Settings.

Use these local development values:

```text
Application name: Portfolio Lab Local
Homepage URL: http://localhost:5173
Authorization callback URL: https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
```

The authorization callback URL should use the Supabase Auth callback URL, not the local `/admin` route.

After creating the OAuth App, GitHub will provide:

- Client ID
- Client Secret

Keep the Client Secret private.

## 3. Enable GitHub Provider In Supabase

In the Supabase Dashboard:

1. Open the project.
2. Go to Authentication.
3. Open Providers.
4. Select GitHub.
5. Enable the GitHub provider.
6. Paste the GitHub OAuth Client ID.
7. Paste the GitHub OAuth Client Secret.
8. Save the provider settings.

The Client Secret belongs in Supabase provider settings only. Do not put it in frontend code.

## 4. Configure Supabase Redirect URLs

In Supabase Authentication settings, add local redirect URLs for development:

```text
http://localhost:5173/admin
http://localhost:5173/admin/dashboard
```

Production redirect URLs will be added later after Vercel deployment.

Expected production examples:

```text
https://your-vercel-domain.vercel.app/admin
https://your-vercel-domain.vercel.app/admin/dashboard
https://your-custom-domain.com/admin
https://your-custom-domain.com/admin/dashboard
```

Only add production URLs when those domains are ready.

## 5. Security Model

GitHub login only authenticates identity.

GitHub login alone does not mean the user is an admin.

Admin permission is controlled by the `admin_profiles` table.

Only the Supabase Auth `user_id` listed in `public.admin_profiles.user_id` should be allowed to access the admin dashboard.

Other GitHub users must be denied, even if they authenticate successfully.

This is why the project uses a single-admin whitelist instead of treating every authenticated user as an admin.

## 6. First Login Flow

This flow applies after the admin login UI is implemented in a later task.

1. Open `/admin` manually in the browser.
2. Log in with GitHub.
3. Supabase creates an authenticated user.
4. Open Supabase Dashboard.
5. Go to Authentication.
6. Open Users.
7. Copy your Supabase Auth user ID.
8. Insert that user ID into `public.admin_profiles`.

The initial admin insert should be done manually by the project owner from the Supabase SQL Editor.

## 7. Insert Initial Admin Profile

Use this SQL template after you have copied your Supabase Auth user ID:

```sql
insert into public.admin_profiles (user_id, email, github_username, role)
values (
  'YOUR_SUPABASE_AUTH_USER_ID',
  'your_email@example.com',
  'your_github_username',
  'owner'
);
```

Replace every placeholder before running the SQL.

Do not insert unknown users into `admin_profiles`.

## 8. Warnings

- Do not commit the GitHub Client Secret.
- Do not expose secrets in frontend code.
- Do not use a Supabase service role key in frontend code.
- Do not allow every authenticated user to act as admin.
- Do not add admin, login, or dashboard links to the public UI.
- Keep admin access protected by both route checks and Supabase RLS in future tasks.
