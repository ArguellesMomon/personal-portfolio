import { useEffect, useRef } from 'react';

const MAX_SHIFT = 8; // px — kept small so it reads as "expensive," not silly

// Nudges the element a few pixels toward the cursor while the pointer is
// within `radius` of its center, easing back to rest on leave. Same
// direct-DOM-write pattern as useSpotlight/useCursorGlow — writes CSS
// custom properties rather than `style.transform` directly, so this
// composes with Button.css's own `:hover { transform: translateY(-2px) }`
// (see `.btn { transform: translate(var(--magnetic-x), var(--magnetic-y)) }`
// in Button.css) instead of an inline style silently overriding it.
export default function useMagnetic({ radius = 90 } = {}) {
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
      node.style.setProperty('--magnetic-x', `${x}px`);
      node.style.setProperty('--magnetic-y', `${y}px`);
    };

    const scheduleOffset = (x, y) => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => applyOffset(x, y));
    };

    const handlePointerMove = (event) => {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      if (distance > radius) {
        scheduleOffset(0, 0);
        return;
      }

      // Falls off toward the edge of the radius rather than jumping to
      // full strength the instant the cursor enters it.
      const pull = 1 - distance / radius;
      scheduleOffset((dx / radius) * MAX_SHIFT * pull, (dy / radius) * MAX_SHIFT * pull);
    };

    const handlePointerLeave = () => scheduleOffset(0, 0);

    window.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerleave', handlePointerLeave);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [radius]);

  return ref;
}
