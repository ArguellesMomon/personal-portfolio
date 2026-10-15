import { useEffect, useRef, useState } from 'react';
import ProjectCard from './ProjectCard.jsx';
import { useMotion } from './MotionContext.jsx';
import '../../styles/featured-projects.css';

export default function FeaturedProjects({ projects }) {
  const track = useRef(null);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 560px)').matches);
  const { enabled } = useMotion();

  useEffect(() => {
    const media = window.matchMedia('(max-width: 560px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const move = (direction) => {
    const element = track.current;
    const distances = [...element.children].map((child) =>
      Math.abs(child.getBoundingClientRect().left - element.getBoundingClientRect().left - 4),
    );
    const index = distances.indexOf(Math.min(...distances)) + direction;
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
    <div
      ref={track}
      id="featured-projects"
      className="work-grid featured-project-track"
      role="region"
      aria-label="Featured projects"
      tabIndex={mobile ? 0 : undefined}
      onKeyDown={(event) => {
        if (!mobile || event.target !== event.currentTarget) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          move(event.key === 'ArrowRight' ? 1 : -1);
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
  );
}
