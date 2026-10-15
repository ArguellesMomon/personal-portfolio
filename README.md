# Richmond Arguelles — portfolio

A React portfolio for web, mobile, and embedded systems work. The site uses self-hosted Inter typography, a restrained green palette, and light/dark/system themes.

Static paper grain, fading drafting grids, and a small certificate-section hatch add texture to the background. Patterns adapt to each theme, stay behind content, and disappear in forced-colors and print modes. The grain is a small local SVG; no external assets or animation are needed.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
```

Use `npm.cmd` or `npx.cmd` in Windows PowerShell if script execution is restricted.

## Pages

- `/`: introduction, background and capabilities, three featured projects, two certificate highlights, and direct contact links. A layered portrait, floating cube, section reveals, and interactive perspective add depth. Continuous hero effects pause offscreen and in hidden tabs.
- `/projects`: thirteen projects with search, category, technology, and live-demo filters. Filters persist in the URL and when returning from a case study.
- `/projects/:id`: purpose, implementation, technical focus, contribution, technologies, and available demo/source links. Screenshots support enlargement and actual-size viewing. Previews and account requirements are labeled.
- `/about`: background, education, and demonstrated technical skills.
- `/achievements`: eighteen certificates and academic records with search, category filters, original documents, downloads, and a keyboard-accessible viewer.
- `/contact`: public email/social links and a contact form with validation, draft recovery, delivery feedback, and an email-app fallback.

The interface uses direct navigation and project links. Homepage summaries lead to full project, about, certificate, and contact pages. Certificate highlights link to their original documents. Keyboard focus, skip navigation, mobile menus, accessible dialogs, reduced-motion preferences, and theme persistence are supported.

On phones (up to 560px), featured projects use a compact native horizontal scroll row with snap points and a next-card preview. Descriptions stay on the project collection and detail pages, while homepage phone cards show the image, title, technologies, and links. Visitors can swipe or use the keyboard arrows while the row is focused. Desktop and tablet layouts retain their grid and descriptions. Keyboard scrolling follows the shared motion preference; the row never advances automatically. Project back links return to the referring page, preserving collection filters or the homepage section; directly opened projects fall back to the collection.

The portrait, project cards, and homepage certificate previews gently tilt toward a mouse pointer. Foreground layers and a moving highlight create depth through CSS perspective, without a rendering dependency. Touch screens keep stable surfaces, and keyboard focus settles tilted cards. The homepage and footer motion controls share one saved preference across routes; system reduced motion takes priority. Tilt resets when scrolling, changing routes, or leaving the window. Pointer updates share one event listener and only schedule a frame when needed.

## Content

- `src/data/profile.js`: identity, education, public contact links, and optional résumé URL. Add a real PDF under `public/` before enabling the résumé link.
- `src/data/projects.json`: project descriptions, contributions, technologies, screenshots, source attribution, and live URLs. Preserve IDs to keep shared project links working.
- `src/data/skills.js`: technologies demonstrated in the project collection.
- `src/data/achievements.json`: supplied certificate metadata. Original files live in `src/Certificates/`; previews live in `public/certificates/previews/`.

All 25 public GitHub repositories were reviewed on 14 October 2026. The collection includes Pocket Quest; smaller coursework, personal gift pages, and duplicate portfolios remain outside the curated collection. See [repository coverage](docs/github-review.md).

Nine projects have real screenshots. Seven deployment screenshots were refreshed on 14 October. Pocket Quest uses a labeled repository preview with sample progress; AedesCapella shows its public operator sign-in. Projects without screenshots display a clearly labeled placeholder. Source attribution is available on each case study.

## Validation and maintenance

```sh
npm test
npm run format:check
npm run assets
node scripts/review-github.mjs
node scripts/capture-projects.mjs
```

Tests cover project discovery and filters, direct navigation, every screenshot and original certificate, keyboard dialogs, accessibility in both themes, mobile layouts from 320 pixels, theme persistence, pointer depth, keyboard and touch behavior, saved motion preferences, and contact success/failure/retry. Contact delivery is mocked in tests; no visitor emails are sent.

Browser tests and asset generation use Microsoft Edge on Windows. Elsewhere, install Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHANNEL` to an installed supported browser. Vite 8 requires Node 20.19+ or 22.12+.

The repository review script discovers all public repositories with pagination, including nested apps. It saves review evidence under ignored `.cache/project-review/`. The screenshot script reads the reviewed URLs from the project data. Set `CAPTURE_PROJECT` to refresh one project; inspect captures before committing. The scripts do not sign in or request camera/location access.

## Contact delivery

Messages are submitted through [FormSubmit AJAX](https://formsubmit.co/ajax-documentation) to `arguellesrichmond@gmail.com`. The service requires the recipient to activate the form through its one-time activation email. A successful service response does not independently confirm inbox delivery.

Drafts stay in `sessionStorage` for the current browser tab and clear after submission or the Clear draft action. Failed requests retain the message and offer a prefilled email link. The form includes a honeypot, duplicate-submit prevention, and a 20-second timeout. No private credentials are stored in this repository.

## Hosting

Vercel builds with `npm run build` and serves `dist`. `vercel.json` preserves direct SPA routes. The site is deployed from the existing GitHub repository; other hosts need an equivalent route fallback.
