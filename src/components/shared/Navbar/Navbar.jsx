import { useEffect, useState } from 'react';
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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');

  // Highlights the nav link for whichever section is currently most visible.
  useEffect(() => {
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
  }, []);

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar__bar">
          <a href="#home" className="navbar__brand mono-label">
            Richmond L. Arguelles
          </a>

          <nav className="navbar__links navbar__links--desktop" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`navbar__link ${activeId === link.id ? 'is-active' : ''}`}
              >
                {link.label}
              </a>
            ))}
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
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`navbar__link ${activeId === link.id ? 'is-active' : ''}`}
              onClick={handleLinkClick}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <SignalLine />
      </header>

      {/* Now that .navbar is position:fixed (removed from normal flow), this
          takes its old place in the document so Hero's content doesn't start
          out hidden underneath it. Same height the navbar actually renders
          at — see .navbar__spacer in Navbar.css. */}
      <div className="navbar__spacer" aria-hidden="true" />
    </>
  );
}