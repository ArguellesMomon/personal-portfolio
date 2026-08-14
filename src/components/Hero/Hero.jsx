import { ArrowDown, FileDown } from 'lucide-react';
import SignalLine from '../shared/SignalLine/SignalLine';
import Button from '../shared/Button/Button';
import './Hero.css';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <SignalLine variant="hero" />

      <div className="hero__content">
        <p className="mono-label hero__eyebrow">BS Computer Science Student</p>
        <h1 className="hero__name">[PLACEHOLDER: Your Name]</h1>
        <p className="hero__summary">
          [PLACEHOLDER: one-line summary of what you do — e.g. "I build
          full-stack apps and embedded ML systems, from sensor to interface."]
        </p>

        <div className="hero__actions">
          <Button as="a" href="#projects" variant="primary" icon={ArrowDown}>
            View My Work
          </Button>
          <Button as="a" href="/resume.pdf" variant="secondary" icon={FileDown} download>
            Download Resume
          </Button>
        </div>
      </div>
    </section>
  );
}
