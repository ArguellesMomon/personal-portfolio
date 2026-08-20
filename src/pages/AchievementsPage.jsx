import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import achievements from '../data/achievements.json';
import AchievementCard from '../components/Achievements/AchievementCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal';
import './AchievementsPage.css';

export default function AchievementsPage() {
  const headerRef = useScrollReveal();
  const listRef = useScrollReveal();

  useEffect(() => {
    document.title = 'Achievements — [PLACEHOLDER: Your Name]';
    return () => {
      document.title = '[PLACEHOLDER: Your Name] — Computer Science Portfolio';
    };
  }, []);

  return (
    <main id="main-content" className="achievements-page">
      <div className="achievements-page__inner">
        <div ref={headerRef}>
          <Link to="/#achievements" className="reveal achievements-page__back">
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            Back to Home
          </Link>

          <div className="reveal">
            <h1 className="achievements-page__title">Achievements &amp; Certifications</h1>
            <p className="achievements-page__intro">
              [PLACEHOLDER: one or two lines introducing the full list — e.g.
              certifications, honors, and milestones from your degree.]
            </p>
          </div>
        </div>

        <ul className="achievements-page__grid" ref={listRef}>
          {achievements.map((item) => (
            <AchievementCard key={item.id} item={item} className="reveal" />
          ))}
        </ul>
      </div>
    </main>
  );
}
