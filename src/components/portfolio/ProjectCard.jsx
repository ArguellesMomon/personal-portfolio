import { ArrowRight, ArrowUpRight, Eye, Github } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ProjectArtwork from './ProjectArtwork.jsx';
export const categoryLabels = {
  'Embedded/Hardware': 'Embedded systems',
  'Web App': 'Web development',
  Mobile: 'Mobile apps',
  'ML/Data': 'Data & ML',
};
export default function ProjectCard({ project, onPreview, index = 0 }) {
  const location = useLocation();
  const collectionUrl =
    location.pathname === '/projects' ? `${location.pathname}${location.search}` : '/projects';
  return (
    <article className="work-card enter" style={{ '--delay': `${Math.min(index, 5) * 65}ms` }}>
      <div className="work-card-media">
        <Link
          to={`/projects/${project.id}`}
          state={{ collectionUrl }}
          aria-label={`View ${project.title}`}
        >
          <ProjectArtwork project={project} />
        </Link>
        {onPreview && (
          <button
            className="preview-button"
            onClick={() => onPreview(project)}
            aria-label={`Quick view ${project.title}`}
          >
            <Eye size={16} />
            <span>Quick view</span>
          </button>
        )}
      </div>
      <div className="work-card-body">
        <div className="card-category">
          <span>{categoryLabels[project.category]}</span>
          {project.badge && <span className="badge">{project.badge}</span>}
        </div>
        <h2>
          <Link to={`/projects/${project.id}`} state={{ collectionUrl }}>
            {project.title}
            <ArrowUpRight size={22} />
          </Link>
        </h2>
        <p>{project.shortDescription}</p>
        <div className="card-bottom">
          <div className="tags">
            {project.techStack.slice(0, 3).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
            {project.techStack.length > 3 && <span>+{project.techStack.length - 3}</span>}
          </div>
          <Link
            className="card-arrow"
            to={`/projects/${project.id}`}
            state={{ collectionUrl }}
            aria-label={`Read ${project.title} project details`}
          >
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="card-external-links">
          {project.links.live && (
            <a
              className="text-link"
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title} live demo`}
            >
              Live demo <ArrowUpRight size={14} />
            </a>
          )}
          {project.links.github && (
            <a
              className="text-link"
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} source code`}
            >
              <Github size={14} /> Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
