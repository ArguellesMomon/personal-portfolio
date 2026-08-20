import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import achievements from '../data/achievements.json';
import AchievementCard from '../components/Achievements/AchievementCard.jsx';
import FilterBar from '../components/shared/FilterBar/FilterBar.jsx';
import EmptyState from '../components/shared/EmptyState/EmptyState.jsx';
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from '../components/Achievements/categoryIcons.js';
import useScrollReveal from '../hooks/useScrollReveal';
import './AchievementsPage.css';

export default function AchievementsPage() {
  const headerRef = useScrollReveal();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    document.title = 'Achievements — [PLACEHOLDER: Your Name]';
    return () => {
      document.title = '[PLACEHOLDER: Your Name] — Computer Science Portfolio';
    };
  }, []);

  const categories = useMemo(() => {
    const counts = achievements.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const ordered = CATEGORY_ORDER.filter((category) => counts[category]).map((category) => ({
      id: category,
      label: CATEGORY_LABELS[category],
      count: counts[category],
      Icon: CATEGORY_ICONS[category],
    }));

    return [{ id: 'all', label: 'All', count: achievements.length }, ...ordered];
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const filteredAchievements = useMemo(() => {
    return achievements.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (!query) return true;

      const haystack = [item.title, item.issuer, item.description, CATEGORY_LABELS[item.category]]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [activeCategory, query]);

  // Same rationale as ProjectsPage: group into sections only for the
  // unfiltered "browse everything" state.
  const shouldGroup = activeCategory === 'all' && query === '';

  const groupedAchievements = useMemo(() => {
    if (!shouldGroup) return null;
    return CATEGORY_ORDER.filter((category) =>
      filteredAchievements.some((item) => item.category === category)
    ).map((category) => ({
      id: category,
      label: CATEGORY_LABELS[category],
      Icon: CATEGORY_ICONS[category],
      items: filteredAchievements.filter((item) => item.category === category),
    }));
  }, [shouldGroup, filteredAchievements]);

  const resultsKey = `${activeCategory}::${query}`;

  const emptyMessage = query
    ? `No achievements match "${searchQuery.trim()}"${
        activeCategory !== 'all' ? ` in ${CATEGORY_LABELS[activeCategory]}` : ''
      }.`
    : 'No achievements in this category yet.';

  const handleReset = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  return (
    <main id="main-content" className="achievements-page">
      <div className="achievements-page__inner">
        <div ref={headerRef}>
          <Link to="/#achievements" className="reveal achievements-page__back">
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            Back to Home
          </Link>

          <div className="reveal">
            <h1 className="achievements-page__title">Achievements &amp; Certifications</h1>
            <p className="achievements-page__intro">
              [PLACEHOLDER: one or two lines introducing the full list — e.g.
              certifications, honors, and milestones from your degree.]
            </p>
          </div>
        </div>

        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search credentials…"
          searchLabel="Search achievements"
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          resultCount={filteredAchievements.length}
          totalCount={achievements.length}
          itemLabel="credentials"
        />

        {filteredAchievements.length === 0 ? (
          <EmptyState message={emptyMessage} onReset={handleReset} />
        ) : (
          <div key={resultsKey} className="achievements-page__results">
            {shouldGroup ? (
              groupedAchievements.map((group) => (
                <section
                  key={group.id}
                  className="achievements-page__group"
                  aria-labelledby={`achievements-group-${group.id}`}
                >
                  <div className="achievements-page__group-header">
                    {group.Icon && (
                      <span className="achievements-page__group-icon" aria-hidden="true">
                        <group.Icon size={15} strokeWidth={1.75} />
                      </span>
                    )}
                    <h2
                      id={`achievements-group-${group.id}`}
                      className="mono-label achievements-page__group-label"
                    >
                      {group.label}
                    </h2>
                    <span className="achievements-page__group-rule" aria-hidden="true" />
                    <span className="mono-label achievements-page__group-count">
                      {group.items.length}
                    </span>
                  </div>

                  <ul className="achievements-page__grid">
                    {group.items.map((item) => (
                      <AchievementCard key={item.id} item={item} />
                    ))}
                  </ul>
                </section>
              ))
            ) : (
              <ul className="achievements-page__grid">
                {filteredAchievements.map((item) => (
                  <AchievementCard key={item.id} item={item} />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
