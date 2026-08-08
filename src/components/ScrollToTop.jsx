import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Runs on every route change. Unlike a traditional multi-page site, React
// Router doesn't reset scroll position when navigating — without this,
// clicking a link while scrolled down on the previous page leaves you
// scrolled down on the new page too. Watches both pathname (e.g. Home →
// Products) and search (e.g. /products → /products?category=Toner), since
// either kind of navigation should reset scroll position.
export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return null;
}