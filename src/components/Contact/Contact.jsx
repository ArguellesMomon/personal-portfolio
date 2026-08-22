import { Mail, Github, Linkedin, Copy, Check } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import './Contact.css';

const EMAIL = 'arguellesrichmond@gmail.com';

const SECONDARY_LINKS = [
  { label: 'GitHub', href: 'https://github.com/ArguellesMomon', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/richmond-arguelles-71708a430/', icon: Linkedin },
];

// Previously 3 identical link-cards in a row — the same treatment as
// every other section, and the very last thing before the footer, so it
// needed a stronger sense of "this is the point of the page" than a plain
// grid gave it. Email is now the one clear primary action (large, with a
// copy affordance); GitHub/LinkedIn are secondary, smaller links below it
// rather than equal-weight peers.
export default function Contact() {
  const headerRef = useScrollReveal();
  const ctaRef = useScrollReveal();
  const { copied, copy } = useCopyToClipboard();

  return (
    <section id="contact" className="section contact">
      <div className="contact__glow contact__glow--signal" aria-hidden="true" />
      <div className="contact__glow contact__glow--olive" aria-hidden="true" />
      <div className="section-inner">
        <div ref={headerRef}>
          <div className="reveal">
            <span className="mono-label section-eyebrow">05 — contact</span>
            <h2 className="section-heading">Get In Touch</h2>
            <p className="contact__intro">
              Open to meaningful opportunities, collaborations, and conversations.
            </p>

            <div className="contact__status">
              <span className="contact__status-dot" aria-hidden="true" />
              <span className="mono-label">
                Open to internships, freelance projects, and collaborations.
              </span>
            </div>
          </div>
        </div>

        <div className="contact__body" ref={ctaRef}>
          <div className="reveal contact__cta">
            <a href={`mailto:${EMAIL}`} className="contact__email">
              <Mail size={22} strokeWidth={1.75} className="contact__email-icon" aria-hidden="true" />
              <span className="contact__email-text">{EMAIL}</span>
            </a>

            <button
              type="button"
              className={`contact__copy-btn ${copied ? 'is-copied' : ''}`}
              onClick={() => copy(EMAIL)}
            >
              {copied ? (
                <Check size={16} strokeWidth={2.25} aria-hidden="true" />
              ) : (
                <Copy size={16} strokeWidth={1.75} aria-hidden="true" />
              )}
              <span className="mono-label">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <span className="visually-hidden" role="status" aria-live="polite">
              {copied ? 'Email address copied to clipboard' : ''}
            </span>
          </div>

          <div className="reveal contact__secondary">
            {SECONDARY_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="contact__secondary-link"
              >
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                <span className="mono-label">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
