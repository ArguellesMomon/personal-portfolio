import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import projects from '../data/projects.json';
import ProjectCard from '../components/Projects/ProjectCard.jsx';
import FilterBar from '../components/shared/FilterBar/FilterBar.jsx';
import EmptyState from '../components/shared/EmptyState/EmptyState.jsx';
import { CATEGORY_ICONS, CATEGORY_ORDER } from '../components/Projects/categoryIcons.js';
import useScrollReveal from '../hooks/useScrollReveal';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const headerRef = useScrollReveal();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    document.title = 'Projects — [PLACEHOLDER: Your Name]';
    return () => {
      document.title = '[PLACEHOLDER: Your Name] — Computer Science Portfolio';
    };
  }, []);

  // Category chips, in the fixed CATEGORY_ORDER, each carrying a live count
  // — a category that has zero projects simply doesn't render a chip for it.
  const categories = useMemo(() => {
    const counts = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {});

    const ordered = CATEGORY_ORDER.filter((category) => counts[category]).map((category) => ({
      id: category,
      label: category,
      count: counts[category],
      Icon: CATEGORY_ICONS[category],
    }));

    return [{ id: 'all', label: 'All', count: projects.length }, ...ordered];
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (activeCategory !== 'all' && project.category !== activeCategory) return false;
      if (!query) return true;

      const haystack = [project.title, project.category, project.shortDescription, ...project.techStack]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [activeCategory, query]);

  // Grouped-by-category view (mirroring the reference site's sectioned
  // layout) only makes sense as the unfiltered "browse everything" state —
  // once someone is searching or has picked one category, a flat grid of
  // matches is more useful than a bunch of near-empty sections.
  const shouldGroup = activeCategory === 'all' && query === '';

  const groupedProjects = useMemo(() => {
    if (!shouldGroup) return null;
    return CATEGORY_ORDER.filter((category) =>
      filteredProjects.some((project) => project.category === category)
    ).map((category) => ({
      id: category,
      label: category,
      Icon: CATEGORY_ICONS[category],
      items: filteredProjects.filter((project) => project.category === category),
    }));
  }, [shouldGroup, filteredProjects]);

  // Remounting the results container on every filter change (via this key)
  // retriggers its CSS entrance animation — a lightweight substitute for
  // per-card scroll-reveal, which is a one-shot IntersectionObserver effect
  // that can't replay itself for cards that swap in after a filter change.
  const resultsKey = `${activeCategory}::${query}`;

  const emptyMessage = query
    ? `No projects match "${searchQuery.trim()}"${
        activeCategory !== 'all' ? ` in ${activeCategory}` : ''
      }.`
    : 'No projects in this category yet.';

  const handleReset = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  return (
    <main id="main-content" className="projects-page">
      <div className="projects-page__inner">
        <div ref={headerRef}>
          <Link to="/#projects" className="reveal projects-page__back">
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            Back to Home
          </Link>

          <div className="reveal">
            <h1 className="projects-page__title">Projects</h1>
            <p className="projects-page__intro">
              [PLACEHOLDER: one or two lines introducing the full list — e.g.
              the range of work below, from embedded ML to full-stack apps.]
            </p>
          </div>
        </div>

        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search projects or tech…"
          searchLabel="Search projects"
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          resultCount={filteredProjects.length}
          totalCount={projects.length}
          itemLabel="projects"
        />

        {filteredProjects.length === 0 ? (
          <EmptyState message={emptyMessage} onReset={handleReset} />
        ) : (
          <div key={resultsKey} className="projects-page__results">
            {shouldGroup ? (
              groupedProjects.map((group) => (
                <section
                  key={group.id}
                  className="projects-page__group"
                  aria-labelledby={`projects-group-${group.id}`}
                >
                  <div className="projects-page__group-header">
                    {group.Icon && (
                      <span className="projects-page__group-icon" aria-hidden="true">
                        <group.Icon size={15} strokeWidth={1.75} />
                      </span>
                    )}
                    <h2
                      id={`projects-group-${group.id}`}
                      className="mono-label projects-page__group-label"
                    >
                      {group.label}
                    </h2>
                    <span className="projects-page__group-rule" aria-hidden="true" />
                    <span className="mono-label projects-page__group-count">
                      {group.items.length}
                    </span>
                  </div>

                  <div className="projects-page__grid">
                    {group.items.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="projects-page__grid">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
