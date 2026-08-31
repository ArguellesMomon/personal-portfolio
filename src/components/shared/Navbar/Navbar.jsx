import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SignalLine from '../SignalLine/SignalLine';
import './Navbar.css';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

// Dedicated pages that each correspond to one home-page section, for the
// active-highlight logic below. Add an entry here for any future page like
// this (e.g. a /skills page) rather than hardcoding one route by name.
const PAGE_ROUTES = {
  '/projects': 'projects',
  '/achievements': 'achievements',
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');
  const { pathname } = useLocation();
  const activeSectionId = PAGE_ROUTES[pathname];

  // Highlights the nav link for whichever section is currently most visible.
  // Only relevant on the home page — a dedicated page like /projects or
  // /achievements doesn't have any of these section ids, so this naturally
  // finds nothing there (handled separately below via activeSectionId).
  useEffect(() => {
    if (activeSectionId) return undefined;

    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      Boolean
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [activeSectionId]);

  const handleLinkClick = () => setIsMenuOpen(false);

  // Every section link points at an absolute "/#id" rather than a bare
  // "#id" — a bare hash resolves relative to whatever page you're
  // currently on, which would keep you on /projects instead of taking you
  // back to the home page section it actually refers to.
  const isActive = (id) => (activeSectionId ? id === activeSectionId : activeId === id);

  const renderLinks = (onClick) =>
    NAV_LINKS.map((link) => (
      <Link
        key={link.id}
        to={`/#${link.id}`}
        className={`navbar__link ${isActive(link.id) ? 'is-active' : ''}`}
        onClick={onClick}
      >
        {link.label}
      </Link>
    ));

  return (
    <>
      <header className="navbar">
        <div className="navbar__bar">
          <Link to="/#home" className="navbar__brand mono-label">
            ‹ arguelles ›
          </Link>

          <nav className="navbar__links navbar__links--desktop" aria-label="Primary">
            {renderLinks()}
          </nav>

          <div className="navbar__actions">
            <button
              type="button"
              className="navbar__menu-toggle"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? (
                <X size={22} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className={`navbar__links navbar__links--mobile ${isMenuOpen ? 'is-open' : ''}`}
        >
          {renderLinks(handleLinkClick)}
        </nav>

        <SignalLine />
      </header>

      {/* Now that .navbar is position:fixed (removed from normal flow), this
          takes its old place in the document so page content doesn't start
          out hidden underneath it. Same height the navbar actually renders
          at — see .navbar__spacer in Navbar.css. */}
      <div className="navbar__spacer" aria-hidden="true" />
    </>
  );
}
