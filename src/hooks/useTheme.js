import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'portfolio-theme';

// Figures out the theme to start with: an explicit saved choice wins,
// otherwise fall back to the visitor's system preference.
function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;

  const systemPrefersLight = window.matchMedia(
    '(prefers-color-scheme: light)'
  ).matches;
  return systemPrefersLight ? 'light' : 'dark';
}

// Reads system preference, persists an explicit user choice, and keeps the
// data-theme attribute on <html> in sync. Every component reads colors from
// the CSS variable tokens, so no per-component theme logic is needed.
export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
