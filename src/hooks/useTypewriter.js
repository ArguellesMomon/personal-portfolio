import { useEffect, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

const DEFAULT_SPEED = 45; // ms per character

// Types `text` out one character at a time starting after `startDelay` —
// meant to kick in right as the containing element's own fade/rise
// animation (see .hero__enter in Hero.css) settles, not compete with it.
// Reduced-motion users get the finished string immediately.
export default function useTypewriter(text, { startDelay = 0, speed = DEFAULT_SPEED } = {}) {
  const [output, setOutput] = useState('');
  const [isDone, setIsDone] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setOutput(text);
      setIsDone(true);
      return undefined;
    }

    setOutput('');
    setIsDone(false);
    let index = 0;
    let intervalId;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1;
        setOutput(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          setIsDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, startDelay, speed, prefersReducedMotion]);

  return { text: output, isDone };
}
