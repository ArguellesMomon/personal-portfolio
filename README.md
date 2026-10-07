# Richmond Arguelles — portfolio

A responsive React portfolio with forest green and warm cream branding, separate pages, project case studies, and light/dark/system themes.

## Run locally

```sh
npm install
npm run dev
```

On Windows PowerShell with restricted script execution, use `npm.cmd` instead of `npm`.

```sh
npm run build
npm run preview
```

## Content

- `src/data/profile.js`: email, LinkedIn, GitHub, education, and optional résumé URL. Add the actual PDF under `public/` and set `resume: '/resume.pdf'` when available.
- `src/data/projects.json`: project descriptions, roles, technology stacks, screenshots, repository links, and live URLs. Blank fields are omitted. Add screenshots through `image` and descriptive `imageAlt` values.
- `src/data/achievements.json`: credentials and milestones. Only entries with a title are published; blank starter entries remain hidden.
- `src/data/skills.js`: toolkit categories and skills.

Seven projects use actual screenshots: AedesCapella (a committed dashboard screenshot), MedTech Mate, Momento, Pickle Batangas, Pinoy Recipe Finder, StudySpot PH, and C4A Hub (public deployments). Image sources are stored in the project data and linked on detail pages. Projects without a verified screenshot retain explicitly labeled HTML/CSS concepts.

Public GitHub repositories and deployments were reviewed on 7 October 2026. The collection includes twelve projects; smaller course exercises and duplicate portfolio repositories are omitted. Existing project routes are preserved. Travel Diary is categorized as mobile and the AedesCapella dashboard stack reflects its React/Supabase repository.

## Pages and interactions

- `/`: introduction and selected projects.
- `/projects`: search, category filters, sorting, grid/list view, and accessible project previews. Search/filter/sort state is saved in the URL.
- `/projects/:projectId`: individual project narrative and share-link copying.
- `/about`: background, approach, areas of practice, and toolkit.
- `/contact`: inline message submission, public email, and supplied social profile URLs.
- `/achievements`: education and populated credentials.
- Unknown URLs: a recovery page with navigation back into the site.

Theme preference persists locally and supports the OS preference. Motion respects `prefers-reduced-motion`; native dialogs support Escape, focus trapping, and an inert background.

## Texture, depth, and motion

The forest and cream visual system includes paper grain, original SVG contour lines, a fine dot pattern, slowly drifting light, layered shadows, and textured contact panels. The hero has staggered text, a drawn underline, floating notes, and gently moving portrait orbits. Project and practice cards respond to a mouse with a small perspective tilt and a soft highlight; screenshots zoom slightly on hover. Lower sections reveal as they enter the viewport, and a slim bar indicates reading progress.

The header’s pause/resume button saves the visitor’s motion preference in `portfolio-motion`. System reduced-motion settings take priority. Texture and depth remain visible when animations are paused. Pointer effects are disabled on touch devices; continuous hero motion pauses when the portrait leaves the viewport, and animations pause in hidden tabs. Pointer updates are batched with `requestAnimationFrame` and do not rerender React components. No animation library or remote texture is required.

- `src/styles/immersive.css`: material, lighting, depth, and motion.
- `src/components/portfolio/SiteAtmosphere.jsx`: contours, reading progress, and pointer interactions.
- `src/components/portfolio/MotionContext.jsx`: persistent motion preference and OS support.
- `public/textures/paper-grain.svg`: locally served, static grain texture.

## Contact delivery

The form uses [FormSubmit AJAX](https://formsubmit.co/ajax-documentation) to deliver messages to `arguellesrichmond@gmail.com` without opening the visitor’s email application. The `email` field lets Richmond reply to the sender. It includes required-field/email validation, a hidden honeypot, duplicate-submit prevention, a 20-second timeout, and feedback. Failed submissions keep the visitor’s input for retry. No API key or Gmail password is needed in this repository.

FormSubmit requires the recipient to click a one-time activation email before delivery works. Check Gmail (including Spam) for the activation email after the first submission, activate the form, and submit another message to verify receipt. Service acceptance alone does not confirm delivery to Gmail. If the destination changes, activate the new address as well. An email link remains available if the third-party service is unavailable.

## Validation and maintenance

```sh
npm test
npm run format:check
npm run assets
```

The browser tests cover project filtering and recovery, preserving filters when returning from a project, keyboard dialogs, sharing, theme persistence/system mode, mobile navigation, screenshot loading/source links, form validation/success/failure/retry, motion preferences, touch navigation, offscreen animation pausing, reading progress, accessibility in both themes, and overflow at 320, 390, 768, 1024, and 1440 pixels. Contact tests mock FormSubmit and send no visitor emails. Screenshots are saved under the ignored `test-results/` directory.

Tests and asset generation use installed Microsoft Edge on Windows. On other systems, run `npx playwright install chromium` first, or set `PLAYWRIGHT_CHANNEL` to an installed supported browser.

`npm run assets` recreates the social preview and favicon files from code. Fonts are bundled locally. Vite 8 requires Node 20.19+ or 22.12+; Node 24 is used in this workspace.

`node scripts/review-github.mjs` refreshes the public repository review under ignored `.cache/project-review/`. `node scripts/capture-projects.mjs` refreshes the six public website screenshots under `public/projects/`; inspect them after capture because deployment content can change. Set `CAPTURE_PROJECT` to a project ID to refresh just one. These maintenance scripts use public pages and do not sign in or request camera/location permissions. AedesCapella’s image comes from its repository and is maintained separately.

## Hosting

`vercel.json` rewrites routes to `index.html` so direct links and refreshes work on Vercel. For another host, configure an equivalent SPA fallback. Set absolute social image URLs and your canonical domain once the deployment URL is confirmed.
