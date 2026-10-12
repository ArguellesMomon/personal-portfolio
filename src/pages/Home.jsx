import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Cpu,
  Github,
  Globe,
  GraduationCap,
  MapPin,
  Smartphone,
} from 'lucide-react';
import projects from '../data/projectCatalog.js';
import BrandSpark from '../components/portfolio/BrandSpark.jsx';
import profile from '../data/profile.js';
import ProjectCard from '../components/portfolio/ProjectCard.jsx';
import ProjectDialog from '../components/portfolio/ProjectDialog.jsx';
import { ContactBanner } from '../components/portfolio/SiteLayout.jsx';

export default function Home() {
  const [preview, setPreview] = useState(null);
  return (
    <main id="main-content" tabIndex={-1} className="home-page">
      <div className="container">
        <section className="hero-section" id="home">
          <div className="hero-copy enter">
            <div className="availability">
              <span className="live-dot" /> Open to internship opportunities
            </div>
            <p className="hero-greeting">
              Hey, I’m Richmond{' '}
              <span className="wave-hand" aria-hidden="true">
                <BrandSpark />
              </span>
            </p>
            <h1>
              <span className="hero-line">
                <span className="hero-line-text" style={{ '--line-delay': '80ms' }}>
                  Built to work.
                </span>
              </span>
              <span className="hero-line">
                <span className="hero-line-text" style={{ '--line-delay': '170ms' }}>
                  Designed to
                </span>
              </span>
              <span className="hero-line hero-line-last">
                <span className="hero-line-text" style={{ '--line-delay': '260ms' }}>
                  <span className="hero-accent">
                    feel right<span className="hero-period">.</span>
                    <svg viewBox="0 0 380 18" aria-hidden="true">
                      <path d="M4 12 Q175 -2 375 9" pathLength="1" />
                    </svg>
                  </span>
                </span>
              </span>
            </h1>
            <p className="hero-description">
              A Computer Science student turning complex problems into thoughtful web, mobile, and
              embedded experiences.
            </p>
            <div className="hero-buttons">
              <Link className="button" to="/projects">
                Explore my work <ArrowUpRight size={19} />
              </Link>
              <Link className="button button-outline" to="/about">
                A little about me <ArrowRight size={18} />
              </Link>
            </div>
            <div className="hero-footnote">
              <span>
                <MapPin size={15} /> Based in the Philippines
              </span>
              <span className="hero-footnote-line" />
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Github size={15} /> GitHub <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <div className="hero-visual enter" style={{ '--delay': '140ms' }}>
            <span className="hero-ground" aria-hidden="true" />
            <span className="portrait-orbit" aria-hidden="true" />
            <span className="portrait-orbit orbit-secondary" aria-hidden="true" />
            <span className="portrait-spark spark-one" aria-hidden="true">
              <BrandSpark />
            </span>
            <span className="portrait-spark spark-two" aria-hidden="true">
              +
            </span>
            <div className="portrait-frame">
              <img
                src="/profile-portrait.png"
                alt="Richmond Arguelles"
                width={1086}
                height={1448}
                fetchpriority="high"
              />
              <div className="portrait-label">
                <span className="live-dot" /> A curious mind. A builder at heart.
              </div>
            </div>
            <div className="floating-note note-code">
              <span className="note-icon">
                <Code2 size={21} />
              </span>
              <div>
                Ideas → experiences<small>One thoughtful detail at a time.</small>
              </div>
            </div>
            <div className="floating-note note-degree">
              <GraduationCap size={23} />
              <div>
                Computer Science<small>De La Salle Lipa</small>
              </div>
            </div>
            <span className="portrait-side-label">ALWAYS LEARNING · ALWAYS BUILDING</span>
          </div>
        </section>
        <div className="expertise-strip" id="skills">
          <span className="eyebrow">A FEW THINGS I BUILD</span>
          <span>
            <Globe size={17} /> Web experiences
          </span>
          <span>
            <Smartphone size={17} /> Mobile apps
          </span>
          <span>
            <Cpu size={17} /> Embedded systems
          </span>
          <span>
            <Activity size={17} /> Data & ML
          </span>
        </div>
        <section className="selected-work section-space" id="projects">
          <div className="section-header">
            <div>
              <span className="eyebrow">SELECTED WORK</span>
              <h2>
                Ideas made tangible<span className="accent">.</span>
              </h2>
              <p>A few projects where curiosity met a real problem.</p>
            </div>
            <Link to="/projects" className="text-link">
              All projects <span className="count-pill">{projects.length}</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="work-grid">
            {projects
              .filter((project) => project.featured)
              .slice(0, 3)
              .map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onPreview={setPreview}
                />
              ))}
          </div>
        </section>
        <section className="about-teaser" id="about">
          <div className="about-teaser-mark" aria-hidden="true">
            r<span>.</span>
            <small>THE PERSON BEHIND THE PIXELS</small>
          </div>
          <div>
            <span className="eyebrow">A LITTLE ABOUT ME</span>
            <h2>
              Curious about the system.
              <br />
              Careful with the details.
            </h2>
            <p>
              From listening for mosquito wingbeats to making a booking flow feel effortless, I
              enjoy connecting the technical pieces with the people who use them.
            </p>
            <Link className="text-link" to="/about">
              More about my approach <ArrowRight size={18} />
            </Link>
          </div>
        </section>
        <div id="contact">
          <ContactBanner />
        </div>
      </div>
      <ProjectDialog project={preview} onClose={() => setPreview(null)} />
    </main>
  );
}
