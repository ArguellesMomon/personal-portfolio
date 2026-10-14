import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import projects from '../data/projectCatalog.js';
import ProjectCard from '../components/portfolio/ProjectCard.jsx';

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="home-page container">
      <section className="hero-section" aria-labelledby="intro-title">
        <div className="hero-copy">
          <span className="eyebrow">Software developer · Philippines</span>
          <h1 id="intro-title">
            Web, mobile & <br />
            <span className="accent">embedded systems.</span>
          </h1>
          <p className="hero-description">
            I’m Richmond, a Computer Science student at De La Salle Lipa. I build React applications
            and embedded machine learning projects.
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
        </div>
        <div className="hero-portrait">
          <img
            src="/profile-portrait.png"
            alt="Richmond Arguelles"
            width={1086}
            height={1448}
            fetchpriority="high"
          />
        </div>
      </section>
      <section className="selected-work" aria-labelledby="selected-title">
        <div className="section-header">
          <div>
            <span className="eyebrow">Portfolio</span>
            <h2 id="selected-title">Featured projects</h2>
          </div>
          <Link to="/projects" className="text-link">
            All {projects.length} projects <ArrowRight size={17} />
          </Link>
        </div>
        <div className="work-grid">
          {projects
            .filter((project) => project.featured)
            .slice(0, 3)
            .map((project) => (
              <ProjectCard key={project.id} project={project} headingLevel="h3" />
            ))}
        </div>
      </section>
    </main>
  );
}
