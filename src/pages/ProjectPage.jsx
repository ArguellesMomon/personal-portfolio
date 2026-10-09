import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Github, Maximize2 } from 'lucide-react';
import projects, { allProjects } from '../data/projectCatalog.js';
import ScreenshotDialog from '../components/portfolio/ScreenshotDialog.jsx';
import ProjectArtwork from '../components/portfolio/ProjectArtwork.jsx';
import { categoryLabels } from '../components/portfolio/ProjectCard.jsx';
import { ContactBanner } from '../components/portfolio/SiteLayout.jsx';
import { groupStack, projectFocus } from '../data/projectPresentation.js';
import '../styles/projects.css';
import NotFoundPage from './NotFoundPage.jsx';

export default function ProjectPage() {
  const { projectId } = useParams();
  const location = useLocation();
  const collectionUrl = location.state?.collectionUrl?.startsWith('/projects?')
    ? location.state.collectionUrl
    : '/projects';
  const project = allProjects.find((item) => item.id === projectId);
  const [copyStatus, setCopyStatus] = useState('');
  const [screenshotOpen, setScreenshotOpen] = useState(false);
  const screenshotButton = useRef(null);
  useEffect(() => {
    setCopyStatus('');
    setScreenshotOpen(false);
  }, [project]);
  useEffect(() => {
    if (!copyStatus) return;
    const timer = setTimeout(() => setCopyStatus(''), 3500);
    return () => clearTimeout(timer);
  }, [copyStatus]);
  if (!project) return <NotFoundPage />;
  const next =
    projects.find((item) => item.id !== project.id && item.category === project.category) ||
    projects.find((item) => item.id !== project.id);
  const chapters = [
    ['problem', '01', 'The problem'],
    ['approach', '02', 'The approach'],
    ['challenges', '03', 'The challenges'],
    ['outcome', '04', 'The outcome'],
  ].filter(([key]) => project[key]);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus('Link copied');
    } catch {
      setCopyStatus('Copy the URL from your address bar');
    }
  };
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="container page-content detail-page case-study-page"
    >
      <Link className="text-link back-link" to={collectionUrl}>
        <ArrowLeft size={16} /> Project collection
      </Link>
      <header className="project-heading enter">
        <div>
          <span className="eyebrow">
            {categoryLabels[project.category]} {project.badge && ` / ${project.badge}`}
          </span>
          <h1>
            {project.title}
            <span className="accent">.</span>
          </h1>
          <p>{project.shortDescription}</p>
        </div>
        <button className="button button-outline button-small" onClick={copyLink}>
          {copyStatus === 'Link copied' ? <Check size={16} /> : <Copy size={16} />} Share project
        </button>
      </header>
      <p className="share-status" role="status">
        {copyStatus}
      </p>
      <div className="project-primary-actions">
        {project.links.live && (
          <a
            className="button button-small"
            href={project.links.live}
            target="_blank"
            rel="noreferrer"
          >
            Visit live project <ArrowUpRight size={16} />
          </a>
        )}
        {project.links.github && (
          <a className="text-link" href={project.links.github} target="_blank" rel="noreferrer">
            <Github size={17} /> View source <ArrowUpRight size={16} />
          </a>
        )}
      </div>
      <div className="case-image-label">
        <span className="eyebrow">
          {project.image ? 'A LOOK AT THE BUILD' : 'ILLUSTRATING THE IDEA'}
        </span>
        <span>{project.image ? 'Project screenshot' : 'Concept illustration'}</span>
      </div>
      <div className="project-screenshot">
        <ProjectArtwork project={project} large />
        {project.image && (
          <button
            ref={screenshotButton}
            className="screenshot-expand"
            onClick={() => setScreenshotOpen(true)}
          >
            <Maximize2 size={17} /> Enlarge screenshot
          </button>
        )}
      </div>
      {project.image && project.imageSource && (
        <p className="screenshot-note">
          {project.imageSourceType === 'repository'
            ? 'Dashboard screenshot from the project repository.'
            : 'Screenshot of the public live website.'}{' '}
          <a href={project.imageSource} target="_blank" rel="noreferrer">
            View original <ArrowUpRight size={12} />
          </a>
        </p>
      )}
      {project.demoNote && <p className="demo-note">{project.demoNote}</p>}
      <div className="case-story-intro">
        <span className="eyebrow">BEHIND THE INTERFACE</span>
        <h2>{projectFocus[project.id] || 'Inside the build.'}</h2>
      </div>
      <div className="project-story">
        <aside className="project-facts">
          <span className="eyebrow">PROJECT AT A GLANCE</span>
          {chapters.length > 0 && (
            <nav className="case-chapters" aria-label="Case study chapters">
              {chapters.map(([key, number, title]) => (
                <a key={key} href={`#case-${key}`}>
                  <span>{number}</span>
                  {title}
                  <ArrowRight size={14} />
                </a>
              ))}
            </nav>
          )}
          <dl>
            <div>
              <dt>Focus</dt>
              <dd>{categoryLabels[project.category]}</dd>
            </div>
            {project.role && (
              <div>
                <dt>My role</dt>
                <dd>{project.role}</dd>
              </div>
            )}
          </dl>
          {project.techStack.length > 0 && (
            <div className="case-stack">
              <h3>The working stack</h3>
              <p>Select a tool to find other projects built with it.</p>
              {groupStack(project.techStack).map(({ label, items }) => (
                <div key={label}>
                  <h4>{label}</h4>
                  <div className="tags">
                    {items.map((tech) => (
                      <Link
                        key={tech}
                        to={`/projects?tech=${encodeURIComponent(tech)}#project-index`}
                      >
                        {tech}
                        <ArrowUpRight size={11} />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
        <div className="story-content">
          {chapters.map(([key, number, title]) => (
            <section key={key} id={`case-${key}`}>
              <span className="eyebrow">
                {number} / {title.toUpperCase()}
              </span>
              <h2>{title}</h2>
              <p>{project[key]}</p>
            </section>
          ))}
          {!project.problem && !project.approach && (
            <section>
              <span className="eyebrow">OVERVIEW</span>
              <h2>A smaller experiment</h2>
              <p>
                {project.shortDescription} This is part of my collection of smaller builds and
                explorations.
              </p>
            </section>
          )}
        </div>
      </div>
      <Link className="next-project" to={`/projects/${next.id}`} state={{ collectionUrl }}>
        <div>
          <span className="eyebrow">
            ANOTHER THREAD TO FOLLOW / {categoryLabels[next.category]}
          </span>
          <h2>{next.title}</h2>
          <p>{projectFocus[next.id] || next.shortDescription}</p>
        </div>
        <ArrowRight size={30} />
      </Link>
      <ContactBanner />
      {screenshotOpen && (
        <ScreenshotDialog
          project={project}
          returnFocus={screenshotButton}
          onClose={() => setScreenshotOpen(false)}
        />
      )}
    </main>
  );
}
