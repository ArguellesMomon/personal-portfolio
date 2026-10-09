import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import ProjectArtwork from './ProjectArtwork.jsx';
import { projectFocus } from '../../data/projectPresentation.js';

export default function ProjectSpotlight({ projects }) {
  const [selected, setSelected] = useState(0);
  const project = projects[selected];
  const location = useLocation();
  return (
    <header className="collection-opening">
      <div className="collection-intro">
        <span className="eyebrow">RICHMOND ARGUELLES / SELECTED WORK & EXPLORATIONS</span>
        <h1>
          Ideas, made
          <br />
          <em>useful.</em>
        </h1>
        <p>
          From acoustic sensing to everyday apps. A collection of problems I’ve worked through, the
          decisions behind them, and the things I’m still exploring.
        </p>
        <a className="text-link collection-jump" href="#project-index">
          Explore the collection <ArrowDown size={17} />
        </a>
        <div className="collection-disciplines">
          <span>Web</span>
          <span>Mobile</span>
          <span>Embedded</span>
          <span>Data</span>
        </div>
      </div>
      <div className="featured-work">
        <div className="featured-work-label">
          <span className="eyebrow">IN FOCUS</span>
          <span>
            {String(selected + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>
        <div id="featured-project" aria-live="polite" aria-atomic="true">
          <div className="featured-stage" key={project.id}>
            <Link
              className="featured-image"
              to={`/projects/${project.id}`}
              state={{ collectionUrl: `${location.pathname}${location.search}` }}
              aria-label={`Read the featured ${project.title} case study`}
            >
              <ProjectArtwork project={project} cover />
            </Link>
            <p className="featured-image-note">
              {project.coverCaption || 'Public live website / screenshot'}
            </p>
            <div className="featured-caption">
              <div>
                <span className="eyebrow">{project.title}</span>
                <h2>{projectFocus[project.id]}</h2>
              </div>
              <Link
                to={`/projects/${project.id}`}
                state={{ collectionUrl: `${location.pathname}${location.search}` }}
                aria-label={`Explore featured project ${project.title}`}
              >
                <ArrowUpRight size={26} />
              </Link>
            </div>
          </div>
        </div>
        <div className="featured-selector" aria-label="Choose a featured project">
          {projects.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
              aria-controls="featured-project"
              aria-label={`Select featured project ${item.title}`}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
