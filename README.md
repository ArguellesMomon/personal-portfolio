# Richmond Arguelles — portfolio

A React portfolio for web, mobile, games, embedded systems, and software QA work. The site uses self-hosted Inter typography, a restrained green palette, and light/dark/system themes.

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

- `/`: introduction, background and capabilities, three featured projects, two certificate highlights, and direct contact links. A layered portrait, floating cube, section reveals, and interactive perspective add depth. Hero animations settle within five seconds and suspend while offscreen or in hidden tabs.
- `/projects`: sixteen projects with search, category, technology, and live-demo filters. Filters persist in the URL and when returning from a case study.
- `/projects/:id`: purpose, implementation, technical focus, contribution, technologies, and available demo/source links. Screenshots support enlargement and actual-size viewing. Previews and account requirements are labeled.
- `/about`: background, education, and demonstrated technical skills.
- `/achievements`: eighteen certificates and academic records with search, category filters, original documents, downloads, and a keyboard-accessible viewer.
- `/contact`: public email/social links and a contact form with validation, draft recovery, delivery feedback, and an email-app fallback.

The interface uses direct navigation and project links. Homepage summaries lead to full project, about, certificate, and contact pages. Certificate highlights link to their original documents. Keyboard focus, skip navigation, mobile menus, accessible dialogs, reduced-motion preferences, and theme persistence are supported.

Home has no back control. Projects, About, Certificates, and Contact each have one back button below the header that names the destination, such as "Back to About" or "Back to Projects". It steps back through this tab's site navigation, including after a reload, preserving URL filters and route state. Page labels persist in session storage for the current tab; directly opened pages fall back to "Back to Home". Project details retain their single contextual return link, preserving collection filters or homepage sections and falling back to the project collection for direct visits. Not-found pages retain their single home recovery link.

On phones (up to 560px), featured projects use a compact native horizontal scroll row with snap points and a next-card preview. Descriptions stay on the project collection and detail pages, while homepage phone cards show the image, title, technologies, and links. Visitors can swipe or use the keyboard arrows while the row is focused. Desktop and tablet layouts retain their grid and descriptions. Keyboard scrolling follows the shared motion preference; the row never advances automatically. Project back links return to the referring page, preserving collection filters or the homepage section; directly opened projects fall back to the collection.

The portrait, project cards, and homepage certificate previews gently tilt toward a mouse pointer on larger screens. Foreground layers and a moving highlight create depth through CSS perspective, without a rendering dependency. Touch screens use an isolated, flat portrait stage with explicit layer order so decorations stay behind the photo and labels, including in mobile Safari. Keyboard focus settles tilted cards. Motion follows the system reduced-motion setting automatically, with no manual controls or saved override. Tilt resets when scrolling, changing routes, or leaving the window. Pointer updates share one event listener and only schedule a frame when needed.

## Content

- `src/data/profile.js`: identity, education, public contact links, and optional résumé URL. Add a real PDF under `public/` before enabling the résumé link.
- `src/data/projects.json`: project descriptions, contributions, technologies, screenshots, source attribution, and live URLs. Preserve IDs to keep shared project links working.
- `src/data/skills.js`: technologies demonstrated in the project collection.
- `src/data/achievements.json`: supplied certificate metadata. Original files live in `src/Certificates/`; previews live in `public/certificates/previews/`.

IRIS is a Software QA case study. Its methods, role, and evidence describe the evaluation team's work. The shared Google Sheets workbook opens in a read-only view; the displayed unit, integration, and system counts are team-reported workbook figures reviewed on 16 October 2026. Update the evidence summary when that workbook changes. IRIS does not contribute hardware-development tools to the skills list.

The featured projects are Rae Jacob: Beyond the Balete, AedesCapella, and MedTech Mate. Rae Jacob is Richmond’s first game, a React Native/Expo Philippine folklore adventure prototype added on 17 October. Its case study distinguishes the playable first chapter and opening Chapter 2 arc from future work. There is no hosted demo yet. The image is a labeled scene artwork render from the source repository, with a link pinned to the reviewed commit.

The initial public GitHub review was completed on 14 October 2026. Job Finder and Online Ordering System were added in a source-code review on 16 October, alongside the supplied Eventure repository and updated Travel Diary screenshots. Smaller coursework, personal gift pages, and duplicate portfolios remain outside the curated collection. See [repository coverage](docs/github-review.md).

Thirteen projects have real screenshots. Seven deployment screenshots were refreshed on 14 October. Pocket Quest uses a labeled repository preview with sample progress; AedesCapella shows its public operator sign-in. Eventure, Travel Diary, Job Finder, and Online Ordering System use supplied phone screenshots, with status bars and home indicators cropped from display copies. Originals remain available through each case study. Portrait screenshots keep their proportions in cards, details, and the enlargement dialog. Projects without screenshots display a clearly labeled placeholder.

## Validation and maintenance

```sh
npm test
npm run format:check
npm run assets
node scripts/review-github.mjs
node scripts/capture-projects.mjs
```

Tests cover project discovery and filters, direct navigation, every screenshot and original certificate, keyboard dialogs, accessibility in both themes, mobile layouts from 320 pixels, theme persistence, pointer depth, keyboard and touch behavior, system reduced motion, portrait layering, and contact success/failure/retry. Contact delivery is mocked in tests; no visitor emails are sent.

Browser tests and asset generation use Microsoft Edge on Windows. Elsewhere, install Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHANNEL` to an installed supported browser. Vite 8 requires Node 20.19+ or 22.12+.

For the mobile Safari rendering regression, install the WebKit test browser with `npx playwright install webkit`, then run `npm run test:webkit`. These checks cover portrait and landscape layouts, photo and label stacking during motion, and both themes. WebKit testing complements verification on a physical iPhone.

The repository review script discovers all public repositories with pagination, including nested apps. It saves review evidence under ignored `.cache/project-review/`. The screenshot script reads the reviewed URLs from the project data. Set `CAPTURE_PROJECT` to refresh one project; inspect captures before committing. The scripts do not sign in or request camera/location access.

## Contact delivery

Messages are submitted through [FormSubmit AJAX](https://formsubmit.co/ajax-documentation) to `arguellesrichmond@gmail.com`. The service requires the recipient to activate the form through its one-time activation email. A successful service response does not independently confirm inbox delivery.

Drafts stay in `sessionStorage` for the current browser tab and clear after submission or the Clear draft action. Failed requests retain the message and offer a prefilled email link. The form includes a honeypot, duplicate-submit prevention, and a 20-second timeout. No private credentials are stored in this repository.

## Hosting

Vercel builds with `npm run build` and serves `dist`. `vercel.json` preserves direct SPA routes. The site is deployed from the existing GitHub repository; other hosts need an equivalent route fallback.
