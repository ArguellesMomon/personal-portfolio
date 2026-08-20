import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar/Navbar.jsx';
import Footer from './components/shared/Footer/Footer.jsx';
import SiteBackdrop from './components/shared/SiteBackdrop/SiteBackdrop.jsx';
import Home from './pages/Home.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import AchievementsPage from './pages/AchievementsPage.jsx';
import useScrollToHash from './hooks/useScrollToHash';

// Navbar/Footer/SiteBackdrop are outside <Routes> so they persist across
// page changes instead of remounting — the fixed photo backdrop in
// particular should never flicker or reset when navigating to /projects.
function Layout() {
  useScrollToHash();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <SiteBackdrop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
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
