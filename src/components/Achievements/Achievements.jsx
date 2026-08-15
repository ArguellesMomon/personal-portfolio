import { useState } from 'react';
import { Award, ArrowRight, ArrowUp } from 'lucide-react';
import achievements from '../../data/achievements.json';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Achievements.css';

// Mirrors the View All pattern in Projects — only relevant once real entries
// push the list past one row, so the toggle stays hidden until then.
const INITIAL_VISIBLE = 4;

export default function Achievements() {
  const revealRef = useScrollReveal();
  const [showAll, setShowAll] = useState(false);
  const hasMore = achievements.length > INITIAL_VISIBLE;
  const visibleAchievements = showAll
    ? achievements
    : achievements.slice(0, INITIAL_VISIBLE);

  return (
    <section id="achievements" className="section achievements">
      <div className="section-inner" ref={revealRef}>
        <div className="reveal achievements__header">
          <div>
            <span className="mono-label section-eyebrow">04 — achievements</span>
            <h2 className="section-heading">Achievements &amp; Highlights</h2>
          </div>

          {hasMore && (
            <button
              type="button"
              className="mono-label section-toggle"
              onClick={() => setShowAll((open) => !open)}
              aria-expanded={showAll}
            >
              {showAll ? 'Show Fewer' : 'View All Achievements'}
              {showAll ? (
                <ArrowUp size={16} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        <ul className="reveal achievements__list">
          {visibleAchievements.map((item) => (
            <li key={item.id} className="card achievements__item">
              <span className="achievements__icon-chip" aria-hidden="true">
                <Award size={22} strokeWidth={1.75} />
              </span>

              <h3 className="achievements__title">{item.title}</h3>

              {item.issuer ? (
                <p className="mono-label achievements__issuer">{item.issuer}</p>
              ) : (
                <p className="achievements__description">{item.description}</p>
              )}

              <p className="mono-label achievements__date">{item.date}</p>

              {item.verifyUrl && (
                <a
                  href={item.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mono-label achievements__verify"
                >
                  &lsaquo; Verify &rsaquo;
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
