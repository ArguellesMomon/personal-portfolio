import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import projects from '../data/projects.json';
import ProjectCard from '../components/Projects/ProjectCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal();

  useEffect(() => {
    document.title = 'Projects — [PLACEHOLDER: Your Name]';
    return () => {
      document.title = '[PLACEHOLDER: Your Name] — Computer Science Portfolio';
    };
  }, []);

  return (
    <main id="main-content" className="projects-page">
      <div className="projects-page__inner">
        <div ref={headerRef}>
          <Link to="/#projects" className="reveal projects-page__back">
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            Back to Home
          </Link>

          <div className="reveal">
            <h1 className="projects-page__title">Projects</h1>
            <p className="projects-page__intro">
              [PLACEHOLDER: one or two lines introducing the full list — e.g.
              the range of work below, from embedded ML to full-stack apps.]
            </p>
          </div>
        </div>

        <div className="projects-page__grid" ref={gridRef}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} className="reveal" />
          ))}
        </div>
      </div>
    </main>
  );
}
