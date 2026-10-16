# GitHub project review

The initial review on 14 October 2026 covered 25 public repositories returned by the [GitHub account API](https://api.github.com/users/ArguellesMomon/repos?per_page=100&sort=updated), including default-branch file lists, available READMEs, package metadata, and latest push dates. Private repositories are outside this public review. Following the additions below, the collection has 15 case studies, 13 linked to public repositories.

## Follow-up — 16 October 2026

Reviewed the public package metadata and implementation for the supplied repositories:

- [Job Finder](https://github.com/ArguellesMomon/job-finder-app): added the Empllo listing integration, search and filters, per-user saved jobs, and local application tracking. The case study identifies sign-in and application submission as local demo flows.
- [Online Ordering System](https://github.com/ArguellesMomon/online-ordering-system-react-native): added product discovery, price filters and sorting, shared cart state, selected-item totals, and checkout validation. Payment and order confirmation are simulated; the case study states this explicitly.
- [Eventure](https://github.com/bmsj23/final-project-group3-mobapp): retained the source link supplied by Richmond, reviewed Supabase event and booking modules, and scoped the contribution to booking flow and validation within the team project. Welcome-screen activity figures are labeled as interface copy rather than verified usage metrics.
- [Travel Diary](https://github.com/ArguellesMomon/travel-diary): confirmed local photo/location/note storage and added the supplied empty-state screenshot.

All four supplied phone screenshots have cropped display copies with their status bars and home indicators removed. The originals are preserved and linked from their case studies. Screenshots document the supplied interfaces; no sign-in, booking, application submission, payment, or other account writes were performed during review.

## Initial review — 14 October 2026

| Repository                                                                         | Portfolio decision                                                                                                                                |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Pocket_Quest_App](https://github.com/ArguellesMomon/Pocket_Quest_App)             | Added Pocket Quest, its current task/reward/companion/cloud features, verified stack, live link, and repository preview. Latest push: 14 October. |
| [Pickleball-Locator-App](https://github.com/ArguellesMomon/Pickleball-Locator-App) | Expanded Pickle Batangas with comparisons, shared shortlists, map filters, planning validation, and offline limits. Refreshed screenshot.         |
| [MedTech-Internship-App](https://github.com/ArguellesMomon/MedTech-Internship-App) | Current workspace and Chami description retained; refreshed public landing screenshot.                                                            |
| [DayMargin](https://github.com/ArguellesMomon/DayMargin)                           | Current Neon/offline/Finn description and unfinished reminder note retained; refreshed screenshot. Latest-build badge moved to Pocket Quest.      |
| [AedesCapella-Dashboard](https://github.com/ArguellesMomon/AedesCapella-Dashboard) | Nested app README/package checked. Existing operator-dashboard narrative remains accurate.                                                        |
| [C4A-Dashboard](https://github.com/ArguellesMomon/C4A-Dashboard)                   | Planner and officer-workspace description retained; refreshed screenshot.                                                                         |
| [Photobooth-app](https://github.com/ArguellesMomon/Photobooth-app)                 | Local-first PWA description retained; refreshed Momento screenshot.                                                                               |
| [pinoy-recipe-finder](https://github.com/ArguellesMomon/pinoy-recipe-finder)       | Search, categories, recipe details, and favorites remain represented; refreshed screenshot.                                                       |
| [study-spot-ph](https://github.com/ArguellesMomon/study-spot-ph)                   | Discovery and demo-booking description retained; refreshed screenshot.                                                                            |
| [travel-diary](https://github.com/ArguellesMomon/travel-diary)                     | Existing React Native/Expo journal case study retained.                                                                                           |
| personal-portfolio                                                                 | Current site; omitted as a duplicate portfolio entry.                                                                                             |
| Arguelles-Richmond-mobile-portfolio                                                | Earlier portfolio exercise; omitted from the curated collection.                                                                                  |
| react-portfolio                                                                    | Earlier portfolio exercise; omitted from the curated collection.                                                                                  |
| portfolio                                                                          | Earlier portfolio exercise; omitted from the curated collection.                                                                                  |
| online-ordering-system-react-native                                                | Existing mobile ordering/navigation coursework; no new push since the prior review, remains outside the curated collection.                       |
| job-finder-app                                                                     | Existing mobile coursework; no new push since the prior review, remains outside the curated collection.                                           |
| ChristmasGift                                                                      | Personal gift page; omitted from the professional collection.                                                                                     |
| Date-                                                                              | Personal invitation page; omitted from the professional collection.                                                                               |
| html-css-js                                                                        | Earlier introductory web exercise; omitted from the curated collection.                                                                           |
| finals-project-oop                                                                 | Earlier C++ coursework; omitted from the curated collection.                                                                                      |
| midterm-project-oop                                                                | Earlier C++ coursework; omitted from the curated collection.                                                                                      |
| abstraction-and-encapsulation                                                      | Earlier C++ coursework; omitted from the curated collection.                                                                                      |
| class-diagram-implementation                                                       | Earlier C++ coursework; omitted from the curated collection.                                                                                      |
| classes-and-objects                                                                | Earlier C++ coursework; omitted from the curated collection.                                                                                      |
| basics-and-fundamentals-c                                                          | Earlier C++ coursework; omitted from the curated collection.                                                                                      |

The eight public demos checked during capture returned HTTP 200: Pocket Quest, Pickle Batangas, MedTech Mate, Daymargin, Momento, C4A Fieldnotes, Pinoy Recipe Finder, and StudySpot PH. Canonical destinations already recorded in the portfolio are retained where GitHub homepage metadata uses an older alias. Authentication, live chat, purchases, and account writes were not exercised. Pocket Quest’s Today image comes from `docs/previews/today-play-desktop.png` in its repository and is labeled as a preview with sample progress.

Run `node scripts/review-github.mjs` to repeat repository discovery, including new repositories and nested apps. Local review evidence is stored in ignored `.cache/project-review/`.
