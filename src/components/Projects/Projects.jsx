import projects from '../../data/projects.js';
import ProjectCard from './ProjectCard.jsx';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Projects.css';

export default function Projects() {
  const revealRef = useScrollReveal();

  return (
    <section id="projects" className="section projects">
      <div className="section-inner" ref={revealRef}>
        <div className="reveal">
          <span className="mono-label section-eyebrow">Projects</span>
          <h2 className="section-heading">Featured Projects</h2>
        </div>

        <div className="reveal projects__grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
