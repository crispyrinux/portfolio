# Futuristic Backend Lab Portfolio CMS - Project Rules

This document defines the development rules for the Futuristic Backend Lab Portfolio CMS. All future work should follow these rules unless explicitly changed by request.

## 1. General Project Rules

- Work only on the current requested task.
- Do not build the entire system at once.
- Do not add features that are not requested.
- Do not refactor unrelated files.
- Do not change architecture unless explicitly requested.
- Always keep the project simple, modular, and maintainable.

## 2. Public Website Rules

- The public website must never show an Admin button.
- The public website must never show a Login button.
- The public website must never show a Dashboard link.
- The public website must never contain a visible or hidden link to `/admin`.
- Visitors should only see the public portfolio experience.

## 3. Admin Rules

- The admin area will later be available only by manually typing `/admin`.
- Admin must later use GitHub login.
- Admin must later use a single-admin whitelist.
- Admin must later be protected by `ProtectedRoute`.
- Admin must later be protected by Supabase RLS.
- Do not implement admin auth until specifically requested.
- Do not create multi-user management unless specifically requested.
- Do not create role management unless specifically requested.

## 4. Project Data Rules

- Project title is the only required project field.
- All other project fields must be optional.
- A project without GitHub link is valid.
- A project without source code is valid if it is an academic, cloud, deployment, infrastructure, documentation, prototype, case study, or learning project.
- Project cards must use conditional rendering.
- Project detail pages must use conditional rendering.
- Never display empty labels or empty sections.

## 5. Data Source Rules

- Supabase will later be the main CMS data source.
- Local fallback data will later be used only if Supabase fails.
- Do not connect Supabase until specifically requested.
- Do not hardcode real project data as the main long-term source.

## 6. Security Rules

- Never use a Supabase service role key in frontend code.
- Never commit real API keys.
- Never expose secrets in source code.
- Environment variables must be used later for Supabase.
- Authentication and RLS must not be skipped later.

## 7. Design Rules

- Design style should be modern, futuristic, professional, premium, dark, and backend-focused.
- Main visual direction: black, charcoal, gray, white, subtle silver border, subtle blue/violet glow.
- Animations will be added later after core functionality is stable.
- Do not add heavy animations unless specifically requested.
- Admin dashboard should stay clean, functional, and not animation-heavy.

## 8. Development Rules

- After each task, explain which files were created or modified.
- Keep components separated and reusable.
- Use readable file and component names.
- Make sure the app can run without unfinished future features.
- Do not make the project depend on unavailable services during early setup.
