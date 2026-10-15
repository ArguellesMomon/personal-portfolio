import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const MotionContext = createContext(null);
// Preserve the motion choice already saved by the homepage.
const storageKey = 'portfolio-home-motion';

export function MotionProvider({ children }) {
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === 'paused';
    } catch {
      return false;
    }
  });
  const [systemReduced, setSystemReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const enabled = !paused && !systemReduced;
  const toggle = useCallback(() => setPaused((value) => !value), []);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (event) => setSystemReduced(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'full' : 'reduced';
    try {
      localStorage.setItem(storageKey, paused ? 'paused' : 'on');
    } catch {
      /* Controls work without storage. */
    }
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [enabled, paused]);
  const value = useMemo(
    () => ({ enabled, paused, systemReduced, toggle }),
    [enabled, paused, systemReduced, toggle],
  );
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export const useMotion = () => useContext(MotionContext);
