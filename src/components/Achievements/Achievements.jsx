import { Award } from 'lucide-react';
import achievements from '../../data/achievements.js';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Achievements.css';

export default function Achievements() {
  const revealRef = useScrollReveal();

  return (
    <section id="achievements" className="section achievements">
      <div className="section-inner" ref={revealRef}>
        <div className="reveal">
          <span className="mono-label section-eyebrow">Achievements</span>
          <h2 className="section-heading">Achievements &amp; Highlights</h2>
        </div>

        <ul className="reveal achievements__list">
          {achievements.map((item) => (
            <li key={item.id} className="card achievements__item">
              <Award className="achievements__icon" size={22} strokeWidth={1.75} aria-hidden="true" />
              <div>
                <h3 className="achievements__title">{item.title}</h3>
                <p className="achievements__description">{item.description}</p>
                <p className="mono-label">{item.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
