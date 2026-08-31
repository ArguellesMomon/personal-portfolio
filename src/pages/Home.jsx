import Hero from '../components/Hero/Hero.jsx';
import About from '../components/About/About.jsx';
import Stats from '../components/Stats/Stats.jsx';
import Skills from '../components/Skills/Skills.jsx';
import TechMarquee from '../components/TechMarquee/TechMarquee.jsx';
import Projects from '../components/Projects/Projects.jsx';
import Achievements from '../components/Achievements/Achievements.jsx';
import Contact from '../components/Contact/Contact.jsx';

// Stats and TechMarquee are deliberately not numbered chapters like the
// sections around them (no nav link, no "0X —" eyebrow) — they're short
// connective bands that give the seam between two sections something to
// do, not new destinations.
export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <About />
      <Stats />
      <Skills />
      <TechMarquee />
      <Projects />
      <Achievements />
      <Contact />
    </main>
  );
}
