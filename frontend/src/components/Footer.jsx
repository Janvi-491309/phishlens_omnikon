import { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';
import './Footer.css';

const translations = {
  en: {
    description:
      'Regional-language phishing detection helping users analyze suspicious messages, URLs, and screenshot-based content safely.',
    backendOnline: 'Backend is online',
    backendOffline: 'Backend is offline or unreachable',
    apiStatus: 'API Status',
    online: 'Online',
    offline: 'Offline',
    rights: 'All rights reserved.',
  },

  hi: {
    description:
      'क्षेत्रीय-भाषा फ़िशिंग पहचान, जो उपयोगकर्ताओं को संदिग्ध संदेशों, URL और स्क्रीनशॉट-आधारित सामग्री का सुरक्षित रूप से विश्लेषण करने में मदद करती है।',
    backendOnline: 'बैकएंड ऑनलाइन है',
    backendOffline: 'बैकएंड ऑफ़लाइन है या पहुँच योग्य नहीं है',
    apiStatus: 'API स्थिति',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    rights: 'सर्वाधिकार सुरक्षित।',
  },

  te: {
    description:
      'ప్రాంతీయ భాషలలో ఫిషింగ్ గుర్తింపు ద్వారా అనుమానాస్పద సందేశాలు, URLలు మరియు స్క్రీన్‌షాట్ ఆధారిత కంటెంట్‌ను సురక్షితంగా విశ్లేషించడంలో వినియోగదారులకు సహాయం చేస్తుంది.',
    backendOnline: 'బ్యాకెండ్ ఆన్‌లైన్‌లో ఉంది',
    backendOffline: 'బ్యాకెండ్ ఆఫ్‌లైన్‌లో ఉంది లేదా అందుబాటులో లేదు',
    apiStatus: 'API స్థితి',
    online: 'ఆన్‌లైన్',
    offline: 'ఆఫ్‌లైన్',
    rights: 'అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.',
  },
};

const getSelectedLanguage = () => {
  const storedLanguage = localStorage.getItem(
    'phishlens-language'
  );

  const validLanguages = ['en', 'hi', 'te'];

  return validLanguages.includes(storedLanguage)
    ? storedLanguage
    : 'en';
};

export default function Footer() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [language, setLanguage] = useState(
    getSelectedLanguage()
  );

  useEffect(() => {
    // Check backend health initially and every 30 seconds.
    const performHealthCheck = async () => {
      const healthy = await checkHealth();
      setIsHealthy(healthy);
    };

    performHealthCheck();

    const intervalId = setInterval(
      performHealthCheck,
      30000
    );

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLanguage =
        event?.detail || getSelectedLanguage();

      const validLanguages = ['en', 'hi', 'te'];

      setLanguage(
        validLanguages.includes(nextLanguage)
          ? nextLanguage
          : 'en'
      );
    };

    const handleStorageChange = (event) => {
      if (
        event.key === 'phishlens-language'
      ) {
        setLanguage(getSelectedLanguage());
      }
    };

    window.addEventListener(
      'phishlens-language-change',
      handleLanguageChange
    );

    window.addEventListener(
      'storage',
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        'phishlens-language-change',
        handleLanguageChange
      );

      window.removeEventListener(
        'storage',
        handleStorageChange
      );
    };
  }, []);

  const t =
    translations[language] || translations.en;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo-small">
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
              </svg>
            </div>

            <h3>PhishLens</h3>
          </div>

          <p className="footer-description">
            {t.description}
          </p>
        </div>

        <div className="footer-status-wrapper">
          <div
            className="footer-status"
            title={
              isHealthy
                ? t.backendOnline
                : t.backendOffline
            }
          >
            <span
              className={`status-indicator ${
                isHealthy
                  ? 'pulse'
                  : 'offline'
              }`}
            ></span>

            <span>
              {t.apiStatus}: {isHealthy ? t.online : t.offline}
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} PhishLens Omnikon.{' '}
          {t.rights}
        </p>
      </div>
    </footer>
  );
}