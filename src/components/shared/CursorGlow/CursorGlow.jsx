import useCursorGlow from '../../../hooks/useCursorGlow';
import './CursorGlow.css';

// Deliberately renders unconditionally (even on touch devices) — the hook
// itself no-ops there (see useCursorGlow.js), so the element just sits at
// opacity 0 the whole time rather than needing a second code path here.
export default function CursorGlow() {
  const ref = useCursorGlow();
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
