import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/portfolio/ThemeContext.jsx';
import { SiteHeader, SiteFooter, RouteEffects } from './components/portfolio/SiteLayout.jsx';
import Home from './pages/Home.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AchievementsPage from './pages/AchievementsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <RouteEffects />
        <SiteHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <SiteFooter />
      </BrowserRouter>
    </ThemeProvider>
  );
}
