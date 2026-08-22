import projects from '../../data/projects.json';
import achievements from '../../data/achievements.json';
import skills from '../../data/skills.js';
import useCountUp from '../../hooks/useCountUp';
import './Stats.css';

const projectCategoryCount = new Set(projects.map((project) => project.category)).size;
const skillCount = skills.reduce((total, group) => total + group.items.length, 0);

const STATS = [
  { value: projects.length, label: 'Projects Shipped' },
  { value: achievements.length, label: 'Credentials Earned' },
  { value: skillCount, label: 'Tools & Technologies' },
  { value: projectCategoryCount, label: 'Engineering Domains' },
];

function StatItem({ value, label }) {
  const { ref, value: displayValue } = useCountUp(value);

  return (
    <div ref={ref} className="stats__item">
      <span className="stats__number">{displayValue}</span>
      <span className="mono-label stats__label">{label}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <div className="stats" aria-label="Portfolio at a glance">
      <div className="section-inner stats__inner">
        {STATS.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
