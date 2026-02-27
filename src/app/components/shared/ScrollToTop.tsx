import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Resets the window scroll position to the top whenever the route changes.
 * Mount this once inside PageLayout so every page starts at y=0.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
