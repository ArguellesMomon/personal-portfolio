import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import achievements from '../data/achievements.json';
import AchievementCard from '../components/Achievements/AchievementCard.jsx';
import FilterBar from '../components/shared/FilterBar/FilterBar.jsx';
import EmptyState from '../components/shared/EmptyState/EmptyState.jsx';
import { ISSUER_ORDER } from '../components/Achievements/issuers.js';
import useScrollReveal from '../hooks/useScrollReveal';
import './AchievementsPage.css';

export default function AchievementsPage() {
  const headerRef = useScrollReveal();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIssuer, setActiveIssuer] = useState('all');

  useEffect(() => {
    document.title = 'Achievements — Richmond Arguelles';
    return () => {
      document.title = 'Richmond Arguelles — Computer Science Portfolio';
    };
  }, []);

  // Entries without a real title are still-unconfirmed scaffolding (see
  // achievements.json) — excluded everywhere on this page rather than
  // showing placeholder text to a visitor.
  const confirmedAchievements = useMemo(
    () => achievements.filter((item) => item.title),
    []
  );

  // No per-chip icon here (unlike Projects' category chips) — the real
  // issuer logo already appears on every card, so a chip icon would just
  // be a second, less accurate attempt at the same signal. The issuer
  // name string doubles as both the data key and the display label, since
  // "DataCamp" etc. is already exactly what should show on screen.
  const issuers = useMemo(() => {
    const counts = confirmedAchievements.reduce((acc, item) => {
      acc[item.issuer] = (acc[item.issuer] || 0) + 1;
      return acc;
    }, {});

    const ordered = ISSUER_ORDER.filter((issuer) => counts[issuer]).map((issuer) => ({
      id: issuer,
      label: issuer,
      count: counts[issuer],
    }));

    return [{ id: 'all', label: 'All', count: confirmedAchievements.length }, ...ordered];
  }, [confirmedAchievements]);

  const query = searchQuery.trim().toLowerCase();

  const filteredAchievements = useMemo(() => {
    return confirmedAchievements.filter((item) => {
      if (activeIssuer !== 'all' && item.issuer !== activeIssuer) return false;
      if (!query) return true;

      const haystack = [item.title, item.issuer, item.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [confirmedAchievements, activeIssuer, query]);

  // Same rationale as ProjectsPage: group into sections only for the
  // unfiltered "browse everything" state.
  const shouldGroup = activeIssuer === 'all' && query === '';

  const groupedAchievements = useMemo(() => {
    if (!shouldGroup) return null;
    return ISSUER_ORDER.filter((issuer) =>
      filteredAchievements.some((item) => item.issuer === issuer)
    ).map((issuer) => ({
      id: issuer,
      label: issuer,
      items: filteredAchievements.filter((item) => item.issuer === issuer),
    }));
  }, [shouldGroup, filteredAchievements]);

  const resultsKey = `${activeIssuer}::${query}`;

  const noneConfirmedYet = confirmedAchievements.length === 0;

  const emptyMessage = noneConfirmedYet
    ? 'Certifications, seminars, and milestones are being added here — check back soon.'
    : query
    ? `No achievements match "${searchQuery.trim()}"${
        activeIssuer !== 'all' ? ` from ${activeIssuer}` : ''
      }.`
    : 'No achievements from this issuer yet.';

  const handleReset = () => {
    setSearchQuery('');
    setActiveIssuer('all');
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
              Certifications, seminars, and academic milestones from my
              degree so far.
            </p>
          </div>
        </div>

        {!noneConfirmedYet && (
          <FilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search credentials…"
            searchLabel="Search achievements"
            categories={issuers}
            activeCategory={activeIssuer}
            onCategoryChange={setActiveIssuer}
            resultCount={filteredAchievements.length}
            totalCount={confirmedAchievements.length}
            itemLabel="credentials"
          />
        )}

        {filteredAchievements.length === 0 ? (
          <EmptyState message={emptyMessage} onReset={noneConfirmedYet ? undefined : handleReset} />
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
