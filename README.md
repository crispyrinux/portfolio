# Futuristic Backend Lab Portfolio CMS

A futuristic backend-focused portfolio with a hidden admin CMS powered by React, Tailwind CSS, Supabase, and Vercel.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Supabase
- Supabase Auth
- Supabase Database
- Supabase Storage
- Vercel
- GitHub Actions

## Features

- Public portfolio
- Project Lab
- Project detail pages
- Hidden `/admin` route
- GitHub admin login
- Single-admin whitelist
- Project CRUD
- Archive, restore, delete
- Thumbnail upload
- Screenshot upload
- Supabase fallback local data
- GitHub Actions keep-alive

## Important Rule

- The public UI does not contain any admin link.
- The admin route is accessed manually through `/admin`.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local `.env.local` file.
3. Run the app:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Use the public Supabase key value for your local setup. Keep the value aligned with the existing app configuration and setup docs.

## Supabase Setup Docs

- [Supabase Setup Guide](supabase/setup-guide.md)
- [GitHub OAuth Setup](supabase/github-oauth-setup.md)
- [First Admin Setup](supabase/first-admin-setup.md)
- [Storage Setup Guide](supabase/storage-setup-guide.md)

## Deployment Docs

- [Vercel Deployment Guide](docs/vercel-deployment.md)
- [Keep-Alive Setup](docs/keep-alive-setup.md)

## Security Notes

- Do not commit `.env.local`.
- Do not use the service role key in frontend code.
- Use RLS.
- Only users listed in `admin_profiles` can access the admin CMS.

## Development Note

Animations and external components are added later after the core system is stable.
