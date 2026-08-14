import { useState } from 'react';
import { ChevronDown, ExternalLink, Github } from 'lucide-react';
import './Projects.css';

// Accessible accordion pattern: the actual toggle control is a <button> that
// wraps only the title (inside an <h3>), so its accessible name stays short.
// Clicking anywhere on the header also toggles, for a larger mouse/touch
// target, but that click handler sits on a non-interactive wrapper — the
// button remains the real, keyboard-operable control.
export default function ProjectCard({ project }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = `project-panel-${project.id}`;

  const toggle = () => setIsExpanded((open) => !open);

  const handleHeaderClick = () => toggle();
  const handleTriggerClick = (event) => {
    event.stopPropagation(); // avoid double-toggling with the header's own handler
    toggle();
  };

  return (
    <article className="card project-card">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className="project-card__header" onClick={handleHeaderClick}>
        <div className="project-card__top">
          <h3 className="project-card__title">
            <button
              type="button"
              className="project-card__trigger"
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={handleTriggerClick}
            >
              {project.title}
              <span className="project-card__trace" aria-hidden="true" />
            </button>
          </h3>
          <ChevronDown
            className={`project-card__chevron ${isExpanded ? 'is-open' : ''}`}
            size={20}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>

        <p className="project-card__description">{project.shortDescription}</p>

        <div className="project-card__tags">
          <span className="tag project-card__category-tag">{project.category}</span>
          {project.techStack.map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div
        id={panelId}
        className={`project-card__panel ${isExpanded ? 'is-open' : ''}`}
        aria-hidden={!isExpanded}
      >
        <div className="project-card__panel-inner">
          <dl className="project-card__case-study">
            <div>
              <dt className="mono-label">Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt className="mono-label">Problem</dt>
              <dd>{project.problem}</dd>
            </div>
            <div>
              <dt className="mono-label">Approach</dt>
              <dd>{project.approach}</dd>
            </div>
            <div>
              <dt className="mono-label">Challenges</dt>
              <dd>{project.challenges}</dd>
            </div>
            <div>
              <dt className="mono-label">Outcome</dt>
              <dd>{project.outcome}</dd>
            </div>
          </dl>

          {project.image ? (
            <img
              src={project.image}
              alt={project.imageAlt}
              className="project-card__image"
            />
          ) : (
            <p className="mono-label project-card__image-placeholder">
              [PLACEHOLDER: project screenshot]
            </p>
          )}

          <div className="project-card__links">
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="project-card__link"
              tabIndex={isExpanded ? 0 : -1}
            >
              <Github size={18} strokeWidth={1.75} aria-hidden="true" />
              Code
            </a>
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="project-card__link"
              tabIndex={isExpanded ? 0 : -1}
            >
              <ExternalLink size={18} strokeWidth={1.75} aria-hidden="true" />
              Live
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
