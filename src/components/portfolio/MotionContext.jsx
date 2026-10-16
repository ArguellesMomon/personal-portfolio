import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const MotionContext = createContext(null);

export function MotionProvider({ children }) {
  const [systemReduced, setSystemReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const enabled = !systemReduced;
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (event) => setSystemReduced(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'full' : 'reduced';
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [enabled]);
  const value = useMemo(() => ({ enabled, systemReduced }), [enabled, systemReduced]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export const useMotion = () => useContext(MotionContext);
