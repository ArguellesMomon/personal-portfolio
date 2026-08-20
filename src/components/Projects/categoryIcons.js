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
