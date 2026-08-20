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
