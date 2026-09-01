import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import URLAnalyzer from '../components/URLAnalyzer';
import './ProactiveCheck.css';

const translations = {
  en: {
    badge: '🔍 Proactive Security',
    title: 'Proactive Check',
    subtitle:
      'Check a suspicious website before you open it. Enter the URL below and let PhishLens analyze it for potential phishing risks.',
    panelTitle: 'Check a suspicious URL',
    panelDescription:
      'Enter the complete HTTP or HTTPS address you want to inspect.',
    reassurance:
      'Your URL will be analyzed by the existing PhishLens security engine.',
    backHome: 'Back to Home',
  },

  hi: {
    badge: '🔍 सक्रिय सुरक्षा जांच',
    title: 'सक्रिय जांच',
    subtitle:
      'किसी संदिग्ध वेबसाइट को खोलने से पहले उसकी जांच करें। नीचे URL दर्ज करें और PhishLens संभावित फ़िशिंग जोखिमों का विश्लेषण करेगा।',
    panelTitle: 'संदिग्ध URL की जांच करें',
    panelDescription:
      'जिस HTTP या HTTPS पते की जांच करनी है, उसे दर्ज करें।',
    reassurance:
      'आपके URL का विश्लेषण मौजूदा PhishLens सुरक्षा इंजन द्वारा किया जाएगा।',
    backHome: 'होम पर वापस जाएँ',
  },

  te: {
    badge: '🔍 ముందస్తు భద్రతా తనిఖీ',
    title: 'ముందస్తు తనిఖీ',
    subtitle:
      'అనుమానాస్పద వెబ్‌సైట్‌ను తెరవడానికి ముందు తనిఖీ చేయండి. క్రింద URL ను నమోదు చేయండి; PhishLens సంభావ్య ఫిషింగ్ ప్రమాదాలను విశ్లేషిస్తుంది.',
    panelTitle: 'అనుమానాస్పద URL ను తనిఖీ చేయండి',
    panelDescription:
      'తనిఖీ చేయాలనుకుంటున్న పూర్తి HTTP లేదా HTTPS చిరునామాను నమోదు చేయండి.',
    reassurance:
      'మీ URL ను ఇప్పటికే ఉన్న PhishLens భద్రతా ఇంజిన్ విశ్లేషిస్తుంది.',
    backHome: 'హోమ్‌కు తిరిగి వెళ్లండి',
  },
};

function getSelectedLanguage() {
  const storedLanguage = localStorage.getItem(
    'phishlens-language'
  );

  const validLanguages = ['en', 'hi', 'te'];

  return validLanguages.includes(storedLanguage)
    ? storedLanguage
    : 'en';
}

export default function ProactiveCheck() {
  const [language, setLanguage] = useState(
    getSelectedLanguage()
  );

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
      if (event.key === 'phishlens-language') {
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
    <main className="proactive-page">
      <section className="proactive-hero">
        <div className="proactive-hero-glow" />

        <div className="proactive-hero-content">
          <span className="proactive-badge">
            {t.badge}
          </span>

          <h1>{t.title}</h1>

          <p>{t.subtitle}</p>
        </div>
      </section>

      <section className="proactive-section">
        <div className="proactive-card">
          <div className="proactive-card-header">
            <div className="proactive-icon">
              🔍
            </div>

            <div>
              <h2>{t.panelTitle}</h2>
              <p>{t.panelDescription}</p>
            </div>
          </div>

          <div className="proactive-analyzer">
            <URLAnalyzer />
          </div>

          <div className="proactive-note">
            <span aria-hidden="true">🛡️</span>
            <span>{t.reassurance}</span>
          </div>
        </div>

        <Link
          to="/"
          className="proactive-back-link"
        >
          ← {t.backHome}
        </Link>
      </section>
    </main>
  );
}