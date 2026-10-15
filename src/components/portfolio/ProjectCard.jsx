import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ProjectArtwork from './ProjectArtwork.jsx';
import DepthSurface from './DepthSurface.jsx';

export const categoryLabels = {
  'Embedded/Hardware': 'Embedded systems',
  'Web App': 'Web apps',
  Mobile: 'Mobile apps',
  'ML/Data': 'Data & ML',
};

export default function ProjectCard({ project, headingLevel: Heading = 'h2' }) {
  const location = useLocation();
  const collectionUrl =
    location.pathname === '/projects' ? `${location.pathname}${location.search}` : '/projects';
  const destination = `/projects/${project.id}`;
  return (
    <DepthSurface className="work-card-depth">
      <article className="work-card depth-surface">
        <Link
          className="work-card-media"
          to={destination}
          state={{ collectionUrl }}
          aria-label={`View ${project.title}`}
        >
          <ProjectArtwork project={project} cover />
        </Link>
        <div className="work-card-body">
          <div className="card-category">
            <span>{categoryLabels[project.category]}</span>
            {project.badge && <span className="badge">{project.badge}</span>}
          </div>
          <Heading>
            <Link to={destination} state={{ collectionUrl }}>
              {project.title}
            </Link>
          </Heading>
          <p>{project.shortDescription}</p>
          <ul className="tags" aria-label={`${project.title} technologies`}>
            {project.techStack.slice(0, 3).map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className="card-actions">
            <Link className="text-link" to={destination} state={{ collectionUrl }}>
              View project <ArrowRight size={16} />
            </Link>
            {project.links.live && (
              <a
                className="text-link"
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.title} live demo`}
              >
                Live demo <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>
      </article>
    </DepthSurface>
  );
}
