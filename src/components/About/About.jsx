import useScrollReveal from '../../hooks/useScrollReveal';
import './About.css';

export default function About() {
  const revealRef = useScrollReveal();

  return (
    <section id="about" className="section about">
      <div className="section-inner" ref={revealRef}>
        <div className="reveal">
          <span className="mono-label section-eyebrow">About</span>
          <h2 className="section-heading">About Me</h2>
        </div>

        <div className="reveal about__body">
          <p>
            [PLACEHOLDER: bio — who you are, what you study, and what year/
            program you're in.]
          </p>
          <p>
            [PLACEHOLDER: what you're interested in, e.g. ML/embedded systems
            and full-stack web apps, and what kind of work you enjoy building.]
          </p>
        </div>
      </div>
    </section>
  );
}
