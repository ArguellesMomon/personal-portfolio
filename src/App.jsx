import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar/Navbar.jsx';
import Footer from './components/shared/Footer/Footer.jsx';
import SiteBackdrop from './components/shared/SiteBackdrop/SiteBackdrop.jsx';
import CursorGlow from './components/shared/CursorGlow/CursorGlow.jsx';
import Home from './pages/Home.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import AchievementsPage from './pages/AchievementsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import useScrollToHash from './hooks/useScrollToHash';

// Navbar/Footer/SiteBackdrop/CursorGlow are outside <Routes> so they
// persist across page changes instead of remounting — the fixed photo
// backdrop in particular should never flicker or reset when navigating to
// /projects.
function Layout() {
  useScrollToHash();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <SiteBackdrop />
      <CursorGlow />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
