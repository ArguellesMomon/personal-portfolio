import { useRef } from 'react';

// Tracks pointer position directly on the DOM node via CSS custom
// properties (--spotlight-x/--spotlight-y) instead of React state — setting
// state on every mousemove would trigger a re-render per event, which gets
// janky fast. This writes straight to the element's style, so it stays
// smooth regardless of how often mousemove fires.
//
// Pair with the `.card` spotlight overlay in global.css (a ::before radial
// gradient reading those same custom properties), or apply the same pattern
// to any element that wants the effect.
export default function useSpotlight() {
  const ref = useRef(null);

  const handleMouseMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
  };

  return { ref, handleMouseMove };
}
