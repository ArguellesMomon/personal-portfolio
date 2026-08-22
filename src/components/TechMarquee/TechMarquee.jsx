import skills from '../../data/skills.js';
import './TechMarquee.css';

const TECH_NAMES = [...new Set(skills.flatMap((group) => group.items))];

// Purely decorative reinforcement of what the Skills section (right above)
// already lists accessibly — hidden from assistive tech entirely rather
// than doubling up the same content in a second, harder-to-navigate list.
// Rendered twice back-to-back so the CSS animation (see .tech-marquee__track
// in TechMarquee.css) can loop from 0% to -50% and land exactly back on the
// first copy, with no visible seam or jump.
export default function TechMarquee() {
  return (
    <div className="tech-marquee" aria-hidden="true">
      <div className="tech-marquee__track">
        {[...TECH_NAMES, ...TECH_NAMES].map((name, index) => (
          <span className="tech-marquee__item" key={`${name}-${index}`}>
            <span className="tech-marquee__word">{name}</span>
            <span className="tech-marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
