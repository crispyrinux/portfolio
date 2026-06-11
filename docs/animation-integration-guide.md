# Animation Integration Guide

This guide defines a safe workflow for adding animations and external visual components to the Futuristic Backend Lab Portfolio CMS after the core system is stable.

## Purpose

Animations should be added only after the main portfolio, hidden admin CMS, Supabase integration, authentication, CRUD, storage, and deployment foundation are stable.

Animations are a visual layer only. They must not affect:

- Supabase data fetching
- Admin authentication
- Protected admin routes
- Project CRUD
- Archive/restore/delete behavior
- Storage upload logic
- Deployment configuration

## Safe Workflow

Use this sequence for every animation or external component:

1. Choose one section.
2. Choose one animation or component.
3. Paste or adapt the external code into a dedicated component file.
4. Integrate that component into the target section.
5. Test locally with:

```bash
npm run dev
```

6. Test the production build with:

```bash
npm run build
```

7. Commit the working change.
8. Continue to the next animation only after the previous one is stable.

## Recommended Integration Pattern

Keep animation code isolated inside focused component files.

Example for a Hero animation:

```txt
src/components/ui/AnimatedHero.jsx
```

Then import it into:

```txt
src/components/sections/Hero.jsx
```

This keeps section files readable and makes it easier to remove or replace one animation without touching unrelated app logic.

## Avoid Large Direct Patches

Do not paste huge animation code directly into these files unless specifically necessary:

- `src/pages/Home.jsx`
- `src/App.jsx`
- `src/pages/ProjectDetail.jsx`
- `src/pages/AdminDashboard.jsx`

Prefer dedicated components under:

```txt
src/components/ui/
```

or, if the animation is section-specific:

```txt
src/components/sections/
```

## Dependency Checklist

Before integrating external code, check whether it requires additional packages such as:

- `framer-motion`
- `animejs`
- `gsap`
- `three`
- `lucide-react`
- `clsx`
- `tailwind-merge`
- Other package-specific dependencies

Install only the dependencies required for the current animation task. Do not add multiple animation libraries at once unless explicitly requested.

## Integration Rules

- Add one animation per task.
- Do not integrate multiple external components at once.
- Do not touch Supabase logic.
- Do not touch auth logic.
- Do not touch admin routes.
- Do not touch project CRUD.
- Do not touch storage logic.
- Do not expose an admin link in the public UI.
- Do not add Login or Dashboard links to the public UI.
- Do not animate the admin dashboard heavily.
- Keep admin UI clean, functional, and stable.

## Performance Notes

- Avoid heavy animations in every section.
- Use subtle reveal effects for normal content sections.
- Reserve cinematic animation for the Hero or selected showcase sections.
- Keep mobile performance in mind.
- Avoid animations that block interaction or delay content visibility.
- Check that text remains readable and layout remains stable on mobile and desktop.

## Rollback Advice

Commit after each successful animation integration.

If an animation breaks the build or causes layout issues:

1. Revert only the animation commit.
2. Keep Supabase, auth, CRUD, storage, and deployment code untouched.
3. Re-test with `npm run build`.

Keeping external components isolated makes rollback safer and prevents visual experiments from affecting the CMS foundation.

## Example Future Sources

This workflow can be used later for components inspired by:

- 21st.dev
- Anime.js examples
- Framer Motion examples
- Three.js visual experiments
- Custom Tailwind-based animated UI components

Each external component should still follow the same rule: isolate it, test it, build it, commit it, then move on.
