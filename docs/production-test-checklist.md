# Production Test Checklist

Use this checklist before and after deployment to verify the Futuristic Backend Lab Portfolio CMS.

## 1. Local Build Tests

- [ ] `npm install`
- [ ] `npm run dev`
- [ ] `npm run build`
- [ ] `npm run preview`

## 2. Public UI Tests

- [ ] Homepage loads.
- [ ] Navbar has no Admin, Login, or Dashboard link.
- [ ] Hero section loads.
- [ ] ProjectLab loads.
- [ ] FeaturedProjects loads.
- [ ] Contact section loads.
- [ ] Responsive mobile layout works.

## 3. Project Data Tests

- [ ] Supabase data loads if available.
- [ ] `fallbackProjects` load if Supabase fails.
- [ ] Project with only title renders.
- [ ] Project without GitHub renders.
- [ ] Project without thumbnail uses placeholder.
- [ ] Project without screenshots does not show screenshot section.
- [ ] Archived projects do not show publicly.

## 4. Project Detail Tests

- [ ] Valid slug works.
- [ ] Invalid slug shows not found.
- [ ] Optional fields are conditional.
- [ ] Screenshots show only if available.

## 5. Admin Auth Tests

- [ ] `/admin` can be opened manually.
- [ ] Public UI does not link to `/admin`.
- [ ] GitHub login works.
- [ ] Non-admin user is denied.
- [ ] Admin user can access dashboard.
- [ ] Logout works.
- [ ] Protected routes reject unauthenticated users.

## 6. Admin CMS Tests

- [ ] Create project with title only.
- [ ] Create project with optional fields.
- [ ] Edit project.
- [ ] Clear optional fields.
- [ ] Archive project.
- [ ] Restore project.
- [ ] Delete archived project permanently.
- [ ] Upload thumbnail.
- [ ] Upload screenshots.
- [ ] Delete screenshot record.

## 7. Storage Tests

- [ ] Thumbnail appears publicly.
- [ ] Broken or missing thumbnail fallback works.
- [ ] Screenshots appear in detail.
- [ ] Project without media remains clean.

## 8. GitHub Actions Tests

- [ ] Keep-alive workflow exists.
- [ ] GitHub Secrets exist.
- [ ] Manual workflow run works.
- [ ] Secrets are not printed.

## 9. Vercel Tests

- [ ] Environment variables are set.
- [ ] Build passes on Vercel.
- [ ] Public URL opens.
- [ ] Supabase Auth redirect URLs updated.
- [ ] `/admin` works in production.
- [ ] GitHub OAuth works in production.

## 10. Security Tests

- [ ] `.env.local` is not committed.
- [ ] Service role key is not used in frontend.
- [ ] RLS is enabled.
- [ ] `admin_profiles` controls admin access.
- [ ] Public UI has no admin link.
