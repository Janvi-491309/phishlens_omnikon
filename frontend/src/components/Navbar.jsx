import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const LANGUAGE_STORAGE_KEY = 'phishlens-language';
const LANGUAGE_CHANGE_EVENT = 'phishlens-language-change';

const supportedLanguages = ['en', 'hi', 'te'];

const translations = {
  en: {
    home: 'Home',
    analysis: 'Analysis',
    proactive: 'Proactive Check',
    results: 'Results',
    scanNow: 'Scan Now',
    languageLabel: 'Select language',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
  },

  hi: {
    home: 'होम',
    analysis: 'विश्लेषण',
    proactive: 'सक्रिय जांच',
    results: 'परिणाम',
    scanNow: 'अभी स्कैन करें',
    languageLabel: 'भाषा चुनें',
    openMenu: 'नेविगेशन मेनू खोलें',
    closeMenu: 'नेविगेशन मेनू बंद करें',
  },

  te: {
    home: 'హోమ్',
    analysis: 'విశ్లేషణ',
    proactive: 'ముందస్తు తనిఖీ',
    results: 'ఫలితాలు',
    scanNow: 'ఇప్పుడే స్కాన్ చేయండి',
    languageLabel: 'భాషను ఎంచుకోండి',
    openMenu: 'నావిగేషన్ మెనూను తెరవండి',
    closeMenu: 'నావిగేషన్ మెనూను మూసివేయండి',
  },
};

const getStoredLanguage = () => {
  const savedLanguage = localStorage.getItem(
    LANGUAGE_STORAGE_KEY
  );

  return supportedLanguages.includes(savedLanguage)
    ? savedLanguage
    : 'en';
};

export default function Navbar() {
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState(
    getStoredLanguage
  );

  useEffect(() => {
    const handleLanguageEvent = (event) => {
      const selectedLanguage = event?.detail;

      if (
        supportedLanguages.includes(
          selectedLanguage
        )
      ) {
        setLanguage(selectedLanguage);
      }
    };

    const handleStorageChange = (event) => {
      if (
        event.key === LANGUAGE_STORAGE_KEY
      ) {
        setLanguage(getStoredLanguage());
      }
    };

    window.addEventListener(
      LANGUAGE_CHANGE_EVENT,
      handleLanguageEvent
    );

    window.addEventListener(
      'storage',
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        LANGUAGE_CHANGE_EVENT,
        handleLanguageEvent
      );

      window.removeEventListener(
        'storage',
        handleStorageChange
      );
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path;

  const t =
    translations[language] || translations.en;

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    if (
      !supportedLanguages.includes(
        selectedLanguage
      )
    ) {
      return;
    }

    setLanguage(selectedLanguage);

    localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      selectedLanguage
    );

    window.dispatchEvent(
      new CustomEvent(
        LANGUAGE_CHANGE_EVENT,
        {
          detail: selectedLanguage,
        }
      )
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
          <div
            className="brand-logo"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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

        {/* Desktop navigation */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${
              isActive('/')
                ? 'active'
                : ''
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
            to="/proactive"
            className={`nav-link ${
              isActive('/proactive')
                ? 'active'
                : ''
            }`}
          >
            {t.proactive}
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
              className="navbar-language-icon"
              aria-hidden="true"
            >
              🌐
            </span>

            <label
              htmlFor="navbar-language-select"
              className="sr-only"
            >
              {t.languageLabel}
            </label>

            <select
              id="navbar-language-select"
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
            setIsMenuOpen(
              (prev) => !prev
            )
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

      {/* Mobile menu */}
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
            to="/proactive"
            className={`mobile-nav-link ${
              isActive('/proactive')
                ? 'active'
                : ''
            }`}
            onClick={closeMenu}
          >
            {t.proactive}
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
              {t.languageLabel}
            </label>

            <select
              id="mobile-language-select"
              className="mobile-language-select"
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