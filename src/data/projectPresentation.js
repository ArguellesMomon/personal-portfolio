// Editorial labels describe the work; they are not claims about measured results.
export const projectFocus = {
  aedescapella: 'From a sound signal to an operator’s decision.',
  pickletayo: 'Finding a court should be the easy part.',
  wellbot: 'A little structure for a demanding internship.',
  daymargin: 'A little room for the details of a day.',
  photobooth: 'Little moments, kept. Even without a connection.',
  'pinoy-recipe-finder': 'A familiar dish, one search away.',
  'study-spot-ph': 'Making room for focused work.',
  'c4a-dashboard': 'Campus activity, with the context attached.',
  eventure: 'A clearer path from discovery to booking.',
  iris: 'Testing the moments a recognition system can miss.',
  'king-ace-trading': 'Looking ahead through historical sales.',
  'travel-diary': 'A place for the details of a journey.',
};

const stackGroups = [
  [
    'Interface',
    ['React', 'React Native', 'Expo', 'Vite', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Leaflet'],
  ],
  ['Data & persistence', ['Supabase', 'Neon Auth', 'Neon Postgres', 'IndexedDB', 'AsyncStorage']],
  [
    'Device & intelligence',
    [
      'ESP32-S3',
      'TinyML',
      '1D-CNN',
      'Raspberry Pi',
      'Facial Recognition',
      'Linear Regression',
      'Data Science',
    ],
  ],
  ['AI service', ['Groq']],
  ['Delivery', ['PWA']],
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
