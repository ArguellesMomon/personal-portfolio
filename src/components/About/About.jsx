import { Quote, Globe, Cpu, Smartphone, LineChart } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';
import useSpotlight from '../../hooks/useSpotlight';
import './About.css';

// Same icon + label vocabulary as Projects' CATEGORY_ICONS (categoryIcons.js)
// so About and Projects read as one system instead of two different lists
// of "the same four things" — a recruiter should see the same four words
// here and again when browsing /projects.
const EXPERTISE = [
  { label: 'Web Development', icon: Globe },
  { label: 'Embedded Systems', icon: Cpu },
  { label: 'Mobile Apps', icon: Smartphone },
  { label: 'Data & ML', icon: LineChart },
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
            I'm a Computer Science student at De La Salle Lipa. Most of my
            projects start as a technical problem — a sensor signal, a
            forecasting model, a booking flow — and end as something people
            can actually use. I spend as much time on the interface and
            interaction as I do on making the underlying system work, and
            I'd rather ship a smaller idea well than a big one
            half-finished.
          </p>

          <div className="reveal about__expertise">
            {EXPERTISE.map((item) => (
              <ExpertiseItem key={item.label} {...item} />
            ))}
          </div>

          <blockquote className="reveal about__quote">
            <Quote className="about__quote-icon" size={32} strokeWidth={1.5} aria-hidden="true" />
            <p>I'd rather ship something simple that works than something clever that doesn't.</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
