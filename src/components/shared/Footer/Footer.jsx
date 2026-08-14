import { Github, Linkedin, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="mono-label">© {year} [PLACEHOLDER: Name]</p>

        <div className="footer__links">
          <a
            href="https://github.com/ArguellesMomon"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="footer__icon-link"
          >
            <Github size={20} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a
            href="[PLACEHOLDER: LinkedIn URL]"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="footer__icon-link"
          >
            <Linkedin size={20} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a
            href="mailto:[PLACEHOLDER: email address]"
            aria-label="Email"
            className="footer__icon-link"
          >
            <Mail size={20} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
