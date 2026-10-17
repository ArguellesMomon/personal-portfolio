import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';

export default function ScreenshotDialog({ project, onClose, returnFocus }) {
  const artwork = project.imageSourceType === 'artwork';
  const dialog = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
    };
  }, [project, returnFocus]);
  const closeOnBackdrop = (event) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      onClose();
  };
  return (
    <dialog
      ref={dialog}
      className="screenshot-dialog"
      aria-labelledby="screenshot-title"
      onClick={closeOnBackdrop}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const buttons = dialog.current.querySelectorAll('button');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <header className="screenshot-toolbar">
        <h2 id="screenshot-title">
          {project.title} — {artwork ? 'artwork preview' : 'screenshot'}
        </h2>
        <button
          autoFocus
          className="icon-button"
          aria-label={artwork ? 'Close preview' : 'Close screenshot'}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </header>
      <div
        className={`screenshot-stage ${zoomed ? 'is-zoomed' : ''}`}
        tabIndex={0}
        role="region"
        aria-label={`Project ${artwork ? 'artwork preview' : 'screenshot'}; scroll to explore at actual size`}
        style={{ '--image-width': `${project.imageWidth || 1600}px` }}
      >
        <img
          src={project.image}
          alt={project.imageAlt || project.title}
          width={project.imageWidth}
          height={project.imageHeight}
        />
      </div>
      <footer className="screenshot-controls">
        <span>
          {zoomed
            ? 'Scroll to explore the details.'
            : artwork
              ? 'A closer look at the scene artwork.'
              : 'A closer look at the actual interface.'}
        </span>
        <button
          className="button button-outline button-small"
          aria-pressed={zoomed}
          onClick={() => setZoomed(!zoomed)}
        >
          {zoomed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          {zoomed ? 'Fit to screen' : 'Actual size'}
        </button>
      </footer>
    </dialog>
  );
}
