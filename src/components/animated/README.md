# Animated Components

This folder is for isolated external or custom animated components.

## Purpose

Place animation-first components here before wiring them into the page sections. This keeps motion code separate from core app logic and makes it easier to review, test, or remove later.

Typical sources include:

- 21st.dev snippets
- animejs-based experiments
- Framer-style component patterns
- custom animation prototypes

## Rules

- One component per file.
- Do not paste large external animation code directly into `Home.jsx` or `App.jsx`.
- Keep animated components isolated in this folder.
- Target sections should import animated components from here.
- Do not modify Supabase, auth, admin, or storage logic when adding animations.
- Test `npm run build` after each component.
- Commit after each successful integration.

## Naming Examples

- `AnimatedHero.jsx`
- `AnimatedProjectCardShell.jsx`
- `FocusBentoAnimation.jsx`
- `LearningOrbit.jsx`

## Dependency Notes

If a component needs extra packages, document that need before installing anything.

Common candidates:

- `animejs`
- `gsap`
- `three`
- `framer-motion`

Avoid installing unnecessary dependencies. Keep animation work focused and incremental.
