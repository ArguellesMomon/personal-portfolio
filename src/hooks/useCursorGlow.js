import { useEffect, useRef } from 'react';

// Same "write straight to the DOM node's style, don't touch React state"
// approach as useSpotlight — mousemove fires far too often to re-render on.
// This one drives a single fixed-position glow that trails the cursor
// across the *whole* page (including over opaque section backgrounds),
// rather than useSpotlight's per-card effect that only exists inside a
// card's own bounds.
export default function useCursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // Fine-pointer + hover-capable only: a "cursor" glow has no meaning on
    // a touch device, and skipping the listener entirely there is one less
    // per-frame cost on hardware that's often already the weaker device.
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!pointerQuery.matches || motionQuery.matches) return undefined;

    let frameId = null;
    let pendingX = 0;
    let pendingY = 0;

    const applyPosition = () => {
      frameId = null;
      node.style.setProperty('--cursor-x', `${pendingX}px`);
      node.style.setProperty('--cursor-y', `${pendingY}px`);
    };

    const handlePointerMove = (event) => {
      pendingX = event.clientX;
      pendingY = event.clientY;
      // Coalesces bursts of mousemove events into one style write per
      // animation frame instead of one per event.
      if (frameId === null) {
        frameId = requestAnimationFrame(applyPosition);
      }
    };

    const handlePointerEnter = () => node.style.setProperty('--cursor-opacity', '1');
    const handlePointerLeave = () => node.style.setProperty('--cursor-opacity', '0');

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerenter', handlePointerEnter);
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerenter', handlePointerEnter);
      document.removeEventListener('pointerleave', handlePointerLeave);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return ref;
}
