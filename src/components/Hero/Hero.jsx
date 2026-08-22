import { ArrowDown, FileDown, Github, Linkedin, Instagram } from 'lucide-react';
import Button from '../shared/Button/Button';
import useTypewriter from '../../hooks/useTypewriter';
import './Hero.css';

// "Web Developer" undersells the range in your project list (embedded ML,
// mobile, data science, not just web) — went with "Software Engineer" as a
// broader, still-punchy fit. One line to change if you'd rather have
// something else.
const HERO_ROLE = 'Computer Science Student & Developer';

// Starts right as the role line's own fade/rise settles (280ms delay + a
// 650ms animation, see .hero__enter in Hero.css) rather than typing while
// it's still animating in.
const ROLE_TYPE_DELAY = 950;

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/ArguellesMomon', icon: Github },
  { label: 'LinkedIn', href: '[PLACEHOLDER: LinkedIn URL]', icon: Linkedin },
  { label: 'Instagram', href: '[PLACEHOLDER: Instagram URL]', icon: Instagram },
];

// Hero itself has no background of its own — the fixed SiteBackdrop (see
// App.jsx) shows through it. This section is just the transparent content
// layer that sits on top for the first viewport height.
export default function Hero() {
  const role = useTypewriter(HERO_ROLE, { startDelay: ROLE_TYPE_DELAY });

  return (
    <section id="home" className="hero">
      {/* Matches .section-inner (global.css), used by every other section,
          so Hero's text starts at the same horizontal position as
          everything below it — see the comment on .hero__inner in
          Hero.css for why this wrapper exists. .hero__content keeps its
          own narrower max-width, just for readable line-length. */}
      <div className="hero__inner">
        <div className="hero__content">
          <h1 className="hero__name hero__enter" style={{ '--enter-delay': '150ms' }}>
            Richmond L. Arguelles
          </h1>

          <p className="hero__role hero__enter" style={{ '--enter-delay': '280ms' }}>
            <span aria-hidden="true">
              {role.text}
              <span className={`hero__role-cursor ${role.isDone ? 'is-done' : ''}`} />
            </span>
            <span className="visually-hidden">{HERO_ROLE}</span>
          </p>

          <p className="hero__tagline hero__enter" style={{ '--enter-delay': '400ms' }}>
            DESIGN. BUILD. ITERATE.
          </p>

          <p className="hero__description hero__enter" style={{ '--enter-delay': '500ms' }}>
            Computer Science student at De La Salle Lipa specializing in software development, web applications, and emerging technologies. I build practical digital solutions and IoT systems with a focus on functionality, usability, and purposeful design.
          </p>

          <div className="hero__actions hero__enter" style={{ '--enter-delay': '600ms' }}>
            <Button as="a" href="#projects" variant="primary" icon={ArrowDown}>
              View My Work
            </Button>
            <Button as="a" href="/resume.pdf" variant="secondary" icon={FileDown} download>
              Download Resume
            </Button>
          </div>

          <div className="hero__socials hero__enter" style={{ '--enter-delay': '700ms' }}>
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="hero__social-link">
                <span className="hero__social-icon-chip" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
