import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const storageKey = 'portfolio-page-history';
const NavigationHistory = createContext(null);

export function NavigationHistoryProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const historyIndex = window.history.state?.idx ?? 0;
  const url = `${location.pathname}${location.search}${location.hash}`;
  const pendingReturn = useRef(null);
  const [visitedPages, setVisitedPages] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey));
      return Array.isArray(saved) && saved[historyIndex]?.key === location.key ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setVisitedPages((previous) => {
      if (previous[historyIndex]?.key === location.key && previous[historyIndex]?.url === url)
        return previous;
      const updated = previous.slice(0, historyIndex + 1);
      updated[historyIndex] = { key: location.key, pathname: location.pathname, url };
      return updated;
    });
  }, [historyIndex, location.key, location.pathname, url]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(visitedPages));
    } catch {
      // Navigation still works in memory when browser storage is unavailable.
    }
  }, [visitedPages]);

  useEffect(() => {
    const target = pendingReturn.current;
    if (!target || target.index !== historyIndex) return;
    pendingReturn.current = null;
    // Homepage links can name a section that was not in the original URL.
    // Restore that section on the returned entry without adding another entry.
    if (url !== target.url) navigate(target.url, { replace: true, state: location.state });
  }, [historyIndex, location.key, location.state, navigate, url]);

  const returnTo = (targetUrl, fallbackState) => {
    if (pendingReturn.current) return;
    const pathname = targetUrl.split(/[?#]/)[0];
    let targetIndex = -1;
    for (const exact of [true, false]) {
      for (let index = historyIndex - 1; index >= 0; index--) {
        const entry = visitedPages[index];
        if (exact ? entry?.url === targetUrl : entry?.pathname === pathname) {
          targetIndex = index;
          break;
        }
      }
      if (targetIndex >= 0) break;
    }
    if (targetIndex >= 0) {
      pendingReturn.current = { index: targetIndex, url: targetUrl };
      navigate(targetIndex - historyIndex);
    } else {
      // A direct visit has no referring entry to pop back to.
      navigate(targetUrl, { replace: true, state: fallbackState });
    }
  };

  return (
    <NavigationHistory.Provider value={{ visitedPages, historyIndex, returnTo }}>
      {children}
    </NavigationHistory.Provider>
  );
}

export function useNavigationHistory() {
  return useContext(NavigationHistory);
}
