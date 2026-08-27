import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <circle cx="12" cy="11" r="3"></circle>
            </svg>
          </div>
          <span className="brand-name">PhishLens</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/analyze" className={`nav-link ${location.pathname === '/analyze' ? 'active' : ''}`}>Analyze</Link>
        </div>
        <div className="navbar-actions">
          <Link to="/analyze" className="btn btn-primary btn-sm">Analyze Now</Link>
        </div>
      </nav>
    </header>
  );
}
