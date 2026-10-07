import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUp, ArrowUpRight, Menu, Moon, Sun, X, Pause, Play } from 'lucide-react';
import { useTheme } from './ThemeContext.jsx';
import { useMotion } from './MotionContext.jsx';
import profile from '../../data/profile.js';
import projects from '../../data/projects.json';

const navigation = [
  ['/', 'Home'],
  ['/projects', 'Projects'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];
export function RouteEffects() {
  const location = useLocation();
  const { enabled: motionEnabled } = useMotion();
  const previousPath = useRef(null);
  useEffect(() => {
    const routeName = location.pathname.split('/')[1];
    const titles = {
      projects: 'Projects',
      about: 'About',
      contact: 'Contact',
      achievements: 'Achievements',
    };
    const project = projects.find((item) => location.pathname === `/projects/${item.id}`);
    const knownPage = ['/', '/projects', '/about', '/contact', '/achievements'].includes(
      location.pathname,
    );
    const title = `${project?.title || (knownPage ? titles[routeName] || 'Software Developer' : 'Page not found')} — ${profile.name}`;
    const description =
      project?.shortDescription ||
      (routeName === 'contact'
        ? 'Connect with Richmond Arguelles about internships, collaborations, and thoughtful software projects.'
        : 'Richmond Arguelles is a Computer Science student at De La Salle Lipa building thoughtful web, mobile, and embedded machine learning experiences.');
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
  useEffect(() => {
    if (!motionEnabled || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-revealed');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    // Content stays visible by default. Animate only as lower sections enter the viewport.
    document
      .querySelectorAll(
        '.section-space, .about-teaser, .contact-banner, .approach-section, .skills-section, .story-content section, .work-card, .practice-card',
      )
      .forEach((element) => {
        if (element.getBoundingClientRect().top > window.innerHeight) observer.observe(element);
      });
    return () => observer.disconnect();
  }, [location.pathname, motionEnabled]);
  return null;
}
export function SiteHeader() {
  const { theme, setPreference } = useTheme();
  const { enabled: motionEnabled, systemReduced, setPaused } = useMotion();
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
          <span className="brand-mark">
            r<span>.</span>
          </span>
          <span>
            richmond<span className="brand-dot">.</span>
          </span>
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
            className="icon-button motion-button"
            onClick={() => setPaused(motionEnabled)}
            disabled={systemReduced}
            aria-label={
              systemReduced
                ? 'Animations reduced by your system settings'
                : motionEnabled
                  ? 'Pause animations'
                  : 'Resume animations'
            }
            title={
              systemReduced
                ? 'Animations follow your reduced motion setting'
                : motionEnabled
                  ? 'Pause animations'
                  : 'Resume animations'
            }
          >
            {motionEnabled ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button
            className="icon-button theme-button"
            onClick={() => setPreference(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <Link to="/contact" className="button button-small header-contact">
            Let’s talk <ArrowUpRight size={16} />
          </Link>
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
  const { enabled: motionEnabled } = useMotion();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Link className="brand" to="/">
              <span className="brand-mark">
                r<span>.</span>
              </span>
              <span>richmond.</span>
            </Link>
            <p>Thoughtful software. Useful experiences.</p>
          </div>
          <div className="footer-navigation">
            {navigation.slice(1).map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={14} />
            </a>
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight size={14} />
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`}>
                Email <ArrowUpRight size={14} />
              </a>
            )}
          </div>
          <button
            className="icon-button top-button"
            aria-label="Back to top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: motionEnabled ? 'smooth' : 'instant',
              })
            }
          >
            <ArrowUp size={20} />
          </button>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Richmond Arguelles</span>
          <span className="footer-location">Made with care, in the Philippines.</span>
          <label className="theme-select">
            Appearance{' '}
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
    </footer>
  );
}
export function ContactBanner() {
  return (
    <section className="contact-banner">
      <div>
        <span className="eyebrow">HAVE SOMETHING IN MIND?</span>
        <h2>
          Good things start
          <br />
          with a conversation<span className="accent">.</span>
        </h2>
        <p>Open to internships, interesting ideas, and building together.</p>
      </div>
      <Link className="button" to="/contact">
        Let’s connect <ArrowUpRight size={18} />
      </Link>
    </section>
  );
}
export function PageHeading({ eyebrow, title, children }) {
  return (
    <header className="page-heading enter">
      <span className="eyebrow">{eyebrow}</span>
      <h1>
        {title}
        <span className="accent">.</span>
      </h1>
      {children && <p>{children}</p>}
    </header>
  );
}
