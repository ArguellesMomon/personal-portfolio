import { Sparkles, Cloud, Code2, GraduationCap } from 'lucide-react';

// One icon + label per achievement category, used by AchievementCard and by
// the filter chips / grouped section headers on /achievements — a single
// shared map so the two can't drift apart. Mirrors the pattern in
// src/components/Projects/categoryIcons.js.
export const CATEGORY_ICONS = {
  ai: Sparkles,
  cloud: Cloud,
  engineering: Code2,
  academic: GraduationCap,
};

export const CATEGORY_LABELS = {
  ai: 'AI & Data',
  cloud: 'Cloud & DevOps',
  engineering: 'Software Engineering',
  academic: 'Academic Milestones',
};

// Fixed display order for category filter chips and grouped sections.
export const CATEGORY_ORDER = ['ai', 'cloud', 'engineering', 'academic'];

// Which of the site's 3 accent colors (signal/ember/olive) tints each
// category's badge (see AchievementBadge.jsx) — mirrors CATEGORY_TINT in
// Projects/categoryIcons.js. Olive repeats once since there are 4
// categories and only 3 accent colors, same as Projects does with ember.
export const CATEGORY_TINT = {
  ai: 'signal',
  cloud: 'olive',
  engineering: 'ember',
  academic: 'olive',
};
