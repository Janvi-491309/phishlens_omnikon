import { useEffect, useState } from 'react';
import './OCRResult.css';

const translations = {
  en: {
    extractedText: 'Extracted Text',
    copyText: 'Copy Text',
    copied: 'Copied!',
    clearText: 'Clear Text',
    copyAria: 'Copy extracted text',
    clearAria: 'Clear extracted text',
    extractedAria: 'Extracted text',
  },

  hi: {
    extractedText: 'निकाला गया टेक्स्ट',
    copyText: 'टेक्स्ट कॉपी करें',
    copied: 'कॉपी हो गया!',
    clearText: 'टेक्स्ट साफ़ करें',
    copyAria: 'निकाले गए टेक्स्ट को कॉपी करें',
    clearAria: 'निकाले गए टेक्स्ट को साफ़ करें',
    extractedAria: 'निकाला गया टेक्स्ट',
  },

  te: {
    extractedText: 'తీసిన టెక్స్ట్',
    copyText: 'టెక్స్ట్ కాపీ చేయండి',
    copied: 'కాపీ చేయబడింది!',
    clearText: 'టెక్స్ట్ క్లియర్ చేయండి',
    copyAria: 'తీసిన టెక్స్ట్‌ను కాపీ చేయండి',
    clearAria: 'తీసిన టెక్స్ట్‌ను క్లియర్ చేయండి',
    extractedAria: 'తీసిన టెక్స్ట్',
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

export default function OCRResult({ text, onClear }) {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState(
    getSelectedLanguage()
  );

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const selectedLanguage =
        event?.detail || getSelectedLanguage();

      const validLanguages = ['en', 'hi', 'te'];

      setLanguage(
        validLanguages.includes(selectedLanguage)
          ? selectedLanguage
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

  const handleCopy = async () => {
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy extracted text:', error);
    }
  };

  const handleClear = () => {
    setCopied(false);

    if (typeof onClear === 'function') {
      onClear();
    }
  };

  return (
    <div className="ocr-result-container">
      <div className="ocr-result-header">
        <h4>{t.extractedText}</h4>

        <div className="ocr-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopy}
            disabled={!text}
            aria-label={t.copyAria}
          >
            {copied ? t.copied : t.copyText}
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleClear}
            aria-label={t.clearAria}
          >
            {t.clearText}
          </button>
        </div>
      </div>

      <div className="ocr-textarea-wrapper">
        <textarea
          className="ocr-textarea"
          value={text || ''}
          readOnly
          rows="5"
          aria-label={t.extractedAria}
        />
      </div>
    </div>
  );
}