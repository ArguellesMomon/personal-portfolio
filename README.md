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

Output goes to `dist/`, ready to deploy on Vercel.

## Before you publish — placeholders to fill in

Everything below is marked `[PLACEHOLDER: ...]` in the code so it's easy to
find (search the codebase for `PLACEHOLDER`).

- `index.html` — page title and meta description
- `src/components/Hero/Hero.jsx` — your name and one-line summary
- `src/components/shared/Navbar/Navbar.jsx` — brand text in the nav
- `src/components/shared/Footer/Footer.jsx` — LinkedIn URL, email
- `src/components/Contact/Contact.jsx` — email, LinkedIn URL, intro line
- `src/components/About/About.jsx` — your bio
- `src/data/achievements.js` — real achievements/certifications with dates
- `src/data/projects.js` — for each project: `role`, `problem`, `approach`,
  `challenges`, `outcome`, `links.github`, `links.live`, and `imageAlt`
  (the title/description/tech stack are already filled in from what you gave me)
- `public/resume.pdf` — add your resume PDF at this exact path; the
  Hero "Download Resume" button already links to `/resume.pdf`

## Notes

- Contact section uses simple links only (email/GitHub/LinkedIn), no form,
  per your choice.
- `src/data/status.js` exists for the "currently building" badge, but the
  badge itself is a Phase 2 item and isn't rendered yet.
- Node-RED dashboard and Travel Diary are included in the main Projects grid
  rather than a separate "More Projects" archive — let me know if you'd
  rather split them out.
