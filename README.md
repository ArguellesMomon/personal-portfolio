# Portfolio — Core v1

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Before you publish — placeholders to fill in

Search the codebase for `PLACEHOLDER` to find everything below.

- `index.html` — page title and meta description
- `src/components/Hero/Hero.jsx` — your name, `HERO_ROLE` (see note below),
  tagline, description, `SOCIAL_LINKS` (LinkedIn/Instagram URLs)
- `src/components/About/About.jsx` — intro paragraph, `EXPERTISE` tags, quote
- `src/components/shared/Navbar/Navbar.jsx` — brand text in the nav
- `src/components/shared/Footer/Footer.jsx` — LinkedIn URL, email
- `src/components/Contact/Contact.jsx` — email, LinkedIn URL, intro line
- `src/data/achievements.json` — real certifications (title/issuer/date/verifyUrl)
  and honors (title/description/date)
- `src/data/projects.json` — for each project: `role`, `problem`, `approach`,
  `challenges`, `outcome`, `links.github`, `links.live`, `imageAlt`
- `public/resume.pdf` — add your resume PDF here

## Theme: dark only, no toggle

Light mode and the toggle have been removed entirely — `useTheme`,
`ThemeToggle`, and the `[data-theme]` mechanism are gone. `variables.css` now
holds a single set of color tokens. Token names like `--color-signal` and
`--color-ember` are historical (from an earlier teal/amber concept) but the
values are the orange/black palette — renaming them wasn't worth the
find-and-replace risk across every component that references them.

## Backdrop: truly fixed page background

Your photo is no longer scoped to the Hero section — it's a genuinely
`position: fixed` background for the whole page now (`SiteBackdrop.jsx` in
`src/components/shared/`, rendered once in `App.jsx`, behind everything).
This replaced the earlier approach (a `position: sticky` backdrop inside an
oversized Hero section with a JS-driven opacity fade), which was creating
the large empty gap you saw — that whole mechanism, including the
`useHeroBackdropFade` hook, is gone.

How the "fade to black" illusion works now: the backdrop is always there,
unmoving, at the bottom of the stack. Hero has no background of its own, so
you see the photo behind it directly. About — the very next section — has a
gradient background instead of a solid one (`.section.about` in
`About.css`): transparent at its top, resolving to fully solid by 60% of the
way down. So as you scroll from Hero into About, the fixed photo gets
progressively covered by About's own background, and by the time you reach
Skills everything below is fully opaque as normal. No JS, no scroll listener
for this part — it's pure layering, which is also why the "gap" is gone:
sections now flow directly into each other with no artificial buffer height.

One side effect worth knowing: because the image never moves while content
scrolls over it, you get real parallax depth for free — that's most of what
was making the page feel flat before.

## Hero

- **Headline is now your name + role**, not a tagline. `HERO_ROLE` in
  `Hero.jsx` defaults to "Software Engineer" — a broader fit than "Web
  Developer" given the project mix (embedded ML, mobile, data science, not
  just web), but it's a one-line change if you want something else.
- Photo/crop responsiveness (16:9 desktop, 9:16 mobile via `<picture>`) and
  the vibrant/text-shadow-driven legibility approach are unchanged — they
  just live in `SiteBackdrop` now instead of `Hero`.
- **Staggered 3D entrance.** Each element (name, role, tagline, description,
  buttons, socials) fades/slides/tilts in on its own delay via `.hero__enter`
  and `--enter-delay`, using a slight `rotateX` so it settles into place
  rather than just fading — matching the depth treatment used everywhere
  else now (see "3D and motion" below).

## About (new)

Sits right after Hero — a short intro paragraph, a row of expertise tags,
and a pull-quote. This is the section the backdrop dissolves into as you
scroll. Content is placeholder; fill in `About.jsx`.

## 3D and motion

You said it felt static — a few changes aimed directly at that:

- **Real parallax** from the fixed backdrop (see above) — content moves,
  the photo doesn't.
- **Scroll-reveal now tilts, not just fades.** `.reveal` in `global.css`
  adds a `perspective()` + `rotateX` to the existing fade/slide/scale, so
  every section (About, Skills, Projects, Achievements, Contact) settles
  into place with a bit of dimensionality instead of a flat fade.
- **Project cards tilt toward your cursor** (`ProjectCard.jsx`) — a
  `perspective`/`rotateX`/`rotateY` transform tracks mouse position over
  each card in real time, on top of the existing lift-on-hover. This is the
  most "3D" single addition on the page; if you want that treatment
  somewhere else too (Achievement cards, Skill cards), it's the same
  pattern and easy to extend.
- Buttons lift and the primary button gets a soft orange glow on hover/focus.
- Project cards' hover shadow picked up a subtle orange-tinted ring.

All of this respects `prefers-reduced-motion` — reduced-motion users get the
end state instantly, no tilt/fade/lift animation.

"Mind-blowing" is subjective and there's a lot of directions this could
still go (parallax layers moving at different speeds, cursor-following glow,
scroll-linked color shifts) — this pass is a solid, tasteful baseline rather
than every possible effect. Point me at anything specific you want pushed
further.

## Data files: JSON, not JS

`src/data/projects.json` and `src/data/achievements.json` replaced the old
`.js` versions — pure data, easier to hand-edit, no risk of a stray JS syntax
error breaking the build. `skills.js` and `status.js` are still `.js` (not
asked to change, and skills' structure is simple enough that it wasn't worth
touching). One tradeoff: JSON can't hold comments, so the field-by-field
guidance that used to live at the top of those files now lives here instead
— see "Structure" below for what each field does.

## Structure

- **Projects and Achievements use a "Featured + View All" pattern.** Projects
  shows the first 4 entries in `projects.json` by default; "View All
  Projects" reveals the rest in place. Achievements works the same way once
  you have more than 4 entries.
- **Section eyebrows are numbered** (`01 — about`, `02 — skills`, etc.),
  matching actual page order.
- **Project fields:** `category` drives both the filter tag and the icon
  chip next to the title (`Embedded/Hardware`, `Web App`, `Mobile`, or
  `ML/Data`). `badge` is an optional highlight pill (e.g. "Thesis Project") —
  leave it off projects that don't need one. `problem` / `approach` /
  `challenges` / `outcome` / `role` show in the expanded case-study view.
- **Achievement fields:** either `issuer` + `verifyUrl` (renders a "Verify"
  link, for certifications) or a plain `description` (for honors/thesis-style
  entries that don't have a verification link).
- Contact section uses simple links only (email/GitHub/LinkedIn), no form.
- `src/data/status.js` exists for the "currently building" badge, a Phase 2
  item not rendered yet.
