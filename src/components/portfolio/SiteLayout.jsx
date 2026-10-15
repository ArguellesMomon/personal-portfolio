import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, Moon, Sun, X, Pause, Play } from 'lucide-react';
import { useTheme } from './ThemeContext.jsx';
import { useMotion } from './MotionContext.jsx';
import profile from '../../data/profile.js';
import projects from '../../data/projects.json';

const navigation = [
  ['/', 'Home'],
  ['/projects', 'Projects'],
  ['/about', 'About'],
  ['/achievements', 'Certificates'],
  ['/contact', 'Contact'],
];

export function RouteEffects() {
  const location = useLocation();
  const previousPath = useRef(null);
  useEffect(() => {
    const titles = {
      '/': 'Software Developer',
      '/projects': 'Projects',
      '/about': 'About',
      '/contact': 'Contact',
      '/achievements': 'Certificates & achievements',
    };
    const project = projects.find((item) => location.pathname === `/projects/${item.id}`);
    const title = `${project?.title || titles[location.pathname] || 'Page not found'} — ${profile.name}`;
    const description =
      project?.shortDescription ||
      'Richmond Arguelles, Computer Science student at De La Salle Lipa. Web applications, mobile apps, and embedded machine learning projects.';
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document
      .querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]')
      .forEach((element) => element.setAttribute('content', title));
    document
      .querySelectorAll('meta[property="og:description"], meta[name="twitter:description"]')
      .forEach((element) => element.setAttribute('content', description));
    if (previousPath.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (previousPath.current !== null)
        document.getElementById('main-content')?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
    }
    if (location.hash)
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
  }, [location.pathname, location.hash]);
  return null;
}

export function SiteHeader() {
  const { theme, setPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuButton = useRef(null);
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="Richmond Arguelles home">
          Richmond Arguelles<span className="accent">.</span>
        </Link>
        <nav
          className={`main-nav ${open ? 'is-open' : ''}`}
          id="main-navigation"
          aria-label="Main navigation"
        >
          {navigation.map(([to, label]) => (
            <NavLink key={to} end={to === '/'} to={to} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button theme-button"
            onClick={() => setPreference(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button
            ref={menuButton}
            className="icon-button menu-button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { preference, setPreference } = useTheme();
  const { enabled, paused, systemReduced, toggle } = useMotion();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <strong>Richmond Arguelles</strong>
            <p>Software developer · Philippines</p>
          </div>
          <div className="footer-links">
            <a href={`mailto:${profile.email}`}>
              Email <ArrowUpRight size={14} />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={14} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Richmond Arguelles</span>
          <div className="footer-preferences">
            <button
              className="footer-motion-toggle"
              onClick={toggle}
              disabled={systemReduced}
              aria-pressed={paused}
              aria-label={
                systemReduced
                  ? 'Visual effects reduced by system settings'
                  : enabled
                    ? 'Pause visual effects'
                    : 'Resume visual effects'
              }
            >
              {enabled ? <Pause size={13} /> : <Play size={13} />}
              {systemReduced ? 'Reduced motion' : enabled ? 'Pause effects' : 'Resume effects'}
            </button>
            <label className="theme-select">
              Appearance
              <select
                aria-label="Theme preference"
                value={preference}
                onChange={(event) => setPreference(event.target.value)}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageHeading({ title, children }) {
  return (
    <header className="page-heading">
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </header>
  );
}
