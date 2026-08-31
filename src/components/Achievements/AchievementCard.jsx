import useSpotlight from '../../hooks/useSpotlight';
import AchievementBadge from './AchievementBadge.jsx';

// `compact` renders a small horizontal "logo + name" chip instead of the
// full card — used by the homepage preview (Achievements.jsx), which shows
// more of the wall at a glance rather than full detail on 3 picks. The full
// /achievements page always uses the default (non-compact) layout.
export default function AchievementCard({ item, className = '', style, compact = false }) {
  const { ref: cardRef, handleMouseMove } = useSpotlight();

  if (compact) {
    return (
      <li
        ref={cardRef}
        className={`card achievements__chip ${className}`.trim()}
        style={style}
        onMouseMove={handleMouseMove}
      >
        <AchievementBadge issuer={item.issuer} />
        <span className="achievements__chip-text">
          <span className="achievements__chip-title">{item.title}</span>
          <span className="mono-label achievements__chip-issuer">{item.issuer}</span>
        </span>
      </li>
    );
  }

  return (
    <li
      ref={cardRef}
      className={`card achievements__item ${className}`.trim()}
      style={style}
      onMouseMove={handleMouseMove}
    >
      <AchievementBadge issuer={item.issuer} />

      <h3 className="achievements__title">{item.title}</h3>

      {item.description ? (
        <p className="achievements__description">{item.description}</p>
      ) : (
        <p className="mono-label achievements__issuer">{item.issuer}</p>
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
