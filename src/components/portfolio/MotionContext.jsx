import { createContext, useContext, useEffect, useState } from 'react';

const MotionContext = createContext(null);
export function MotionProvider({ children }) {
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem('portfolio-motion') === 'paused';
    } catch {
      return false;
    }
  });
  const [systemReduced, setSystemReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const enabled = !paused && !systemReduced;
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (event) => setSystemReduced(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'full' : 'reduced';
    try {
      localStorage.setItem('portfolio-motion', paused ? 'paused' : 'full');
    } catch {
      /* Motion preference also works without persistent storage. */
    }
  }, [enabled, paused]);
  return (
    <MotionContext.Provider value={{ enabled, paused, systemReduced, setPaused }}>
      {children}
    </MotionContext.Provider>
  );
}
export const useMotion = () => useContext(MotionContext);
