import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import projects from '../data/projectCatalog.js';
import ProjectCard, { categoryLabels } from '../components/portfolio/ProjectCard.jsx';
import ProjectDialog from '../components/portfolio/ProjectDialog.jsx';
import { ContactBanner, PageHeading } from '../components/portfolio/SiteLayout.jsx';

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams();
  // Keep controls responsive and compose rapid changes before URL transitions finish.
  const pendingParams = useRef(params);
  const [currentParams, setCurrentParams] = useState(params);
  useEffect(() => {
    pendingParams.current = params;
    setCurrentParams(params);
  }, [params]);
  const commitParams = (next) => {
    pendingParams.current = next;
    setCurrentParams(next);
    setParams(next, { replace: true });
  };
  const view = currentParams.get('view') === 'list' ? 'list' : 'grid';
  const liveOnly = currentParams.get('live') === '1';
  const [preview, setPreview] = useState(null);
  const query = currentParams.get('q') || '';
  const category = Object.keys(categoryLabels).includes(currentParams.get('category'))
    ? currentParams.get('category')
    : 'all';
  const sort = currentParams.get('sort') === 'name' ? 'name' : 'featured';
  const update = (key, value) => {
    const next = new URLSearchParams(pendingParams.current);
    if (!value || value === 'all' || value === 'featured' || value === 'grid') next.delete(key);
    else next.set(key, value);
    commitParams(next);
  };
  const resetFilters = () => {
    const next = new URLSearchParams(pendingParams.current);
    for (const key of ['q', 'category', 'live']) next.delete(key);
    commitParams(next);
  };
  const filtered = useMemo(() => {
    const results = projects.filter(
      (project) =>
        (category === 'all' || category === project.category) &&
        (!liveOnly || Boolean(project.links.live)) &&
        [
          project.title,
          project.shortDescription,
          project.category,
          categoryLabels[project.category],
          ...project.techStack,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
    return sort === 'name' ? results.sort((a, b) => a.title.localeCompare(b.title)) : results;
  }, [query, category, sort, liveOnly]);
  return (
    <main id="main-content" tabIndex={-1} className="container page-content">
      <PageHeading eyebrow="THE PROJECT COLLECTION" title="Built with purpose">
        Web, mobile, hardware, and a little curiosity. Explore the problems, the process, and the
        thinking behind each build.
      </PageHeading>
      <div className="project-toolbar">
        <label className="search-field">
          <Search size={19} />
          <span className="visually-hidden">Search projects or technologies</span>
          <input
            type="search"
            placeholder="Search projects or technologies…"
            value={query}
            onChange={(event) => update('q', event.target.value)}
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => update('q', '')}
            >
              <X size={16} />
            </button>
          )}
        </label>
        <label className="sort-field">
          <SlidersHorizontal size={16} />
          <span className="visually-hidden">Sort projects</span>
          <select value={sort} onChange={(event) => update('sort', event.target.value)}>
            <option value="featured">Featured first</option>
            <option value="name">Name: A–Z</option>
          </select>
        </label>
        <div className="view-switch" aria-label="Project layout">
          <button
            className={view === 'grid' ? 'active' : ''}
            aria-label="Grid view"
            aria-pressed={view === 'grid'}
            onClick={() => update('view', 'grid')}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            aria-label="List view"
            aria-pressed={view === 'list'}
            onClick={() => update('view', 'list')}
          >
            <List size={19} />
          </button>
        </div>
      </div>
      <div className="category-filters" aria-label="Filter projects by category">
        {[['all', 'All projects'], ...Object.entries(categoryLabels)].map(([key, label]) => (
          <button
            key={key}
            className={category === key ? 'active' : ''}
            onClick={() => update('category', key)}
            aria-pressed={category === key}
          >
            {label}
            <span>
              {key === 'all'
                ? projects.length
                : projects.filter((project) => project.category === key).length}
            </span>
          </button>
        ))}
      </div>
      <label className="live-filter">
        <input
          type="checkbox"
          checked={liveOnly}
          onChange={(event) => update('live', event.target.checked ? '1' : '')}
        />
        Live demos only <span>Try a project in your browser</span>
      </label>
      <div className="results-heading">
        <span role="status" aria-live="polite">
          Showing {filtered.length} of {projects.length} projects
        </span>
        {(query || category !== 'all' || liveOnly) && (
          <button className="text-link" onClick={resetFilters}>
            Clear filters <X size={14} />
          </button>
        )}
      </div>
      {filtered.length ? (
        <div className={`work-grid project-results ${view === 'list' ? 'list-view' : ''}`}>
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onPreview={setPreview} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={30} />
          <h2>No projects found</h2>
          <p>Try another technology or browse the full collection.</p>
          <button className="button button-outline" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      )}
      <ContactBanner />
      <ProjectDialog project={preview} onClose={() => setPreview(null)} />
    </main>
  );
}
