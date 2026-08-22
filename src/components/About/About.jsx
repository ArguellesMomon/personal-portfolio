import { Quote, Code2, Cpu, Smartphone, LineChart } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';
import useSpotlight from '../../hooks/useSpotlight';
import './About.css';

// Same icon vocabulary as Projects' category chips (Cpu, Smartphone,
// LineChart) so the two sections read as one system rather than each
// inventing its own iconography. Swap labels for your real focus areas.
const EXPERTISE = [
  { label: 'Web Development', icon: Code2 },
  { label: 'IoT & Embedded Systems', icon: Cpu },
  { label: 'Mobile Applications', icon: Smartphone },
  { label: 'UI/UX & Product Design', icon: LineChart },
];

function ExpertiseItem({ label, icon: Icon }) {
  const { ref, handleMouseMove } = useSpotlight();

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className="card about__expertise-item">
      <span className="about__expertise-icon" aria-hidden="true">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      {label}
    </div>
  );
}

export default function About() {
  const headerRef = useScrollReveal();
  const contentRef = useScrollReveal();

  return (
    <section id="about" className="section about">
      <div className="about__glow" aria-hidden="true" />

      <div className="section-inner">
        <div ref={headerRef}>
          <div className="reveal">
            <span className="mono-label section-eyebrow">01 — about</span>
            <h2 className="section-heading">About Me</h2>
          </div>
        </div>

        <div className="about__body" ref={contentRef}>
          <p className="reveal about__intro">
            Computer Science student at De La Salle Lipa specializing in software development, web applications, and emerging technologies. I build practical digital solutions and IoT systems focused on functionality, usability, and purposeful design.
          </p>

          <div className="reveal about__expertise">
            {EXPERTISE.map((item) => (
              <ExpertiseItem key={item.label} {...item} />
            ))}
          </div>

          <blockquote className="reveal about__quote">
            <Quote className="about__quote-icon" size={32} strokeWidth={1.5} aria-hidden="true" />
            <p>Build with purpose. Keep it simple. Make it work.</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
