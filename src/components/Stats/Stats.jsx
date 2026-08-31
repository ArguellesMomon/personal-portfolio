import projects from '../../data/projects.json';
import achievements from '../../data/achievements.json';
import skills from '../../data/skills.js';
import useCountUp from '../../hooks/useCountUp';
import './Stats.css';

const skillCount = skills.reduce((total, group) => total + group.items.length, 0);

// Only count achievements that actually have a title — the unconfirmed
// scaffolding entries in achievements.json (see that file's comments)
// aren't shown anywhere else on the site, so counting them here would
// make this number disagree with what a visitor can actually see.
const confirmedAchievementCount = achievements.filter((item) => item.title).length;

// Trimmed from 4 numbers to 3 — "Engineering Domains" said the same thing
// About's expertise cards, one section above, already show with icons;
// keeping both was one repetition too many before a visitor even reaches
// a project. "Shipped" also softened to "Built" — more honest at student
// stage than implying every project is in production use.
const STATS = [
  { value: projects.length, label: 'Projects Built' },
  { value: confirmedAchievementCount, label: 'Courses & Certifications' },
  { value: skillCount, label: 'Tools & Technologies' },
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
