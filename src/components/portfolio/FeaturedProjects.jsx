import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProjectCard from './ProjectCard.jsx';
import { useMotion } from './MotionContext.jsx';
import '../../styles/featured-projects.css';

export default function FeaturedProjects({ projects }) {
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 560px)').matches);
  const { enabled } = useMotion();

  useEffect(() => {
    const media = window.matchMedia('(max-width: 560px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = track.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const left = element.getBoundingClientRect().left;
      const distances = [...element.children].map((child) =>
        Math.abs(child.getBoundingClientRect().left - left - 4),
      );
      setActive(distances.indexOf(Math.min(...distances)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    element.addEventListener('scroll', schedule, { passive: true });
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener('scroll', schedule);
    };
  }, []);

  const move = (index) => {
    const element = track.current;
    const child = element.children[Math.max(0, Math.min(projects.length - 1, index))];
    element.scrollTo({
      left:
        element.scrollLeft +
        child.getBoundingClientRect().left -
        element.getBoundingClientRect().left -
        4,
      behavior: enabled ? 'smooth' : 'instant',
    });
  };

  return (
    <>
      <div
        ref={track}
        id="featured-projects"
        className="work-grid featured-project-track"
        role="region"
        aria-label="Featured projects"
        aria-describedby={mobile ? 'featured-project-hint' : undefined}
        tabIndex={mobile ? 0 : undefined}
        onKeyDown={(event) => {
          if (!mobile || event.target !== event.currentTarget) return;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            move(active + (event.key === 'ArrowRight' ? 1 : -1));
          }
        }}
      >
        {projects.map((project, index) => (
          <div
            className="home-project-reveal"
            key={project.id}
            data-reveal={mobile ? undefined : ''}
            style={{ '--reveal-delay': `${index * 100}ms` }}
          >
            <ProjectCard project={project} headingLevel="h3" />
          </div>
        ))}
      </div>
      <div className="featured-project-controls">
        <span id="featured-project-hint">Swipe to explore</span>
        <div className="featured-project-navigation">
          <button
            className="icon-button"
            aria-label="Previous featured project"
            aria-controls="featured-projects"
            disabled={active === 0}
            onClick={() => move(active - 1)}
          >
            <ArrowLeft size={18} />
          </button>
          <span
            className="featured-project-position"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {active + 1} of {projects.length}
          </span>
          <button
            className="icon-button"
            aria-label="Next featured project"
            aria-controls="featured-projects"
            disabled={active === projects.length - 1}
            onClick={() => move(active + 1)}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
