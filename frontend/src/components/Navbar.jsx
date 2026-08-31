import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const translations = {
  en: {
    home: 'Home',
    analysis: 'Analysis',
    results: 'Results',
    scanNow: 'Scan Now',
    languageLabel: 'Language',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
  },

  hi: {
    home: 'होम',
    analysis: 'विश्लेषण',
    results: 'परिणाम',
    scanNow: 'अभी स्कैन करें',
    languageLabel: 'भाषा',
    openMenu: 'नेविगेशन मेनू खोलें',
    closeMenu: 'नेविगेशन मेनू बंद करें',
  },

  te: {
    home: 'హోమ్',
    analysis: 'విశ్లేషణ',
    results: 'ఫలితాలు',
    scanNow: 'ఇప్పుడే స్కాన్ చేయండి',
    languageLabel: 'భాష',
    openMenu: 'నావిగేషన్ మెనూను తెరవండి',
    closeMenu: 'నావిగేషన్ మెనూను మూసివేయండి',
  },
};

const getSelectedLanguage = () => {
  const storedLanguage =
    localStorage.getItem('phishlens-language');

  const validLanguages = ['en', 'hi', 'te'];

  return validLanguages.includes(storedLanguage)
    ? storedLanguage
    : 'en';
};

export default function Navbar() {
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [language, setLanguage] = useState(
    getSelectedLanguage
  );

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path;

  const t =
    translations[language] || translations.en;

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    const validLanguages = ['en', 'hi', 'te'];

    if (!validLanguages.includes(selectedLanguage)) {
      return;
    }

    setLanguage(selectedLanguage);

    localStorage.setItem(
      'phishlens-language',
      selectedLanguage
    );

    window.dispatchEvent(
      new CustomEvent('phishlens-language-change', {
        detail: selectedLanguage,
      })
    );
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <Link
          to="/"
          className="navbar-brand"
          onClick={closeMenu}
        >
          <div className="brand-logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <circle
                cx="12"
                cy="11"
                r="3"
              ></circle>
            </svg>
          </div>

          <span className="brand-name">
            PhishLens
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${
              isActive('/') ? 'active' : ''
            }`}
          >
            {t.home}
          </Link>

          <Link
            to="/analyze"
            className={`nav-link ${
              isActive('/analyze')
                ? 'active'
                : ''
            }`}
          >
            {t.analysis}
          </Link>

          <Link
            to="/results"
            className={`nav-link ${
              isActive('/results')
                ? 'active'
                : ''
            }`}
          >
            {t.results}
          </Link>
        </div>

        {/* Desktop actions */}
        <div className="navbar-actions">
          <div className="navbar-language">
            <span
              className="language-icon"
              aria-hidden="true"
            >
              🌐
            </span>

            <select
              className="navbar-language-select"
              value={language}
              onChange={handleLanguageChange}
              aria-label={t.languageLabel}
            >
              <option value="en">
                English
              </option>

              <option value="hi">
                हिन्दी
              </option>

              <option value="te">
                తెలుగు
              </option>
            </select>
          </div>

          <Link
            to="/analyze"
            className="btn btn-primary btn-sm"
            onClick={closeMenu}
          >
            {t.scanNow}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={`hamburger ${
            isMenuOpen ? 'open' : ''
          }`}
          onClick={() =>
            setIsMenuOpen((prev) => !prev)
          }
          aria-label={
            isMenuOpen
              ? t.closeMenu
              : t.openMenu
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="mobile-menu"
          role="navigation"
          aria-label={t.openMenu}
        >
          <Link
            to="/"
            className={`mobile-nav-link ${
              isActive('/')
                ? 'active'
                : ''
            }`}
            onClick={closeMenu}
          >
            {t.home}
          </Link>

          <Link
            to="/analyze"
            className={`mobile-nav-link ${
              isActive('/analyze')
                ? 'active'
                : ''
            }`}
            onClick={closeMenu}
          >
            {t.analysis}
          </Link>

          <Link
            to="/results"
            className={`mobile-nav-link ${
              isActive('/results')
                ? 'active'
                : ''
            }`}
            onClick={closeMenu}
          >
            {t.results}
          </Link>

          <div className="mobile-language">
            <div className="mobile-language-label">
              <span aria-hidden="true">
                🌐
              </span>
              <span>
                {t.languageLabel}
              </span>
            </div>

            <select
              className="navbar-language-select"
              value={language}
              onChange={handleLanguageChange}
              aria-label={t.languageLabel}
            >
              <option value="en">
                English
              </option>

              <option value="hi">
                हिन्दी
              </option>

              <option value="te">
                తెలుగు
              </option>
            </select>
          </div>

          <Link
            to="/analyze"
            className="btn btn-primary mobile-cta"
            onClick={closeMenu}
          >
            {t.scanNow}
          </Link>
        </div>
      )}
    </header>
  );
}