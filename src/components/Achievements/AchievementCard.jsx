import useSpotlight from '../../hooks/useSpotlight';
import AchievementBadge from './AchievementBadge.jsx';

export default function AchievementCard({ item, className = '', style }) {
  const { ref: cardRef, handleMouseMove } = useSpotlight();

  return (
    <li
      ref={cardRef}
      className={`card achievements__item ${className}`.trim()}
      style={style}
      onMouseMove={handleMouseMove}
    >
      <AchievementBadge category={item.category} verified={Boolean(item.verifyUrl)} />

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
