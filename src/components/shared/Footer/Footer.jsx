import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import usePrefersReducedMotion from '../../../hooks/usePrefersReducedMotion';
import './Footer.css';

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
            <p className="mono-label footer__eyebrow">Still learning. Still building.</p>
            <h2 className="footer__name">Richmond L. Arguelles</h2>
          </div>

          <button type="button" className="footer__top-btn" onClick={scrollToTop}>
            <ArrowUp size={16} strokeWidth={1.75} aria-hidden="true" />
            <span className="mono-label">Back to top</span>
          </button>
        </div>
      </div>

      <div className="footer__inner">
        <p className="mono-label">© {year} Richmond L. Arguelles</p>

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
          <a
            href="[PLACEHOLDER: LinkedIn URL]"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="icon-link"
          >
            <Linkedin size={20} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a
            href="mailto:[PLACEHOLDER: email address]"
            aria-label="Email"
            className="icon-link"
          >
            <Mail size={20} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
