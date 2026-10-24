import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Maximize2,
  ClipboardCheck,
} from 'lucide-react';
import projects, { allProjects } from '../data/projectCatalog.js';
import ScreenshotDialog from '../components/portfolio/ScreenshotDialog.jsx';
import ProjectArtwork from '../components/portfolio/ProjectArtwork.jsx';
import { categoryLabels } from '../components/portfolio/ProjectCard.jsx';
import { groupStack } from '../data/projectPresentation.js';
import { useNavigationHistory } from '../components/portfolio/NavigationHistory.jsx';
import '../styles/projects.css';
import NotFoundPage from './NotFoundPage.jsx';

export default function ProjectPage() {
  const { projectId } = useParams();
  const location = useLocation();
  const history = useNavigationHistory();
  const sourceUrl = location.state?.returnTo ?? location.state?.collectionUrl;
  const sourcePath = typeof sourceUrl === 'string' ? sourceUrl.split(/[?#]/)[0] : '';
  const sourceLabels = {
    '/': 'home',
    '/projects': 'projects',
    '/about': 'about',
    '/achievements': 'certificates',
    '/contact': 'contact',
  };
  const sourceLabel =
    sourceLabels[sourcePath] ||
    allProjects.find((item) => sourcePath === `/projects/${item.id}`)?.title;
  const returnTo = sourceLabel ? sourceUrl : '/projects';
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
    ['problem', 'Purpose'],
    ['approach', project.category === 'QA' ? 'Testing approach' : 'Implementation'],
    ['challenges', project.category === 'QA' ? 'Coverage focus' : 'Technical focus'],
    ['outcome', 'Outcome'],
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
      <Link
        className="text-link back-link mobile-back-control"
        to={returnTo}
        state={location.state?.returnState}
        replace
        onClick={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          event.preventDefault();
          history.returnTo(returnTo, location.state?.returnState);
        }}
      >
        <ArrowLeft size={16} /> Back to {sourceLabel || 'projects'}
      </Link>
      <header className="project-heading">
        <span className="eyebrow">
          {categoryLabels[project.category]}
          {project.badge && ` · ${project.badge}`}
        </span>
        <h1>{project.title}</h1>
        <p>{project.shortDescription}</p>
      </header>
      <div className="project-primary-actions">
        {project.links.documentation && (
          <a className="button" href={project.links.documentation} target="_blank" rel="noreferrer">
            View QA workbook <ArrowUpRight size={17} />
          </a>
        )}
        {project.links.live && (
          <a className="button" href={project.links.live} target="_blank" rel="noreferrer">
            Visit live project <ArrowUpRight size={17} />
          </a>
        )}
        {project.links.github && (
          <a
            className="button button-outline"
            href={project.links.github}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={17} /> View source
          </a>
        )}
        <button
          className="text-link share-button"
          onClick={copyLink}
          aria-label="Copy project link"
          title="Copy project link"
        >
          {copyStatus === 'Link copied' ? <Check size={18} /> : <Copy size={18} />}
          Copy link
        </button>
        <span className="share-status" role="status">
          {copyStatus}
        </span>
      </div>
      {project.evidence ? (
        <section className="qa-evidence" aria-labelledby="qa-evidence-title">
          <div className="qa-evidence-heading">
            <ClipboardCheck size={26} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <span className="eyebrow">QA documentation</span>
              <h2 id="qa-evidence-title">{project.evidence.title}</h2>
            </div>
          </div>
          <p>{project.evidence.description}</p>
          <dl className="qa-coverage">
            {project.evidence.coverage.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.count}</dd>
              </div>
            ))}
          </dl>
          <p className="qa-evidence-source">
            {project.evidence.summary}{' '}
            <span>
              Recorded in the shared workbook; reviewed{' '}
              {new Date(project.evidence.reviewedAt + 'T00:00:00Z').toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC',
              })}
              .
            </span>
          </p>
        </section>
      ) : (
        <figure
          className={`project-figure ${project.imageLayout === 'portrait' ? 'project-figure-portrait' : ''} ${project.imageSourceType === 'diagram' ? 'project-figure-diagram' : ''}`}
        >
          <div className="project-screenshot">
            <ProjectArtwork project={project} large />
            {project.image && (
              <button
                ref={screenshotButton}
                className="screenshot-expand"
                onClick={() => setScreenshotOpen(true)}
              >
                <Maximize2 size={16} />{' '}
                {project.imageSourceType === 'diagram'
                  ? 'Enlarge diagram'
                  : project.imageSourceType === 'artwork'
                    ? 'Enlarge preview'
                    : 'Enlarge screenshot'}
              </button>
            )}
          </div>
          {project.image && project.imageSource && (
            <figcaption className="screenshot-note">
              {project.imageSourceType === 'diagram'
                ? 'System architecture · project report'
                : project.imageSourceType === 'artwork'
                  ? 'Scene artwork preview'
                  : project.imageSourceType === 'provided'
                    ? 'App screenshot'
                    : project.imageSourceType === 'repository'
                      ? 'Repository preview'
                      : 'Public website screenshot'}
              <a href={project.imageSource} target="_blank" rel="noreferrer">
                View original <ArrowUpRight size={13} />
              </a>
            </figcaption>
          )}
        </figure>
      )}
      {project.demoNote && <p className="demo-note">{project.demoNote}</p>}
      <div className="project-story">
        <aside className="project-facts">
          {project.role && (
            <div className="project-role">
              <h2>My role</h2>
              <p>{project.role}</p>
            </div>
          )}
          <nav className="case-chapters" aria-label="Case study sections">
            {chapters.map(([key, title]) => (
              <a key={key} href={`#case-${key}`}>
                {title}
                <ArrowRight size={14} />
              </a>
            ))}
          </nav>
          <div className="case-stack">
            <h2>{project.category === 'QA' ? 'Methods & tools' : 'Technologies'}</h2>
            {groupStack(project.techStack).map(({ label, items }) => (
              <div key={label}>
                <h3>{label}</h3>
                <ul className="tags">
                  {items.map((tech) => (
                    <li key={tech}>
                      <Link to={`/projects?tech=${encodeURIComponent(tech)}#project-index`}>
                        {tech}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
        <div className="story-content">
          {chapters.map(([key, title]) => (
            <section key={key} id={`case-${key}`}>
              <h2>{title}</h2>
              <p>{project[key]}</p>
            </section>
          ))}
        </div>
      </div>
      <Link
        className="next-project"
        to={`/projects/${next.id}`}
        state={{
          returnTo: `${location.pathname}${location.search}${location.hash}`,
          returnState: location.state,
        }}
      >
        <div>
          <span className="eyebrow">Next project</span>
          <h2>{next.title}</h2>
        </div>
        <ArrowRight size={23} />
      </Link>
      {screenshotOpen && (
        <ScreenshotDialog
          project={project}
          onClose={() => setScreenshotOpen(false)}
          returnFocus={screenshotButton}
        />
      )}
    </main>
  );
}
