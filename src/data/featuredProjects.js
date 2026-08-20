import allProjects from './projects.json';

// The 3 highest-signal projects shown in the homepage Projects section
// (both the desktop fan and the mobile carousel use this same selection) —
// see the ordering at the top of projects.json to change which ones these
// are; this always just takes the first 3.
export const FEATURED_COUNT = 3;
export const featuredProjects = allProjects.slice(0, FEATURED_COUNT);
