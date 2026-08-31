import { ISSUER_LOGOS, ISSUER_FALLBACK_ICON } from './issuers.js';
import './AchievementBadge.css';

// Real issuer logo in a small white chip (so any logo's own background —
// DataCamp's full-bleed green, JPCS's white — displays cleanly regardless
// of what it ships with) when one exists; a plain icon on the site's own
// dark chip otherwise, for personal milestones that aren't issued by a
// platform (e.g. a thesis defense) and so have nothing to show a logo for.
export default function AchievementBadge({ issuer }) {
  const logo = ISSUER_LOGOS[issuer];

  if (logo) {
    return (
      <span className="achievement-badge achievement-badge--logo" aria-hidden="true">
        <img src={logo} alt="" className="achievement-badge__logo" />
      </span>
    );
  }

  const FallbackIcon = ISSUER_FALLBACK_ICON;
  return (
    <span className="achievement-badge" aria-hidden="true">
      <FallbackIcon size={22} strokeWidth={1.75} />
    </span>
  );
}
