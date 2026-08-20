import { Mail, Github, Linkedin } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';
import useSpotlight from '../../hooks/useSpotlight';
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

function ContactLink({ label, value, href, icon: Icon }) {
  const { ref, handleMouseMove } = useSpotlight();
  const isExternal = !href.startsWith('mailto:');

  return (
    <a
      ref={ref}
      onMouseMove={handleMouseMove}
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      className="reveal card contact__link"
    >
      <span className="contact__link-icon-chip" aria-hidden="true">
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <span>
        <span className="mono-label contact__link-label">{label}</span>
        <span className="contact__link-value">{value}</span>
      </span>
    </a>
  );
}

export default function Contact() {
  const headerRef = useScrollReveal();
  const linksRef = useScrollReveal();

  return (
    <section id="contact" className="section contact">
      <div className="section-inner">
        <div ref={headerRef}>
          <div className="reveal">
            <span className="mono-label section-eyebrow">05 — contact</span>
            <h2 className="section-heading">Get In Touch</h2>
            <p className="contact__intro">
              [PLACEHOLDER: one line inviting recruiters/collaborators to reach out]
            </p>
          </div>
        </div>

        <div className="contact__links" ref={linksRef}>
          {CONTACT_LINKS.map((link) => (
            <ContactLink key={link.label} {...link} />
          ))}
        </div>
      </div>
    </section>
  );
}
