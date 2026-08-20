import { Award } from 'lucide-react';
import useSpotlight from '../../hooks/useSpotlight';
import { CATEGORY_ICONS } from './categoryIcons.js';

export default function AchievementCard({ item, className = '', style }) {
  const { ref: cardRef, handleMouseMove } = useSpotlight();
  // Falls back to a plain Award mark for any item without a recognized
  // category, so this never renders blank if the dataset is extended later.
  const CategoryIcon = CATEGORY_ICONS[item.category] || Award;

  return (
    <li
      ref={cardRef}
      className={`card achievements__item ${className}`.trim()}
      style={style}
      onMouseMove={handleMouseMove}
    >
      <span className="achievements__icon-chip" aria-hidden="true">
        <CategoryIcon size={22} strokeWidth={1.75} />
      </span>

      <h3 className="achievements__title">{item.title}</h3>

      {item.issuer ? (
        <p className="mono-label achievements__issuer">{item.issuer}</p>
      ) : (
        <p className="achievements__description">{item.description}</p>
      )}

      <p className="mono-label achievements__date">{item.date}</p>

      {item.verifyUrl && (
        <a
          href={item.verifyUrl}
          target="_blank"
          rel="noreferrer"
          className="mono-label achievements__verify"
        >
          &lsaquo; Verify &rsaquo;
        </a>
      )}
    </li>
  );
}
