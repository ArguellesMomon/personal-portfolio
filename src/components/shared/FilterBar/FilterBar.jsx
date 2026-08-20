import { Search, X } from 'lucide-react';
import './FilterBar.css';

// Controlled search + category-chip toolbar. Deliberately dumb: all
// filtering logic lives in the page that owns the data (ProjectsPage /
// AchievementsPage), this just renders state and reports changes back up.
//
// `categories` — [{ id, label, count, Icon? }], "All" included by the caller
// `resultCount` / `totalCount` — for the "Showing X of Y" meta line
export default function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search…',
  searchLabel = 'Search',
  categories,
  activeCategory,
  onCategoryChange,
  resultCount,
  totalCount,
  itemLabel = 'items',
}) {
  const hasActiveFilters = activeCategory !== 'all' || searchValue.trim().length > 0;

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__row">
        <label className="filter-bar__search">
          <Search size={17} strokeWidth={1.75} aria-hidden="true" />
          <span className="visually-hidden">{searchLabel}</span>
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
          />
          {searchValue && (
            <button
              type="button"
              className="filter-bar__clear-search"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={15} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
        </label>

        <div className="filter-bar__chips" role="group" aria-label="Filter by category">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.Icon;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isActive}
                className={`filter-chip ${isActive ? 'is-active' : ''}`}
                onClick={() => onCategoryChange(cat.id)}
              >
                {Icon && <Icon size={14} strokeWidth={1.75} aria-hidden="true" />}
                {cat.label}
                <span className="filter-chip__count">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-bar__meta">
        <span className="mono-label filter-bar__count">
          {resultCount === totalCount
            ? `${totalCount} ${itemLabel}`
            : `Showing ${resultCount} of ${totalCount} ${itemLabel}`}
        </span>

        {hasActiveFilters && (
          <button type="button" className="mono-label filter-bar__reset" onClick={clearFilters}>
            <X size={13} strokeWidth={2} aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
