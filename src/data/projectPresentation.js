const stackGroups = [
  [
    'Interface',
    [
      'React',
      'React Native',
      'Expo',
      'React Navigation',
      'Vite',
      'TypeScript',
      'Tailwind CSS',
      'Recharts',
      'Leaflet',
      'React Native SVG',
    ],
  ],
  ['Data & storage', ['Supabase', 'Neon Auth', 'Neon Postgres', 'IndexedDB', 'AsyncStorage']],
  ['Embedded & data', ['ESP32-S3', 'TinyML', '1D-CNN', 'Linear Regression', 'Data Science']],
  [
    'Testing & documentation',
    [
      'Manual Testing',
      'Test Case Design',
      'Boundary Value Analysis',
      'Equivalence Partitioning',
      'Google Sheets',
    ],
  ],
  ['AI service', ['Groq']],
  ['Platform', ['PWA']],
];

export function groupStack(technologies) {
  const assigned = new Set();
  const groups = stackGroups.map(([label, members]) => {
    const items = technologies.filter((tech) => members.includes(tech));
    items.forEach((tech) => assigned.add(tech));
    return { label, items };
  });
  const remaining = technologies.filter((tech) => !assigned.has(tech));
  if (remaining.length) groups.push({ label: 'Other tools', items: remaining });
  return groups.filter((group) => group.items.length);
}
