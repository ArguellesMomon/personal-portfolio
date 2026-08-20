import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Browsers auto-scroll to a URL's #hash on a full page load, but not after
// a client-side route change — if you're on /projects and click a nav link
// like "/#about", React Router swaps the page but the browser won't scroll
// anywhere on its own. This does that scroll manually whenever the route
// (or hash) changes.
export default function useScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Wait a tick so the new page's sections exist in the DOM before we
    // try to find and scroll to one.
    const id = hash.replace('#', '');
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView();
    }, 0);

    return () => clearTimeout(timer);
  }, [hash, pathname]);
}
