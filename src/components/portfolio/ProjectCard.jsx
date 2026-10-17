import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ProjectArtwork from './ProjectArtwork.jsx';
import DepthSurface from './DepthSurface.jsx';

export const categoryLabels = {
  'Embedded/Hardware': 'Embedded systems',
  'Web App': 'Web apps',
  Mobile: 'Mobile apps',
  Game: 'Games',
  'ML/Data': 'Data & ML',
  QA: 'Software QA',
};

export default function ProjectCard({ project, headingLevel: Heading = 'h2' }) {
  const location = useLocation();
  const returnTo =
    location.pathname === '/'
      ? `/${location.search}#home-projects`
      : `${location.pathname}${location.search}${location.hash}`;
  const destination = `/projects/${project.id}`;
  return (
    <DepthSurface className="work-card-depth">
      <article className="work-card depth-surface">
        <Link
          className="work-card-media"
          to={destination}
          state={{ returnTo }}
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
            <Link to={destination} state={{ returnTo }}>
              {project.title}
            </Link>
          </Heading>
          <p>{project.shortDescription}</p>
          <ul
            className="tags"
            aria-label={`${project.title} ${project.category === 'QA' ? 'methods and tools' : 'technologies'}`}
          >
            {project.techStack.slice(0, 3).map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className="card-actions">
            <Link className="text-link" to={destination} state={{ returnTo }}>
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
            {project.links.documentation && (
              <a
                className="text-link"
                href={project.links.documentation}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${project.title} QA workbook`}
              >
                QA workbook <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>
      </article>
    </DepthSurface>
  );
}
