import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <main id="main-content" tabIndex={-1} className="container not-found">
      <span className="error-code">
        404<span className="accent">.</span>
      </span>
      <h1>Page not found</h1>
      <p>This link may be outdated. Return home or browse the projects.</p>
      <div className="hero-buttons">
        <Link className="button" to="/">
          <ArrowLeft size={17} /> Back home
        </Link>
        <Link className="button button-outline" to="/projects">
          View projects <ArrowRight size={17} />
        </Link>
      </div>
    </main>
  );
}
