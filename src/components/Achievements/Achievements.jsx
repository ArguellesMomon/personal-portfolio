import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import achievements from '../../data/achievements.json';
import AchievementCard from './AchievementCard.jsx';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Achievements.css';

// The full list moved to its own page (see src/pages/AchievementsPage.jsx),
// mirroring how Projects works — this section only shows a preview.
// Matches Projects' featured count (3) for a clean single row instead of
// one card wrapping alone onto a second row.
const INITIAL_VISIBLE = 3;

export default function Achievements() {
  const headerRef = useScrollReveal();
  const listRef = useScrollReveal();
  const hasMore = achievements.length > INITIAL_VISIBLE;
  const visibleAchievements = achievements.slice(0, INITIAL_VISIBLE);

  return (
    <section id="achievements" className="section achievements">
      <div className="achievements__glow" aria-hidden="true" />
      <div className="section-inner">
        <div ref={headerRef}>
          <div className="reveal achievements__header">
            <div>
              <span className="mono-label section-eyebrow">04 — achievements</span>
              <h2 className="section-heading">Achievements &amp; Highlights</h2>
            </div>

            {hasMore && (
              <Link to="/achievements" className="mono-label section-toggle">
                View All Achievements
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        {/* Each card is its own direct .reveal child here, so they cascade
            in one at a time as this list enters the viewport — same
            per-card stagger pattern used in Skills/Projects/Contact. */}
        <ul className="achievements__list" ref={listRef}>
          {visibleAchievements.map((item) => (
            <AchievementCard key={item.id} item={item} className="reveal" />
          ))}
        </ul>
      </div>
    </section>
  );
}