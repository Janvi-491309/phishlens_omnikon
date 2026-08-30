import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <circle cx="12" cy="11" r="3" />
            </svg>
          </div>

          <span className="brand-name">PhishLens</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>

          <Link
            to="/results"
            className={`nav-link ${isActive("/results") ? "active" : ""}`}
          >
            Results
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="navbar-actions">
          <Link to="/analyze" className="btn btn-primary btn-sm">
            Scan Now
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className={`hamburger ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <Link
            to="/"
            className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/results"
            className={`mobile-nav-link ${isActive("/results") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Results
          </Link>

          <Link
            to="/analyze"
            className="btn btn-primary mobile-cta"
            onClick={closeMenu}
          >
            Scan Now
          </Link>
        </div>
      )}
    </header>
  );
}