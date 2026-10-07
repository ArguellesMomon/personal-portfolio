import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import ProjectArtwork from './ProjectArtwork.jsx';
import { categoryLabels } from './ProjectCard.jsx';
export default function ProjectDialog({ project, onClose }) {
  const dialog = useRef(null);
  const location = useLocation();
  const collectionUrl =
    location.pathname === '/projects' ? `${location.pathname}${location.search}` : '/projects';
  useEffect(() => {
    if (!project) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [project]);
  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') return;
    const focusable = dialog.current.querySelectorAll('button, a[href]');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="dialog-title"
      onKeyDown={handleKeyDown}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      {project && (
        <>
          <button
            autoFocus
            className="dialog-close icon-button"
            onClick={onClose}
            aria-label="Close project preview"
          >
            <X size={20} />
          </button>
          <ProjectArtwork project={project} />
          <div className="dialog-content">
            <span className="eyebrow">{categoryLabels[project.category]}</span>
            <h2 id="dialog-title">{project.title}</h2>
            <p>{project.shortDescription}</p>
            <div className="tags">
              {project.techStack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
            {project.role && (
              <div className="dialog-role">
                <span className="eyebrow">MY ROLE</span>
                <p>{project.role}</p>
              </div>
            )}
            <Link
              className="button"
              onClick={onClose}
              to={`/projects/${project.id}`}
              state={{ collectionUrl }}
            >
              Explore the project <ArrowRight size={17} />
            </Link>
          </div>
        </>
      )}
    </dialog>
  );
}
