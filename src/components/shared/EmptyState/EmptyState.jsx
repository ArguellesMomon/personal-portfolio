import { SearchX } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({ message, onReset }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        <SearchX size={26} strokeWidth={1.5} />
      </span>
      <p className="empty-state__message">{message}</p>
      {onReset && (
        <button type="button" className="empty-state__reset" onClick={onReset}>
          Clear filters
        </button>
      )}
    </div>
  );
}
