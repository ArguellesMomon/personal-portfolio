import skills from '../../data/skills.js';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Skills.css';

export default function Skills() {
  const revealRef = useScrollReveal();

  return (
    <section id="skills" className="section skills">
      <div className="section-inner" ref={revealRef}>
        <div className="reveal">
          <span className="mono-label section-eyebrow">Skills</span>
          <h2 className="section-heading">Skills &amp; Expertise</h2>
        </div>

        <div className="reveal skills__grid">
          {skills.map((group) => (
            <div key={group.category} className="card skills__group">
              <h3 className="skills__category">{group.category}</h3>
              <ul className="skills__list">
                {group.items.map((item) => (
                  <li key={item}>
                    <span className="tag">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
