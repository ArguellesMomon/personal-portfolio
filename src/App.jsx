import Navbar from './components/shared/Navbar/Navbar.jsx';
import Footer from './components/shared/Footer/Footer.jsx';
import SiteBackdrop from './components/shared/SiteBackdrop/SiteBackdrop.jsx';
import Hero from './components/Hero/Hero.jsx';
import About from './components/About/About.jsx';
import Skills from './components/Skills/Skills.jsx';
import Projects from './components/Projects/Projects.jsx';
import Achievements from './components/Achievements/Achievements.jsx';
import Contact from './components/Contact/Contact.jsx';

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <SiteBackdrop />
      <Navbar />

      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
