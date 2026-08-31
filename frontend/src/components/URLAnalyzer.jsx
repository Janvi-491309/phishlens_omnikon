import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeURL } from '../services/api';
import Spinner from './Spinner';
import ErrorBanner from './ErrorBanner';
import './URLAnalyzer.css';

/**
 * Validates that a string is a reachable-looking HTTP/HTTPS URL.
 */
function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === 'http:' ||
      parsed.protocol === 'https:'
    );
  } catch {
    return false;
  }
}

/**
 * Get the globally selected language.
 */
function getSelectedLanguage() {
  const storedLanguage =
    localStorage.getItem('phishlens-language');

  const validLanguages = ['en', 'hi', 'te'];

  return validLanguages.includes(storedLanguage)
    ? storedLanguage
    : 'en';
}

const translations = {
  en: {
    label: 'Suspicious URL',
    placeholder:
      'Paste a suspicious URL (e.g. https://example.com/login)…',
    clear: 'Clear',
    analyze: 'Analyze URL',
    analyzing: 'Analyzing…',
    empty: 'Please enter a URL before submitting.',
    invalid:
      'Please enter a valid URL starting with http:// or https:// (e.g. https://example.com).',
    timeout:
      'Request timed out (10 s). The backend may be slow or unavailable — please try again.',
    unreachable:
      'Cannot reach the backend server. Please ensure it is running at http://localhost:8000.',
    analysisFailed: 'Analysis failed',
    unexpected:
      'An unexpected error occurred. Please try again.',
    ariaLabel: 'Suspicious URL',
  },

  hi: {
    label: 'संदिग्ध URL',
    placeholder:
      'संदिग्ध URL पेस्ट करें (उदाहरण: https://example.com/login)…',
    clear: 'साफ़ करें',
    analyze: 'URL का विश्लेषण करें',
    analyzing: 'विश्लेषण हो रहा है…',
    empty: 'कृपया सबमिट करने से पहले एक URL दर्ज करें।',
    invalid:
      'कृपया http:// या https:// से शुरू होने वाला मान्य URL दर्ज करें (उदाहरण: https://example.com)।',
    timeout:
      'अनुरोध का समय समाप्त हो गया (10 सेकंड)। बैकएंड धीमा या अनुपलब्ध हो सकता है — कृपया फिर प्रयास करें।',
    unreachable:
      'बैकएंड सर्वर तक नहीं पहुँचा जा सकता। कृपया सुनिश्चित करें कि यह http://localhost:8000 पर चल रहा है।',
    analysisFailed: 'विश्लेषण विफल हुआ',
    unexpected:
      'एक अप्रत्याशित त्रुटि हुई। कृपया फिर से प्रयास करें।',
    ariaLabel: 'संदिग्ध URL',
  },

  te: {
    label: 'అనుమానాస్పద URL',
    placeholder:
      'అనుమానాస్పద URL ను పేస్ట్ చేయండి (ఉదా: https://example.com/login)…',
    clear: 'క్లియర్',
    analyze: 'URL ను విశ్లేషించండి',
    analyzing: 'విశ్లేషిస్తోంది…',
    empty: 'దయచేసి సమర్పించే ముందు URL ను నమోదు చేయండి.',
    invalid:
      'దయచేసి http:// లేదా https:// తో ప్రారంభమయ్యే చెల్లుబాటు అయ్యే URL ను నమోదు చేయండి (ఉదా: https://example.com).',
    timeout:
      'అభ్యర్థన సమయం ముగిసింది (10 సెకన్లు). బ్యాకెండ్ నెమ్మదిగా లేదా అందుబాటులో లేకపోవచ్చు — మళ్లీ ప్రయత్నించండి.',
    unreachable:
      'బ్యాకెండ్ సర్వర్‌ను చేరుకోలేకపోయాము. ఇది http://localhost:8000 వద్ద నడుస్తోందని నిర్ధారించండి.',
    analysisFailed: 'విశ్లేషణ విఫలమైంది',
    unexpected:
      'అనూహ్యమైన లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    ariaLabel: 'అనుమానాస్పద URL',
  },
};

/**
 * Classify an axios error into a user-friendly message.
 */
function getErrorMessage(err, language) {
  const t =
    translations[language] || translations.en;

  if (err?.code === 'ECONNABORTED') {
    return t.timeout;
  }

  if (!err?.response) {
    return t.unreachable;
  }

  const detail =
    err.response?.data?.detail ||
    err.response?.data?.message;

  return detail
    ? `${t.analysisFailed}: ${detail}`
    : t.unexpected;
}

export default function URLAnalyzer() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(
    getSelectedLanguage()
  );

  const navigate = useNavigate();

  /*
   * Keep this analyzer synchronized with the global
   * Navbar language selection.
   *
   * The custom event supports the existing same-tab
   * global language mechanism, while the storage event
   * safely handles changes from another browser tab/window.
   */
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

  const handleChange = (e) => {
    setUrl(e.target.value);

    if (error) {
      setError(null);
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError(t.empty);
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError(t.invalid);
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      /*
       * Keep the existing URL API contract unchanged.
       * The backend URL contract has not been confirmed
       * to accept a language field yet.
       */
      const result = await analyzeURL(trimmedUrl);

      navigate('/results', {
        state: { result },
      });
    } catch (err) {
      console.error(err);

      /*
       * Use the current global language when
       * constructing frontend error messages.
       */
      const currentLanguage =
        getSelectedLanguage();

      setError(
        getErrorMessage(
          err,
          currentLanguage
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled =
    url.trim().length === 0 || isLoading;

  return (
    <div className="url-analyzer-container">
      <form
        onSubmit={handleSubmit}
        className="url-analyzer-form"
        noValidate
      >
        <div className="input-group">
          <label
            htmlFor="suspicious-url"
            className="input-label"
          >
            {t.label}
          </label>

          <div className="url-input-wrapper">
            <div
              className="url-icon"
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
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>

            <input
              type="text"
              id="suspicious-url"
              className={`url-input${
                error ? ' input-error' : ''
              }`}
              placeholder={t.placeholder}
              value={url}
              onChange={handleChange}
              disabled={isLoading}
              aria-describedby="url-error"
              aria-invalid={!!error}
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <div className="url-footer">
            <div className="action-buttons">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClear}
                disabled={
                  url.length === 0 || isLoading
                }
              >
                {t.clear}
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isSubmitDisabled}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="15px" />

                    <span
                      style={{
                        marginLeft: '8px',
                      }}
                    >
                      {t.analyzing}
                    </span>
                  </>
                ) : (
                  t.analyze
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      <ErrorBanner
        id="url-error"
        message={error}
        onDismiss={() => setError(null)}
      />
    </div>
  );
}