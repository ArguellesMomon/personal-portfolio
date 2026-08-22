import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { featuredProjects } from '../../data/featuredProjects.js';
import { CATEGORY_ICONS } from './categoryIcons.js';
import ProjectMedia from './ProjectMedia.jsx';
import useScrollReveal from '../../hooks/useScrollReveal';
import useSpotlight from '../../hooks/useSpotlight';
import './Projects.css';

// Same shape as AchievementCard in Achievements.jsx — a small card
// component defined alongside the section that uses it, each with its own
// spotlight-hover state. No "active" card here (that was the fan/carousel
// this replaced) — every card just always shows its own full content.
function FeaturedProjectCard({ project, className = '' }) {
  const { ref, handleMouseMove } = useSpotlight();
  const CategoryIcon = CATEGORY_ICONS[project.category];

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`card featured-project ${className}`.trim()}
    >
      <div className="featured-project__media">
        <ProjectMedia project={project} />
      </div>

      {project.badge && (
        <span className="mono-label featured-project__badge">
          &lsaquo; {project.badge} &rsaquo;
        </span>
      )}

      <div className="featured-project__heading">
        {CategoryIcon && (
          <span className="featured-project__icon-chip" aria-hidden="true">
            <CategoryIcon size={20} strokeWidth={1.75} />
          </span>
        )}
        <h3 className="featured-project__title">{project.title}</h3>
      </div>

      <p className="featured-project__description">{project.shortDescription}</p>

      <div className="featured-project__links">
        <a
          href={project.links.github}
          target="_blank"
          rel="noreferrer"
          className="featured-project__link"
        >
          <Github size={16} strokeWidth={1.75} aria-hidden="true" />
          Code
        </a>
        <a
          href={project.links.live}
          target="_blank"
          rel="noreferrer"
          className="featured-project__link"
        >
          <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
          Live
        </a>
      </div>
    </div>
  );
}

// The full project list lives on its own page (src/pages/ProjectsPage.jsx)
// — this section only shows the featured 3, as a plain grid: 1 column on
// mobile, 2 at 640px, 3 at 1024px — the exact same breakpoints Achievements
// uses, on purpose, so the two sections behave identically rather than
// each having their own one-off responsive logic.
export default function Projects() {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal();

  return (
    <section id="projects" className="section projects">
      <div className="projects__glow" aria-hidden="true" />
      <div className="section-inner">
        <div ref={headerRef}>
          <div className="reveal projects__header">
            <div>
              <span className="mono-label section-eyebrow">03 — projects</span>
              <h2 className="section-heading">Featured Projects</h2>
            </div>

            <Link to="/projects" className="mono-label section-toggle">
              View All Projects
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="featured-projects__grid" ref={gridRef}>
          {featuredProjects.map((project) => (
            <FeaturedProjectCard key={project.id} project={project} className="reveal" />
          ))}
        </div>
      </div>
    </section>
  );
}