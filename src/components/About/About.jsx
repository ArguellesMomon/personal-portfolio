import { Quote } from 'lucide-react';
import useScrollReveal from '../../hooks/useScrollReveal';
import './About.css';

// Swap these for your real focus areas — they're placeholders based loosely
// on what your project mix suggests (embedded/ML + full-stack + mobile).
const EXPERTISE = [
  'Web Applications',
  'IoT & Embedded Systems',
  'Mobile Applications',
  'Quality Assurance',
  'UI/UX & Product Design',
];

export default function About() {
  const revealRef = useScrollReveal();

  return (
    <section id="about" className="section about">
      <div className="section-inner" ref={revealRef}>
        <div className="reveal">
          <span className="mono-label section-eyebrow">01 — about</span>
          <h2 className="section-heading">About Me</h2>
        </div>

        <div className="reveal about__body">
          <p className="about__intro">
            [PLACEHOLDER: a short paragraph on who you are, what you study,
            and the kind of engineering work you gravitate toward.]
          </p>

          <div className="about__expertise">
            {EXPERTISE.map((item) => (
              <span key={item} className="tag about__expertise-tag">
                {item}
              </span>
            ))}
          </div>

          <blockquote className="about__quote">
            <Quote className="about__quote-icon" size={28} strokeWidth={1.5} aria-hidden="true" />
            <p>[PLACEHOLDER: a short personal quote or mantra that sums up how you approach your work.]</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
