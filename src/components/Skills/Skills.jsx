import { Code2, Database, Wrench, Sparkles } from 'lucide-react';
import skills from '../../data/skills.js';
import useScrollReveal from '../../hooks/useScrollReveal';
import useSpotlight from '../../hooks/useSpotlight';
import './Skills.css';

// One icon per category — purely a visual anchor, same restrained approach
// as the icon chips in Projects/About. Falls back gracefully (no icon) if a
// category name here doesn't match data/skills.js.
const CATEGORY_ICONS = {
  'Languages & Frameworks': Code2,
  'Backend & Data': Database,
  'Tools & Platforms': Wrench,
  Other: Sparkles,
};

function SkillGroup({ group, className }) {
  const { ref, handleMouseMove } = useSpotlight();
  const CategoryIcon = CATEGORY_ICONS[group.category];

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`card skills__group ${className}`.trim()}>
      {CategoryIcon && (
        <span className="skills__icon-chip" aria-hidden="true">
          <CategoryIcon size={20} strokeWidth={1.75} />
        </span>
      )}
      <h3 className="skills__category">{group.category}</h3>
      <ul className="skills__list">
        {group.items.map((item) => (
          <li key={item}>
            <span className="tag">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal();

  return (
    <section id="skills" className="section skills">
      <div className="section-inner">
        <div ref={headerRef}>
          <div className="reveal">
            <span className="mono-label section-eyebrow">02 — skills</span>
            <h2 className="section-heading">Skills &amp; Expertise</h2>
          </div>
        </div>

        {/* Each category card is its own direct .reveal child here (rather
            than the whole grid being one block), so cards cascade in one at
            a time instead of appearing together. */}
        <div className="skills__grid" ref={gridRef}>
          {skills.map((group) => (
            <SkillGroup key={group.category} group={group} className="reveal" />
          ))}
        </div>
      </div>
    </section>
  );
}
