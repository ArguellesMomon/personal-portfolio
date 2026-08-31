import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import usePrefersReducedMotion from '../../../hooks/usePrefersReducedMotion';
import status from '../../../data/status.js';
import './Footer.css';

// Same optional-URL pattern as Hero/Contact — LinkedIn and email are only
// wired in Contact.jsx / here once real values exist; empty ones are
// filtered out below instead of rendering a link to nowhere.
const LINKEDIN_URL = '';
const EMAIL = '';

export default function Footer() {
  const year = new Date().getFullYear();
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer className="footer">
      {/* A closing bookend that echoes the Hero's own energy (same
          font-display treatment as the h1 there) instead of the page just
          stopping on a plain copyright line — the "signature" pattern a
          lot of premium portfolios close on. */}
      <div className="footer__signoff">
        <div className="section-inner footer__signoff-inner">
          <div>
            <p className="mono-label footer__eyebrow">Thanks for stopping by.</p>
            <h2 className="footer__name">Richmond Arguelles</h2>

            {/* "Currently building" — a small personal touch at the very
                end of the page rather than a whole new section competing
                with Hero. Only renders once status.js has a real project
                name; see src/data/status.js. */}
            {status.active && status.projectName && (
              <div className="status-pill footer__status">
                <span className="status-pill__dot" aria-hidden="true" />
                <span className="mono-label">Currently building: {status.projectName}</span>
              </div>
            )}
          </div>

          <button type="button" className="footer__top-btn" onClick={scrollToTop}>
            <ArrowUp size={16} strokeWidth={1.75} aria-hidden="true" />
            <span className="mono-label">Back to top</span>
          </button>
        </div>
      </div>

      <div className="footer__inner">
        <p className="mono-label">© {year} Richmond Arguelles</p>

        <div className="footer__links">
          <a
            href="https://github.com/ArguellesMomon"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="icon-link"
          >
            <Github size={20} strokeWidth={1.75} aria-hidden="true" />
          </a>
          {LINKEDIN_URL && (
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="icon-link"
            >
              <Linkedin size={20} strokeWidth={1.75} aria-hidden="true" />
            </a>
          )}
          {EMAIL && (
            <a href={`mailto:${EMAIL}`} aria-label="Email" className="icon-link">
              <Mail size={20} strokeWidth={1.75} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
