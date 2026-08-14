import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

const STAGGER_MS = 80;

// Wraps IntersectionObserver to reveal a section once, the first time it
// scrolls into view. Attach the returned ref to the section wrapper. Any
// direct child with the "reveal" class gets staggered by ~80ms per index
// (set as the --delay custom property that global.css transitions on).
export default function useScrollReveal({ threshold = 0.15 } = {}) {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const children = node.querySelectorAll(':scope > .reveal');
    children.forEach((child, index) => {
      const delay = prefersReducedMotion ? 0 : index * STAGGER_MS;
      child.style.setProperty('--delay', `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child) => child.classList.add('is-visible'));
          observer.unobserve(node);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, prefersReducedMotion]);

  return ref;
}
