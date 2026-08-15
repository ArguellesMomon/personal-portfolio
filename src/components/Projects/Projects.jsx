import { useState } from 'react';
import { ArrowRight, ArrowUp } from 'lucide-react';
import projects from '../../data/projects.json';
import ProjectCard from './ProjectCard.jsx';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Projects.css';

// With 8 projects, showing all of them at once buries the strongest work.
// The first FEATURED_COUNT entries in data/projects.json show by default;
// "View All Projects" reveals the rest in place (no separate route needed).
const FEATURED_COUNT = 4;

export default function Projects() {
  const revealRef = useScrollReveal();
  const [showAll, setShowAll] = useState(false);
  const hasMore = projects.length > FEATURED_COUNT;
  const visibleProjects = showAll ? projects : projects.slice(0, FEATURED_COUNT);

  return (
    <section id="projects" className="section projects">
      <div className="section-inner" ref={revealRef}>
        <div className="reveal projects__header">
          <div>
            <span className="mono-label section-eyebrow">03 — projects</span>
            <h2 className="section-heading">Featured Projects</h2>
          </div>

          {hasMore && (
            <button
              type="button"
              className="mono-label section-toggle"
              onClick={() => setShowAll((open) => !open)}
              aria-expanded={showAll}
            >
              {showAll ? 'Show Fewer' : 'View All Projects'}
              {showAll ? (
                <ArrowUp size={16} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        <div className="reveal projects__grid">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
