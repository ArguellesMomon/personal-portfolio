import { Cpu, Globe, Smartphone, LineChart } from 'lucide-react';

// One icon per project category, used everywhere a project card shows a
// category (ProjectCard on the /projects page, the homepage fan, the
// mobile carousel) — a single shared map so all three can't drift apart.
export const CATEGORY_ICONS = {
  'Embedded/Hardware': Cpu,
  'Web App': Globe,
  Mobile: Smartphone,
  'ML/Data': LineChart,
};

// Fixed display order for category filter chips and grouped sections on
// /projects — deliberate (roughly "closest to the metal" first) rather than
// alphabetical, so the order reads as a considered choice, not a fallback.
export const CATEGORY_ORDER = ['Embedded/Hardware', 'Web App', 'Mobile', 'ML/Data'];

// Which of the site's 3 accent colors (signal/ember/olive — see
// variables.css) tints each category's ProjectMedia placeholder, so
// browsing the grid has a little color variety between project types
// instead of every card glowing the identical orange. Keyed to CSS classes
// (.project-media--signal etc.) rather than raw colors, so the actual
// values stay defined once, in ProjectMedia.css.
export const CATEGORY_TINT = {
  'Embedded/Hardware': 'ember',
  'Web App': 'signal',
  Mobile: 'olive',
  'ML/Data': 'ember',
};
