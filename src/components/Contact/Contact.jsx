import { Mail, Github, Linkedin } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Contact.css';

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: '[PLACEHOLDER: email address]',
    href: 'mailto:[PLACEHOLDER: email address]',
    icon: Mail,
  },
  {
    label: 'GitHub',
    value: 'github.com/ArguellesMomon',
    href: 'https://github.com/ArguellesMomon',
    icon: Github,
  },
  {
    label: 'LinkedIn',
    value: '[PLACEHOLDER: LinkedIn handle]',
    href: '[PLACEHOLDER: LinkedIn URL]',
    icon: Linkedin,
  },
];

export default function Contact() {
  const revealRef = useScrollReveal();

  return (
    <section id="contact" className="section contact">
      <div className="section-inner" ref={revealRef}>
        <div className="reveal">
          <span className="mono-label section-eyebrow">05 — contact</span>
          <h2 className="section-heading">Get In Touch</h2>
          <p className="contact__intro">
            [PLACEHOLDER: one line inviting recruiters/collaborators to reach out]
          </p>
        </div>

        <div className="reveal contact__links">
          {CONTACT_LINKS.map(({ label, value, href, icon: Icon }) => {
            const isExternal = !href.startsWith('mailto:');
            return (
              <a
                key={label}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                className="card contact__link"
              >
                <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                <span>
                  <span className="mono-label contact__link-label">{label}</span>
                  <span className="contact__link-value">{value}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
