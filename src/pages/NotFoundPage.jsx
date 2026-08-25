import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/shared/Button/Button.jsx';
import './NotFoundPage.css';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found — [PLACEHOLDER: Your Name]';
    return () => {
      document.title = '[PLACEHOLDER: Your Name] — Computer Science Portfolio';
    };
  }, []);

  return (
    <main id="main-content" className="not-found">
      <div className="not-found__inner">
        <span className="mono-label not-found__eyebrow">&lsaquo; 404 &rsaquo;</span>
        <h1 className="not-found__code">404</h1>
        <p className="not-found__message">
          This page doesn&rsquo;t exist — the link may be broken, or it moved.
        </p>
        <Button as={Link} to="/" icon={Home}>
          Back to Home
        </Button>
      </div>
    </main>
  );
}
