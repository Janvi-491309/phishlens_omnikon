import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const LANGUAGE_STORAGE_KEY = "phishlens-language";
const LANGUAGE_CHANGE_EVENT = "phishlens-language-change";

const supportedLanguages = ["en", "hi", "te"];

export default function Navbar() {
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (supportedLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const handleLanguageEvent = (event) => {
      const selectedLanguage = event.detail;

      if (supportedLanguages.includes(selectedLanguage)) {
        setLanguage(selectedLanguage);
      }
    };

    window.addEventListener(
      LANGUAGE_CHANGE_EVENT,
      handleLanguageEvent
    );

    return () => {
      window.removeEventListener(
        LANGUAGE_CHANGE_EVENT,
        handleLanguageEvent
      );
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    if (!supportedLanguages.includes(selectedLanguage)) {
      return;
    }

    setLanguage(selectedLanguage);
    localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      selectedLanguage
    );

    window.dispatchEvent(
      new CustomEvent(LANGUAGE_CHANGE_EVENT, {
        detail: selectedLanguage,
      })
    );
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        {/* Brand */}
        <Link
          to="/"
          className="navbar-brand"
          onClick={closeMenu}
        >
          <div className="brand-logo" aria-hidden="true">
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

        {/* Desktop navigation */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${
              isActive("/") ? "active" : ""
            }`}
          >
            Home
          </Link>

          <Link
            to="/results"
            className={`nav-link ${
              isActive("/results") ? "active" : ""
            }`}
          >
            Results
          </Link>
        </div>

        {/* Desktop actions */}
        <div className="navbar-actions">
          <div className="navbar-language">
            <span
              className="navbar-language-icon"
              aria-hidden="true"
            >
              🌐
            </span>

            <label
              htmlFor="navbar-language-select"
              className="sr-only"
            >
              Select language
            </label>

            <select
              id="navbar-language-select"
              className="navbar-language-select"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

          <Link
            to="/analyze"
            className="btn btn-primary btn-sm"
          >
            Scan Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className={`hamburger ${
            isMenuOpen ? "open" : ""
          }`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <Link
            to="/"
            className={`mobile-nav-link ${
              isActive("/") ? "active" : ""
            }`}
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/results"
            className={`mobile-nav-link ${
              isActive("/results") ? "active" : ""
            }`}
            onClick={closeMenu}
          >
            Results
          </Link>

          <div className="mobile-language">
            <span
              className="mobile-language-icon"
              aria-hidden="true"
            >
              🌐
            </span>

            <label
              htmlFor="mobile-language-select"
              className="mobile-language-label"
            >
              Language
            </label>

            <select
              id="mobile-language-select"
              className="mobile-language-select"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

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