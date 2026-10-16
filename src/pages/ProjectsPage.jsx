import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import projects from '../data/projectCatalog.js';
import ProjectCard, { categoryLabels } from '../components/portfolio/ProjectCard.jsx';
import { PageHeading } from '../components/portfolio/SiteLayout.jsx';
import '../styles/projects.css';

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams();
  const pendingParams = useRef(params);
  const [currentParams, setCurrentParams] = useState(params);
  useEffect(() => {
    pendingParams.current = params;
    setCurrentParams(params);
  }, [params]);
  // Apply controls immediately while React Router schedules the URL transition.
  const query = currentParams.get('q') || '';
  const category = Object.hasOwn(categoryLabels, currentParams.get('category'))
    ? currentParams.get('category')
    : 'all';
  const technology = currentParams.get('tech') || '';
  const liveOnly = currentParams.get('live') === '1';
  const technologies = [...new Set(projects.flatMap((project) => project.techStack))].sort();
  const update = (key, value) => {
    const next = new URLSearchParams(pendingParams.current);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    pendingParams.current = next;
    setCurrentParams(next);
    setParams(next, { replace: true });
  };
  const resetFilters = () => {
    pendingParams.current = new URLSearchParams();
    setCurrentParams(pendingParams.current);
    setParams({}, { replace: true });
  };
  const filtered = useMemo(
    () =>
      projects.filter(
        (project) =>
          (category === 'all' || category === project.category) &&
          (!liveOnly || Boolean(project.links.live)) &&
          (!technology || project.techStack.includes(technology)) &&
          [
            project.title,
            project.shortDescription,
            categoryLabels[project.category],
            ...project.techStack,
          ]
            .join(' ')
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [query, category, technology, liveOnly],
  );
  return (
    <main id="main-content" tabIndex={-1} className="container page-content collection-page">
      <PageHeading title="Projects">
        Web, mobile, embedded systems, and software QA. Explore each project's purpose,
        contribution, and available demos, source, or documentation.
      </PageHeading>
      <section className="collection-index" id="project-index" aria-label="Project collection">
        <div className="project-filters">
          <label className="search-field">
            <Search size={18} />
            <span className="visually-hidden">Search projects or technologies</span>
            <input
              type="search"
              placeholder="Search projects…"
              value={query}
              onChange={(event) => update('q', event.target.value)}
            />
            {query && (
              <button
                className="icon-button"
                aria-label="Clear search"
                onClick={() => update('q', '')}
              >
                <X size={17} />
              </button>
            )}
          </label>
          <label className="technology-field">
            <span className="visually-hidden">Filter by technology</span>
            <select
              aria-label="Filter by technology"
              value={technology}
              onChange={(event) => update('tech', event.target.value)}
            >
              <option value="">All technologies</option>
              {technology && !technologies.includes(technology) && (
                <option value={technology}>{technology}</option>
              )}
              {technologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="filter-options">
          <div className="category-filters" role="group" aria-label="Filter projects by category">
            {[['all', 'All projects'], ...Object.entries(categoryLabels)].map(([key, label]) => (
              <button
                key={key}
                aria-pressed={category === key}
                onClick={() => update('category', key)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="live-filter">
            <input
              type="checkbox"
              checked={liveOnly}
              onChange={(event) => update('live', event.target.checked ? '1' : '')}
            />
            Live demos only
          </label>
        </div>
        <div className="results-heading">
          <span role="status" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
          </span>
          {(query || category !== 'all' || liveOnly || technology) && (
            <button className="text-link" onClick={resetFilters}>
              Clear filters <X size={14} />
            </button>
          )}
        </div>
        {filtered.length ? (
          <div className="work-grid project-results">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No projects found</h2>
            <p>Try a different search or clear the filters.</p>
            <button className="button button-outline" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
