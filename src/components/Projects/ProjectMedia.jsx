import { CATEGORY_ICONS, CATEGORY_TINT } from './categoryIcons.js';
import './ProjectMedia.css';

// Real screenshot or designed placeholder, both inside the same "browser
// window" frame (the 3-dot chrome bar) — so a project without a screenshot
// yet doesn't look broken or unfinished next to ones that have one, and
// dropping in a real `image` later is a pure data change, no markup change.
export default function ProjectMedia({ project }) {
  const CategoryIcon = CATEGORY_ICONS[project.category];
  const tint = CATEGORY_TINT[project.category] || 'signal';

  return (
    <div className={`project-media project-media--${tint}`}>
      <div className="project-media__chrome" aria-hidden="true">
        <span className="project-media__dot project-media__dot--signal" />
        <span className="project-media__dot project-media__dot--ember" />
        <span className="project-media__dot project-media__dot--olive" />
      </div>

      {project.image ? (
        <img src={project.image} alt={project.imageAlt} className="project-media__image" />
      ) : (
        <div className="project-media__placeholder">
          {CategoryIcon && (
            <span className="project-media__icon" aria-hidden="true">
              <CategoryIcon size={30} strokeWidth={1.5} />
            </span>
          )}
          <span className="mono-label project-media__category">{project.category}</span>
        </div>
      )}
    </div>
  );
}
