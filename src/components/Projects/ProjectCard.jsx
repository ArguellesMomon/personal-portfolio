import { useRef, useState } from 'react';
import { ChevronDown, ExternalLink, Github, Cpu, Globe, Smartphone, LineChart } from 'lucide-react';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import './Projects.css';

// One icon per category, drawn from the same icon system as the rest of the
// site — this is purely a visual anchor for the card header, not a new set.
const CATEGORY_ICONS = {
  'Embedded/Hardware': Cpu,
  'Web App': Globe,
  Mobile: Smartphone,
  'ML/Data': LineChart,
};

const MAX_TILT_DEG = 8;

// Accessible accordion pattern: the actual toggle control is a <button> that
// wraps only the title (inside an <h3>), so its accessible name stays short.
// Clicking anywhere on the header also toggles, for a larger mouse/touch
// target, but that click handler sits on a non-interactive wrapper — the
// button remains the real, keyboard-operable control.
export default function ProjectCard({ project }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const panelId = `project-panel-${project.id}`;
  const CategoryIcon = CATEGORY_ICONS[project.category];

  const toggle = () => setIsExpanded((open) => !open);

  const handleHeaderClick = () => toggle();
  const handleTriggerClick = (event) => {
    event.stopPropagation(); // avoid double-toggling with the header's own handler
    toggle();
  };

  // Tilts the card toward the cursor — rotateY follows horizontal position,
  // rotateX follows vertical (inverted: cursor near the top tilts the top
  // edge back, like the card is leaning toward you).
  const handleMouseMove = (event) => {
    if (prefersReducedMotion) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;
    setTilt({
      x: -(relY - 0.5) * MAX_TILT_DEG * 2,
      y: (relX - 0.5) * MAX_TILT_DEG * 2,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const cardStyle = prefersReducedMotion
    ? undefined
    : {
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${
          isHovered ? -5 : 0
        }px)`,
      };

  return (
    <article
      ref={cardRef}
      className="card project-card"
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
