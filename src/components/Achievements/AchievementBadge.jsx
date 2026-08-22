import { Award, BadgeCheck } from 'lucide-react';
import { CATEGORY_ICONS, CATEGORY_TINT } from './categoryIcons.js';
import './AchievementBadge.css';

export default function AchievementBadge({ category, verified }) {
  const CategoryIcon = CATEGORY_ICONS[category] || Award;
  const tint = CATEGORY_TINT[category] || 'signal';

  return (
    <span className={`achievement-badge achievement-badge--${tint}`} aria-hidden="true">
      <CategoryIcon size={24} strokeWidth={1.75} />
      {verified && (
        <span className="achievement-badge__verified">
          <BadgeCheck size={13} strokeWidth={2.25} />
        </span>
      )}
    </span>
  );
}
