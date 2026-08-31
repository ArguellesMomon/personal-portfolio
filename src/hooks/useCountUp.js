import { useEffect, useRef, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

const DEFAULT_DURATION = 1400;

// Ease-out cubic — starts fast, settles gently into the final number rather
// than ticking up at a constant rate, which reads as more "alive."
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Counts up from 0 to `target` once the returned ref scrolls into view,
// mirroring useScrollReveal's "fires once via IntersectionObserver" pattern
// rather than introducing a different trigger mechanism for this one case.
// Reduced-motion users get the final number immediately, no animation.
export default function useCountUp(target, { duration = DEFAULT_DURATION } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (prefersReducedMotion) {
      setValue(target);
      return undefined;
    }

    let frameId;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(node);

        const start = performance.now();

        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          setValue(Math.round(target * easeOutCubic(progress)));
          if (progress < 1) {
            frameId = requestAnimationFrame(tick);
          }
        };

        frameId = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target, duration, prefersReducedMotion]);

  return { ref, value };
}
