# Vercel Deployment Guide

This guide explains how to deploy the Futuristic Backend Lab Portfolio CMS to Vercel.

## 1. Prerequisites

Before deploying, make sure:

- the GitHub repository already exists
- the project builds locally with `npm run build`
- the Supabase project already exists
- the Supabase environment values are ready
- GitHub OAuth works locally if admin auth is needed

## 2. Import The Project To Vercel

1. Go to Vercel.
2. Import the GitHub repository.
3. Choose `Vite` as the framework preset.
4. Set the build command to:

```bash
npm run build
```

5. Set the output directory to:

```text
dist
```

## 3. Vercel Environment Variables

Add these environment variables in Vercel Project Settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Use the same values as your local environment.

Do not use the Supabase service role key.

## 4. Deploy

1. Trigger the deployment in Vercel.
2. Check the build logs.
3. Open the generated Vercel URL.

## 5. Supabase Auth Redirect Update

After deployment, add these URLs to Supabase Auth settings:

- `https://your-vercel-domain.vercel.app/admin`
- `https://your-vercel-domain.vercel.app/admin/dashboard`

If you later use a custom domain, also add:

- `https://your-custom-domain.com/admin`
- `https://your-custom-domain.com/admin/dashboard`

## 6. GitHub OAuth App Update

If needed, update the GitHub OAuth App homepage URL to the production domain.

The Authorization callback URL should remain the Supabase auth callback URL.

## 7. Production Testing Checklist

After deployment, verify:

- the public homepage loads
- projects load from Supabase or fallback data
- `/admin` opens manually
- GitHub login works
- the admin dashboard works only for the whitelisted admin
- non-admin users cannot access the dashboard
- image thumbnails load
- screenshots load
- archived projects do not appear publicly

## 8. Security Warnings

- Do not expose the service role key
- Do not commit `.env.local`
- Do not show any admin link in the public UI
- Do not print secrets in logs
