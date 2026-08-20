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
- `src/pages/ProjectsPage.jsx` — page intro line, and the document title set
  in its `useEffect` (both currently `[PLACEHOLDER: Your Name]`)
- `src/pages/AchievementsPage.jsx` — same, for the achievements page
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
- **Fixed a real alignment bug:** Hero's text never got the same
  `max-width: 1120px; margin: 0 auto;` wrapper every other section uses
  (`.section-inner` in `global.css`) to center itself on wide screens. It
  was instead sitting flush against `.hero`'s own padding edge, so on any
  viewport wider than roughly 1120px + padding, Hero's text started
  measurably further left than every section below it. `.hero__inner` in
  `Hero.css` now mirrors `.section-inner` exactly, so the left edge lines
  up everywhere regardless of viewport width. `.hero__content`'s own
  narrower `max-width: 680px` is unchanged — that's just the readable
  line-length for the text itself, unrelated to this fix.

## About (new)

Sits right after Hero — a short intro paragraph, icon-anchored expertise
items (same icon vocabulary as Projects' category chips: `Cpu`,
`Smartphone`, `LineChart`), and a pull-quote with a soft ambient glow behind
it. This is the section the backdrop dissolves into as you scroll. Content
is placeholder; fill in `About.jsx`.

## Depth and motion pass (creative-portfolio-design skill)

A comprehensive pass applying the skill's depth/motion principles site-wide.
Deliberately did **not** touch color tokens — kept the existing orange/black
palette as-is per your instruction.

- **Real elevation system.** The shared `.card` class (Skills, Achievements,
  Contact, About's expertise items) had no shadow before — completely flat.
  Now every card has a two-layer shadow (tight contact + soft ambient) at
  rest, deepening with a lift on hover. `.tag` pills got the same treatment
  at a smaller scale.
- **Per-card scroll stagger, not per-section.** Previously a whole grid
  revealed as one block. Now every section calls `useScrollReveal` twice —
  once for its header, once for its content — and individual cards are each
  their own `.reveal` child, so they cascade in one at a time (Skills'
  4 category cards, Achievements' cards, Contact's link cards, Projects'
  featured cards).
- **"View All" reveals now animate.** Cards revealed via the Projects/
  Achievements toggle didn't exist in the DOM until clicked, so the
  scroll-triggered `.reveal` mechanism couldn't catch them — they used to
  just pop in instantly. They now get `.card-enter` (a mount animation,
  `global.css`) with a slight stagger, since the section is already in view
  by the time someone clicks the toggle.
- **Category icons in Skills**, matching the icon-chip pattern already
  established in Projects/Achievements/Contact, so all four "list of things"
  sections read as one system.
- **Contact links got an icon chip** (previously a bare icon) for the same
  reason.
- **Fluid heading scale.** `--text-h2`/`--text-h3` in `variables.css` are
  now `clamp()`-based instead of fixed rem values, so headings scale more
  gracefully between phone and desktop.
- **A very faint film-grain layer** over the whole page (`body::after` in
  `global.css`, procedural SVG noise, no image asset) — ties into the
  "cinematic" direction. Kept deliberately subtle (3.5% opacity) so it never
  competes with text legibility.

**One real bug I found and fixed while doing this:** the cursor-tilt cards
(Projects, Achievements, as they were at the time) were setting an inline
`transform` style unconditionally, even at rest. Inline styles always beat
CSS classes regardless of specificity, so that inline value was silently
overriding the `.reveal` scroll-in animation's transform — cards would still
fade via opacity, but never actually slide into place like every other
section does. While tracking that down I found a second, subtler version of
the same class of bug: `.project-card`, `.achievements__item`,
`.contact__link`, and `.card` each declare their own `transition` property,
and `.reveal` does too — since `transition` is a single property (not
additive across rules), whichever rule wins the cascade completely replaces
the other rather than merging. A few of these were missing `opacity` in
their own list, which would've silently killed the fade for elements
matching both rules. Made each of these transition declarations
comprehensive so the outcome is correct regardless of which one technically
wins.

## Cursor interaction: spotlight, not tilt

The 3D cursor-tilt on Projects/Achievements cards read as more gimmicky than
premium, so it's gone — replaced with a cursor-tracked spotlight glow (the
kind of effect on Linear/Vercel/Stripe-style sites): a soft radial highlight
that follows your pointer within the card, revealed on hover. Extracted into
`useSpotlight` (`src/hooks/`) and applied to **every** card on the page now —
Projects, Achievements, Skills, Contact, and About's expertise items — so
the whole site shares one hover language instead of Projects/Achievements
being the only "fancy" section.

How it works: the hook writes the pointer's position straight to the card's
`--spotlight-x`/`--spotlight-y` CSS custom properties via a ref, bypassing
React state entirely. Setting state on every `mousemove` would trigger a
re-render per event — direct DOM writes stay smooth regardless of event
frequency. The glow itself is a `.card::before` radial gradient in
`global.css` reading those properties.

This also simplified the code: Skills, Contact, and About's expertise items
weren't individual components before (just inline `.map()` output), so they
couldn't hold their own hook state. Each is now a small extracted component
(`SkillGroup`, `ContactLink`, `ExpertiseItem`) — a few more lines, but it's
what let the spotlight (and the per-card scroll-reveal from the previous
round) apply consistently everywhere instead of only where a component
already existed.

## About → Skills transition: smoother fade

The gradient that dissolves the fixed backdrop into solid background
(`.section.about` in `About.css`) resolved to fully opaque by 60% of the
section's height — on a shorter viewport, or with compact content, that's
not much scroll distance, so the fade could complete fast enough to read as
abrupt rather than gradual. Two changes:

- The gradient now uses five stops instead of two/three, spread across
  nearly the section's full height (96%) instead of 60% — both a longer
  distance and a smoother curve.
- Added extra bottom padding to the section specifically to guarantee more
  scroll distance for the fade to resolve over, independent of how much
  actual placeholder/real content ends up in About.

I can't render this to confirm exactly how it reads now, so if it's still
not smooth enough once you see it live, the next lever (bigger change) would
be switching from a fixed-percentage CSS gradient to a JS scroll-position-driven
one for pixel-precise control regardless of content length — worth trying
the simpler fix first though.

## Navbar: fixed + glass

Since the last full delivery: Navbar switched from `position: sticky` to
`position: fixed`, with a translucent/blurred background (`backdrop-filter`)
instead of a solid one, so it reads as glass over whatever's behind it —
the photo in Hero, or a section further down. Because `fixed` removes it
from the page's normal flow, `Navbar.jsx` also renders an invisible spacer
right after itself so Hero's content doesn't start out hidden underneath it
— self-contained to the Navbar component, nothing else needed changing.

## Reload behavior

`main.jsx` now forces scroll-to-top on reload and disables the browser's
scroll-restoration — reloading always lands back at the actual top of the
page instead of wherever the browser thinks you were scrolled to.

## Data files: JSON, not JS

`src/data/projects.json` and `src/data/achievements.json` replaced the old
`.js` versions — pure data, easier to hand-edit, no risk of a stray JS syntax
error breaking the build. `skills.js` and `status.js` are still `.js` (not
asked to change, and skills' structure is simple enough that it wasn't worth
touching). One tradeoff: JSON can't hold comments, so the field-by-field
guidance that used to live at the top of those files now lives here instead
— see "Structure" below for what each field does.

## Routing: real pages now, not a single page

This was the biggest architectural change of the project. `react-router-dom`
is a dependency, and the site is genuinely three routes:

- **`/`** — everything that was already there (Hero → About → Skills →
  Projects → Achievements → Contact), living in `src/pages/Home.jsx`.
- **`/projects`** — a dedicated page (`src/pages/ProjectsPage.jsx`) listing
  every project, each using the same `ProjectCard` component as before —
  full case-study detail (Problem/Approach/Challenges/Outcome) lives here,
  expandable per card.
- **`/achievements`** — same pattern, for achievements/certifications
  (`src/pages/AchievementsPage.jsx`). `AchievementCard` was pulled out of
  `Achievements.jsx` into its own file (`AchievementCard.jsx`) so this page
  and the homepage preview both use the exact same component rather than
  two copies that could drift apart.

`App.jsx` is now a router shell: `SiteBackdrop`, `Navbar`, and `Footer` sit
outside `<Routes>` so they persist across all three pages rather than
remounting — the fixed photo backdrop in particular should never flicker
when you navigate between pages.

**Things this pulled in that are worth knowing about:**

- **`vercel.json`** — added a rewrite rule so Vercel serves `index.html`
  for any path. Without this, a direct visit or refresh on
  `yoursite.com/projects` (or `/achievements`) would 404, since there's no
  actual file at that path on the server — the router only handles it
  client-side after `index.html` has loaded.
- **`useScrollToHash`** (`src/hooks/`) — browsers auto-scroll to a URL's
  `#hash` on a full page load, but not after a client-side route change.
  Without this, clicking "About" while on `/projects` would navigate to
  `/#about` correctly but never actually scroll there. This hook watches
  the route/hash and scrolls manually whenever either changes.
- **Navbar links now point at `/#id`** (an absolute path) instead of a bare
  `#id`. A bare hash resolves relative to whatever page you're currently
  on — from `/achievements`, `href="#about"` would try to find `#about` on
  the *achievements* page (which doesn't exist) rather than taking you back
  to `/`. The nav's active-highlight logic also checks which route you're
  on via a small `PAGE_ROUTES` map (`Navbar.jsx`) — it forces "Projects" or
  "Achievements" to show active on their own dedicated pages, since the
  scroll-based `IntersectionObserver` highlighting only makes sense on the
  home page (there's nothing to observe on a page with no anchored
  sections). Adding another page like this later just means adding one more
  entry to that map, not new logic.

## Homepage Projects: a plain grid, matching Achievements

The fan-on-desktop / carousel-on-mobile pair from the previous round is
gone entirely — after seeing it built, the fan read as inconsistent with
the rest of the site (nothing else uses overlapping, rotated cards), so
this section now uses the exact same plain grid pattern as Achievements
instead. No more separate desktop/mobile components, no shuffle animation,
no active/inactive card state — every card just always shows its own full
content.

- **Which 3 are featured** is still just array order — `data/projects.json`
  has AedesCapella, IRIS, and King Ace Trading Capstone (thesis, team
  project, capstone) first. The selection lives in `data/featuredProjects.js`
  (`projects.slice(0, 3)`); reordering the JSON array is still the only
  thing you need to touch to change the featured set.
- **The grid uses Achievements' exact breakpoints** — 1 column below 640px,
  2 at 640px, 3 at 1024px — on purpose, so the two sections behave
  identically instead of Projects having its own one-off responsive logic.
  Card component (`FeaturedProjectCard`) lives directly in `Projects.jsx`,
  the same way `AchievementCard` lives in `Achievements.jsx`.
- **Descriptions are always visible** — no click-to-reveal, no "active"
  state to be in first. Card content also flexes so the Code/Live buttons
  line up at the same height across all 3 cards regardless of how long
  each project's description happens to be.
- **Category icons are still shared** — `categoryIcons.js` is one map used
  by both `ProjectCard` (on `/projects`) and this section's cards.
- **Still no app-store badges**, same reasoning as before — only one of
  your 8 projects (Eventure) is an actual published app, so this uses the
  same Code/Live link pattern as the rest of the site.

## Structure

- **Achievements now works exactly like Projects** — the homepage section
  shows a preview (first 4 entries in `achievements.json`) with "View All
  Achievements" linking to the dedicated `/achievements` page, instead of
  expanding the list in place. Same reasoning as Projects (see "Homepage
  Projects" above): keeps the homepage from getting long, and gives
  achievements/certifications a real, linkable, bookmarkable page.
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
