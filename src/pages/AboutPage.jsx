import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import skills from '../data/skills.js';
import profile from '../data/profile.js';
import { PageHeading } from '../components/portfolio/SiteLayout.jsx';

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="container page-content about-page">
      <PageHeading title="About me">
        Computer Science student and software developer based in the Philippines.
      </PageHeading>
      <section className="about-intro" aria-labelledby="background-title">
        <div className="about-photo">
          <img
            src="/profile-portrait.png"
            alt="Richmond Arguelles"
            width={1086}
            height={1448}
            loading="lazy"
          />
        </div>
        <div className="about-intro-copy">
          <h2 id="background-title">Richmond Arguelles</h2>
          <p>
            I’m a Computer Science student at De La Salle Lipa. I build web and mobile applications
            with React and React Native, and work with embedded machine learning.
          </p>
          <p>
            One of my main projects is{' '}
            <Link to="/projects/aedescapella" state={{ returnTo: '/about' }}>
              AedesCapella
            </Link>
            , our thesis on acoustic mosquito detection. It combines wingbeat audio processing and
            on-device machine learning on an ESP32-S3 with a React monitoring dashboard. My thesis
            work spans acoustic sensing, the on-device model, and the dashboard that presents sensor
            status and activity.
          </p>
          <p>
            I also built{' '}
            <Link to="/projects/wellbot" state={{ returnTo: '/about' }}>
              MedTech Mate
            </Link>
            , my first personal AI project. It helps medical technology interns organize rotations,
            procedure quotas, shifts, notes, and documents, with Chami as an AI study companion. I
            developed the workspace, data integration, and study chat.
          </p>
          <p>
            I’m exploring game development through{' '}
            <Link to="/projects/rae-jacob" state={{ returnTo: '/about' }}>
              Rae Jacob: Beyond the Balete
            </Link>
            , my first game. This React Native and Expo prototype brings Philippine folklore into a
            pixel-art adventure with exploration, character conversations, and environmental
            puzzles.
          </p>
          <div className="education-fact">
            <span className="eyebrow">Education</span>
            <strong>{profile.university}</strong>
            <span>Computer Science · Current student</span>
          </div>
          <div className="inline-links">
            <Link className="text-link" to="/contact">
              Contact me <ArrowRight size={17} />
            </Link>
            <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={16} />
            </a>
            {profile.resume && (
              <a className="text-link" href={profile.resume} download>
                Download résumé <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </section>
      <section className="skills-section" aria-labelledby="skills-title">
        <div className="section-header">
          <h2 id="skills-title">Technical skills</h2>
          <Link className="text-link" to="/achievements">
            Certificates & achievements <ArrowRight size={17} />
          </Link>
        </div>
        <div className="skill-groups">
          {skills.map((group) => (
            <div key={group.category}>
              <h3>{group.category}</h3>
              <ul className="tags">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
