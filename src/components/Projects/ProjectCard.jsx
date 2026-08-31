import { useState } from 'react';
import { ChevronDown, ExternalLink, Github } from 'lucide-react';
import useSpotlight from '../../hooks/useSpotlight';
import { CATEGORY_ICONS } from './categoryIcons.js';
import ProjectMedia from './ProjectMedia.jsx';
import './Projects.css';

// Order the case-study dl renders in, when each field has real content.
const CASE_STUDY_FIELDS = [
  { key: 'role', label: 'Role' },
  { key: 'problem', label: 'Problem' },
  { key: 'approach', label: 'Approach' },
  { key: 'challenges', label: 'Challenges' },
  { key: 'outcome', label: 'Outcome' },
];

// Accessible accordion pattern: the actual toggle control is a <button> that
// wraps only the title (inside an <h3>), so its accessible name stays short.
// Clicking anywhere on the header also toggles, for a larger mouse/touch
// target, but that click handler sits on a non-interactive wrapper — the
// button remains the real, keyboard-operable control.
//
// Collapsed view is deliberately minimal — media, badge, title, and a
// 2-line description only. Tags, the case-study narrative, and the
// Code/Live links all live behind the expand: on a real mobile viewport a
// collapsed card was previously taking 55-65% of screen height with all
// of that visible up front, which reads as overwhelming when browsing a
// list of 8, not "detailed."
export default function ProjectCard({ project, className = '', style }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref: cardRef, handleMouseMove } = useSpotlight();
  const panelId = `project-panel-${project.id}`;
  const CategoryIcon = CATEGORY_ICONS[project.category];

  const toggle = () => setIsExpanded((open) => !open);

  const handleHeaderClick = () => toggle();
  const handleTriggerClick = (event) => {
    event.stopPropagation(); // avoid double-toggling with the header's own handler
    toggle();
  };

  return (
    <article
      ref={cardRef}
      className={`card project-card ${className}`.trim()}
      style={style}
      onMouseMove={handleMouseMove}
    >
      <ProjectMedia project={project} />

      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className="project-card__header" onClick={handleHeaderClick}>
        {project.badge && (
          <span className="mono-label project-card__badge">
            &lsaquo; {project.badge} &rsaquo;
          </span>
        )}

        <div className="project-card__top">
          <div className="project-card__title-row">
            {CategoryIcon && (
              <span className="project-card__icon-chip" aria-hidden="true">
                <CategoryIcon size={18} strokeWidth={1.75} />
              </span>
            )}
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
          </div>
          <ChevronDown
            className={`project-card__chevron ${isExpanded ? 'is-open' : ''}`}
            size={20}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>

        <p className="project-card__description">{project.shortDescription}</p>
      </div>

      <div
        id={panelId}
        className={`project-card__panel ${isExpanded ? 'is-open' : ''}`}
        aria-hidden={!isExpanded}
      >
        <div className="project-card__panel-inner">
          <div className="project-card__tags">
            <span className="tag project-card__category-tag">{project.category}</span>
            {project.techStack.map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>

          {/* Each row only renders once the data behind it is real — role/
              problem/approach are filled in for most projects, but
              challenges/outcome are intentionally left blank until there's
              a real answer rather than showing placeholder text to a
              visitor. Fill in the JSON field later and the row appears
              automatically; no component change needed. */}
          {CASE_STUDY_FIELDS.some(({ key }) => project[key]) && (
            <dl className="project-card__case-study">
              {CASE_STUDY_FIELDS.filter(({ key }) => project[key]).map(({ key, label }) => (
                <div key={key}>
                  <dt className="mono-label">{label}</dt>
                  <dd>{project[key]}</dd>
                </div>
              ))}
            </dl>
          )}

          {(project.links.github || project.links.live) && (
            <div className="project-card__links">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="project-card__link"
                  tabIndex={isExpanded ? 0 : -1}
                >
                  <Github size={16} strokeWidth={1.75} aria-hidden="true" />
                  Code
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="project-card__link"
                  tabIndex={isExpanded ? 0 : -1}
                >
                  <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
                  Live
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
