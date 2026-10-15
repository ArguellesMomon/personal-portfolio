import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Cpu,
  GraduationCap,
  Pause,
  Play,
  Smartphone,
} from 'lucide-react';
import projects from '../data/projectCatalog.js';
import certificates from '../data/certificates.js';
import profile from '../data/profile.js';
import FeaturedProjects from '../components/portfolio/FeaturedProjects.jsx';
import DepthSurface from '../components/portfolio/DepthSurface.jsx';
import { useMotion } from '../components/portfolio/MotionContext.jsx';
import '../styles/home.css';

const highlights = ['applications-development', 'pytorch-intro'].map((id) =>
  certificates.find((item) => item.id === id),
);
const capabilities = [
  {
    Icon: Code2,
    title: 'Web applications',
    description: 'Account-based tools, offline storage, and cloud sync.',
    to: '/projects?category=Web+App',
  },
  {
    Icon: Smartphone,
    title: 'Mobile experiences',
    description: 'React Native and Expo apps for smaller screens.',
    to: '/projects?category=Mobile',
  },
  {
    Icon: Cpu,
    title: 'Embedded intelligence',
    description: 'On-device machine learning and live monitoring.',
    to: '/projects/aedescapella',
  },
];

function useHomeMotion(root) {
  const motion = useMotion();
  const { enabled } = motion;
  useEffect(() => {
    const element = root.current;
    if (!enabled || !('IntersectionObserver' in window)) return;
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            reveal.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    element.querySelectorAll('[data-reveal]').forEach((target) => reveal.observe(target));
    let heroVisible = true;
    const updateVisibility = () => {
      element.dataset.heroVisible = String(heroVisible && !document.hidden);
    };
    const hero = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      updateVisibility();
    });
    hero.observe(element.querySelector('.hero-section'));
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      reveal.disconnect();
      hero.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, [enabled, root]);
  return motion;
}

export default function Home() {
  const root = useRef(null);
  const { enabled, paused, systemReduced, toggle } = useHomeMotion(root);
  return (
    <main
      ref={root}
      id="main-content"
      tabIndex={-1}
      className="home-page container"
      data-home-motion={enabled ? 'on' : 'off'}
    >
      <section className="hero-section" aria-labelledby="intro-title">
        <div className="hero-copy">
          <span className="eyebrow">Software developer · Philippines</span>
          <h1 id="intro-title">
            <span className="home-title-line">Useful apps.</span>
            <span className="home-title-line accent">Intelligent systems.</span>
          </h1>
          <p className="hero-description">
            I’m Richmond Arguelles, a Computer Science student at De La Salle Lipa. I build web and
            mobile apps, and bring machine learning to embedded devices.
          </p>
          <div className="hero-buttons">
            <Link className="button" to="/projects">
              View projects <ArrowRight size={18} />
            </Link>
            <Link className="button button-outline" to="/contact">
              Contact me <ArrowUpRight size={18} />
            </Link>
          </div>
          <p className="availability">
            <span className="live-dot" /> Open to internship opportunities
          </p>
          <a className="home-scroll-link" href="#home-about">
            Get to know my work <ArrowDown size={15} />
          </a>
        </div>
        <div
          className="home-hero-visual depth-scene depth-portrait"
          data-depth="portrait"
          data-depth-strength="6"
        >
          <div className="home-depth-stage depth-surface">
            <div className="home-visual-grid" aria-hidden="true" />
            <div className="home-ambient-orb" aria-hidden="true" />
            <div className="home-depth-backplate" aria-hidden="true" />
            <div className="home-depth-cube" aria-hidden="true">
              {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => (
                <span className={`cube-${face}`} key={face} />
              ))}
            </div>
            <svg className="home-connections" viewBox="0 0 440 510" fill="none" aria-hidden="true">
              <path
                d="M30 100H135Q155 100 155 120V180M410 405H315Q295 405 295 385V330"
                pathLength="1"
              />
              <circle cx="30" cy="100" r="4" />
              <circle cx="410" cy="405" r="4" />
            </svg>
            <figure className="hero-portrait">
              <img
                src="/profile-portrait.png"
                alt="Richmond Arguelles"
                width={1086}
                height={1448}
                fetchpriority="high"
              />
              <figcaption>
                <strong>Richmond Arguelles</strong>
                <span>Computer Science · De La Salle Lipa</span>
              </figcaption>
            </figure>
            <div className="home-skill-note home-note-web">
              <Code2 size={19} />
              <div>
                <strong>Web & mobile</strong>
                <span>React · React Native</span>
              </div>
            </div>
            <div className="home-skill-note home-note-device">
              <Cpu size={19} />
              <div>
                <strong>Embedded ML</strong>
                <span>ESP32-S3 · TinyML</span>
              </div>
            </div>
          </div>
          <button
            className="home-motion-toggle"
            onClick={toggle}
            disabled={systemReduced}
            aria-pressed={paused}
            aria-label={
              systemReduced
                ? 'Animations reduced by system settings'
                : enabled
                  ? 'Pause homepage animations'
                  : 'Resume homepage animations'
            }
          >
            {enabled ? <Pause size={13} /> : <Play size={13} />}
            {systemReduced ? 'Reduced motion' : enabled ? 'Pause motion' : 'Resume motion'}
          </button>
        </div>
      </section>
      <div className="home-proof-strip" role="group" aria-label="Portfolio at a glance" data-reveal>
        <a href="#home-about">
          <GraduationCap size={22} />
          <span>
            <strong>De La Salle Lipa</strong>
            <small>Computer Science student</small>
          </span>
          <ArrowDown size={15} />
        </a>
        <a href="#home-projects">
          <strong className="home-proof-number">{projects.length}</strong>
          <span>
            <strong>Projects</strong>
            <small>Web, mobile, and embedded</small>
          </span>
          <ArrowDown size={15} />
        </a>
        <a href="#home-certificates">
          <strong className="home-proof-number">{certificates.length}</strong>
          <span>
            <strong>Learning records</strong>
            <small>Courses, seminars, and recognition</small>
          </span>
          <ArrowDown size={15} />
        </a>
      </div>
      <section
        id="home-about"
        className="home-about home-section"
        aria-labelledby="home-about-title"
      >
        <div className="home-about-copy" data-reveal>
          <span className="eyebrow">01 / Background</span>
          <h2 id="home-about-title">Beyond the interface.</h2>
          <p>
            I work across the interface, the data, and the device. My projects range from an
            internship planning workspace to an acoustic mosquito detection thesis.
          </p>
          <p>
            That means building the screens people use, connecting the data behind them, and testing
            how the pieces work together.
          </p>
          <Link className="text-link" to="/about">
            More about me <ArrowRight size={17} />
          </Link>
        </div>
        <div className="home-capabilities">
          {capabilities.map(({ Icon, title, description, to }, index) => (
            <Link
              className="home-capability"
              to={to}
              key={title}
              data-reveal
              style={{ '--reveal-delay': `${index * 85}ms` }}
            >
              <span className="home-capability-icon">
                <Icon size={22} strokeWidth={1.6} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>
      <section
        id="home-projects"
        className="selected-work home-section"
        aria-labelledby="selected-title"
      >
        <div className="section-header" data-reveal>
          <div>
            <span className="eyebrow">02 / Selected work</span>
            <h2 id="selected-title">Built from the ground up.</h2>
          </div>
          <Link to="/projects" className="text-link">
            All {projects.length} projects <ArrowRight size={17} />
          </Link>
        </div>
        <FeaturedProjects projects={projects.filter((project) => project.featured).slice(0, 3)} />
      </section>
      <section
        id="home-certificates"
        className="home-learning home-section"
        aria-labelledby="home-learning-title"
      >
        <div className="home-learning-copy" data-reveal>
          <span className="eyebrow">03 / Learning & recognition</span>
          <h2 id="home-learning-title">The work behind the work.</h2>
          <p>
            Deep learning coursework and academic recognition are part of my foundation. Here are
            two highlights, with the original documents available to view.
          </p>
          <Link className="text-link" to="/achievements">
            All {certificates.length} learning records <ArrowRight size={17} />
          </Link>
        </div>
        <div className="home-certificate-grid">
          {highlights.map((item, index) => (
            <div
              className="home-certificate-reveal"
              key={item.id}
              data-reveal
              style={{ '--reveal-delay': `${index * 120}ms` }}
            >
              <DepthSurface variant="certificate" strength={5}>
                <a
                  className="home-certificate depth-surface"
                  href={item.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View original certificate: ${item.title}`}
                >
                  <div className="home-certificate-image">
                    <img
                      src={item.preview}
                      alt={`${item.title} certificate awarded to Richmond Arguelles`}
                      width={1000}
                      height={750}
                      loading="lazy"
                    />
                    <span>
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="home-certificate-copy">
                    <span className="eyebrow">
                      {item.type === 'milestone' ? 'Academic recognition' : 'Course completed'}
                    </span>
                    <h3>{item.title}</h3>
                    <p>
                      {item.issuer} · {new Date(item.date + 'T00:00:00Z').getUTCFullYear()}
                    </p>
                    <span className="home-document-action">
                      View certificate <ArrowUpRight size={14} />
                    </span>
                  </div>
                </a>
              </DepthSurface>
            </div>
          ))}
        </div>
      </section>
      <section
        id="home-contact"
        className="home-contact"
        aria-labelledby="home-contact-title"
        data-reveal
      >
        <div>
          <span className="eyebrow">04 / What’s next</span>
          <h2 id="home-contact-title">Let’s work together.</h2>
          <p>Open to internships and software development opportunities.</p>
          <a className="home-contact-email" href={`mailto:${profile.email}`}>
            {profile.email} <ArrowUpRight size={16} />
          </a>
        </div>
        <Link className="button" to="/contact">
          Start a conversation <ArrowUpRight size={18} />
        </Link>
        <svg className="home-contact-lines" viewBox="0 0 420 300" fill="none" aria-hidden="true">
          <path d="M100 300V180Q100 140 140 140H380M180 300V220Q180 180 220 180H420M20 300V140Q20 60 100 60H420" />
        </svg>
      </section>
    </main>
  );
}
