import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Globe,
  GraduationCap,
  Heart,
  Layers,
  Smartphone,
} from 'lucide-react';
import skills from '../data/skills.js';
import profile from '../data/profile.js';
import { ContactBanner, PageHeading } from '../components/portfolio/SiteLayout.jsx';
const practice = [
  [
    Globe,
    'Web experiences',
    'Interfaces that connect a useful idea to the people who need it.',
    'React · Vite · Supabase',
  ],
  [
    Smartphone,
    'Mobile applications',
    'Thoughtful flows, clear feedback, and a smaller screen in mind.',
    'React Native · Expo · TypeScript',
  ],
  [
    Cpu,
    'Embedded systems',
    'Bringing software into the physical world, one signal at a time.',
    'ESP32-S3 · Raspberry Pi · TinyML',
  ],
  [
    Layers,
    'Data & machine learning',
    'Turning signals and historical data into something actionable.',
    '1D-CNN · Linear Regression · Node-RED',
  ],
];
export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="container page-content">
      <PageHeading eyebrow="THE PERSON BEHIND THE WORK" title="Curiosity, with intention">
        I like understanding how things work. I like making them work better even more.
      </PageHeading>
      <section className="about-intro">
        <div className="about-photo">
          <img src="/hero-portrait.jpg" alt="Richmond Arguelles" loading="lazy" />
          <span>Richmond Arguelles / Software Developer</span>
        </div>
        <div className="about-intro-copy">
          <span className="eyebrow">HELLO AGAIN</span>
          <h2>
            A builder who cares
            <br />
            about the whole experience.
          </h2>
          <p>
            I’m a Computer Science student at De La Salle Lipa, building practical software and
            hardware: web apps, mobile applications, and embedded machine learning systems.
          </p>
          <p>
            Most of my projects start with a technical problem—a sensor signal, a forecasting model,
            a booking flow—and end with something people can use. The interface matters just as much
            as the system underneath it.
          </p>
          <div className="about-facts">
            <span>
              <GraduationCap size={19} />
              <span>
                Computer Science<small>{profile.university}</small>
              </span>
            </span>
            <span>
              <Globe size={19} />
              <span>
                Based in<small>{profile.location}</small>
              </span>
            </span>
          </div>
          {profile.resume && (
            <a className="button button-outline" href={profile.resume} download>
              Download résumé <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      </section>
      <section className="section-space">
        <div className="section-header">
          <div>
            <span className="eyebrow">WHAT I WORK WITH</span>
            <h2>
              Different tools. Same care<span className="accent">.</span>
            </h2>
          </div>
        </div>
        <div className="practice-grid">
          {practice.map(([Icon, title, description, stack], index) => (
            <article className="practice-card" key={title}>
              <div className="practice-top">
                <span className="practice-icon">
                  <Icon size={23} />
                </span>
                <span className="eyebrow">0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <small>{stack}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="approach-section">
        <div>
          <span className="eyebrow">HOW I APPROACH A BUILD</span>
          <h2>
            Make it useful.
            <br />
            Make it feel considered.
          </h2>
          <p>I’d rather ship something simple that works than something clever that doesn’t.</p>
        </div>
        <div className="principles">
          {[
            [
              Code2,
              'Understand before building',
              'Start with the problem and what a person actually needs.',
            ],
            [
              Layers,
              'Connect the pieces',
              'Think about the data, the system, and the interface together.',
            ],
            [
              Heart,
              'Refine the small things',
              'Clear feedback, readable layouts, and interactions that make sense.',
            ],
          ].map(([Icon, title, text]) => (
            <article key={title}>
              <Icon size={21} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="skills-section">
        <span className="eyebrow">MY TOOLKIT</span>
        <div className="skill-groups">
          {skills.map((group) => (
            <div key={group.category}>
              <h3>{group.category}</h3>
              <div className="tags">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Link className="text-link" to="/achievements">
          Learning & achievements <ArrowUpRight size={17} />
        </Link>
      </section>
      <ContactBanner />
    </main>
  );
}
