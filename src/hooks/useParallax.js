import { useEffect, useRef } from 'react';

const MAX_SHIFT = 14; // px

// Writes --parallax-x/--parallax-y custom properties (consumed by
// .site-backdrop__image's transform in SiteBackdrop.css) based on cursor
// position relative to the viewport center — same rAF-coalesced,
// direct-DOM-write pattern as useCursorGlow/useMagnetic, and the same
// fine-pointer + non-reduced-motion gate.
export default function useParallax({ maxShift = MAX_SHIFT } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!pointerQuery.matches || motionQuery.matches) return undefined;

    let frameId = null;

    const applyOffset = (x, y) => {
      frameId = null;
      node.style.setProperty('--parallax-x', `${x}px`);
      node.style.setProperty('--parallax-y', `${y}px`);
    };

    const handlePointerMove = (event) => {
      // -1..1 across the viewport in each axis, inverted so the image
      // drifts opposite the cursor — the classic parallax "depth" cue.
      const nx = (event.clientX / window.innerWidth - 0.5) * -2;
      const ny = (event.clientY / window.innerHeight - 0.5) * -2;

      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => applyOffset(nx * maxShift, ny * maxShift));
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [maxShift]);

  return ref;
}
