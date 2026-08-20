import Hero from '../components/Hero/Hero.jsx';
import About from '../components/About/About.jsx';
import Skills from '../components/Skills/Skills.jsx';
import Projects from '../components/Projects/Projects.jsx';
import Achievements from '../components/Achievements/Achievements.jsx';
import Contact from '../components/Contact/Contact.jsx';

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Achievements />
      <Contact />
    </main>
  );
}
