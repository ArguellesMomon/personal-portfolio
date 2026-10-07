import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, GraduationCap } from 'lucide-react';
import achievements from '../data/achievements.json';
import { ContactBanner, PageHeading } from '../components/portfolio/SiteLayout.jsx';
export default function AchievementsPage() {
  const published = achievements.filter((item) => item.title.trim());
  return (
    <main id="main-content" tabIndex={-1} className="container page-content">
      <PageHeading eyebrow="ALWAYS A STUDENT" title="Learning & achievements">
        A place for milestones, credentials, and the learning that feeds my work.
      </PageHeading>
      <div className="learning-highlight">
        <GraduationCap size={32} />
        <div>
          <span className="eyebrow">EDUCATION</span>
          <h2>Computer Science</h2>
          <p>De La Salle Lipa</p>
        </div>
        <span className="badge">Student</span>
      </div>
      {published.length ? (
        <div className="achievement-grid">
          {published.map((item) => (
            <article className="credential-card" key={item.id}>
              {item.issuerLogo && <img src={item.issuerLogo} alt={item.issuer} />}
              <span className="eyebrow">{item.type}</span>
              <h2>{item.title}</h2>
              <p>
                {item.issuer}
                {item.date && ` · ${item.date}`}
              </p>
              {item.description && <p>{item.description}</p>}
              {item.verifyUrl && (
                <a className="text-link" href={item.verifyUrl} target="_blank" rel="noreferrer">
                  Verify credential <ArrowUpRight size={16} />
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <section className="learning-empty">
          <BookOpen size={28} />
          <h2>Learning through building.</h2>
          <p>
            My project collection is the best place to explore what I’ve been learning and putting
            into practice.
          </p>
          <Link className="button button-outline" to="/projects">
            Explore the projects <ArrowRight size={17} />
          </Link>
        </section>
      )}
      <ContactBanner />
    </main>
  );
}
