import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeMessage } from '../services/api';
import Spinner from './Spinner';
import ErrorBanner from './ErrorBanner';
import './MessageAnalyzer.css';

const translations = {
  en: {
    label: 'Suspicious Message Content',
    placeholder: 'Paste a suspicious SMS, WhatsApp or email message...',
    characters: 'characters',
    clear: 'Clear',
    analyze: 'Analyze Message',
    analyzing: 'Analyzing…',
    empty: 'Please paste a message before submitting.',
    timeout:
      'Request timed out (10 s). The backend may be slow or unavailable — please try again.',
    unreachable:
      'Cannot reach the backend server. Please ensure it is running at http://localhost:8000.',
    analysisFailed: 'Analysis failed',
    unexpected: 'An unexpected error occurred. Please try again.',
  },

  hi: {
    label: 'संदिग्ध संदेश सामग्री',
    placeholder:
      'संदिग्ध SMS, WhatsApp या ईमेल संदेश यहाँ पेस्ट करें...',
    characters: 'अक्षर',
    clear: 'साफ़ करें',
    analyze: 'संदेश का विश्लेषण करें',
    analyzing: 'विश्लेषण हो रहा है…',
    empty: 'कृपया विश्लेषण के लिए कोई संदेश पेस्ट करें।',
    timeout:
      'अनुरोध का समय समाप्त हो गया (10 सेकंड)। बैकएंड धीमा या अनुपलब्ध हो सकता है — कृपया फिर प्रयास करें।',
    unreachable:
      'बैकएंड सर्वर तक नहीं पहुँचा जा सकता। कृपया सुनिश्चित करें कि यह http://localhost:8000 पर चल रहा है।',
    analysisFailed: 'विश्लेषण विफल हुआ',
    unexpected:
      'एक अप्रत्याशित त्रुटि हुई। कृपया फिर से प्रयास करें।',
  },

  te: {
    label: 'అనుమానాస్పద సందేశం',
    placeholder:
      'అనుమానాస్పద SMS, WhatsApp లేదా ఇమెయిల్ సందేశాన్ని ఇక్కడ పేస్ట్ చేయండి...',
    characters: 'అక్షరాలు',
    clear: 'క్లియర్',
    analyze: 'సందేశాన్ని విశ్లేషించండి',
    analyzing: 'విశ్లేషిస్తోంది…',
    empty: 'విశ్లేషించడానికి దయచేసి ఒక సందేశాన్ని పేస్ట్ చేయండి.',
    timeout:
      'అభ్యర్థన సమయం ముగిసింది (10 సెకన్లు). బ్యాకెండ్ నెమ్మదిగా లేదా అందుబాటులో లేకపోవచ్చు — దయచేసి మళ్లీ ప్రయత్నించండి.',
    unreachable:
      'బ్యాకెండ్ సర్వర్‌ను చేరుకోలేకపోయాము. ఇది http://localhost:8000 వద్ద నడుస్తుందో నిర్ధారించండి.',
    analysisFailed: 'విశ్లేషణ విఫలమైంది',
    unexpected:
      'అనూహ్యమైన లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
  },
};

function getSelectedLanguage() {
  const storedLanguage = localStorage.getItem('phishlens-language');
  const validLanguages = ['en', 'hi', 'te'];

  return validLanguages.includes(storedLanguage)
    ? storedLanguage
    : 'en';
}

/**
 * Classify an axios error into a user-friendly,
 * language-aware message.
 */
function getErrorMessage(err, language) {
  const t = translations[language] || translations.en;

  if (err.code === 'ECONNABORTED') {
    return t.timeout;
  }

  if (!err.response) {
    return t.unreachable;
  }

  const detail = err.response?.data?.detail || err.response?.data?.message;

  return detail
    ? `${t.analysisFailed}: ${detail}`
    : t.unexpected;
}

export default function MessageAnalyzer() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const language = getSelectedLanguage();
  const t = translations[language] || translations.en;

  const handleChange = (e) => {
    setMessage(e.target.value);

    if (error) {
      setError(null);
    }
  };

  const handleClear = () => {
    setMessage('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError(t.empty);
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const selectedLanguage = getSelectedLanguage();

      const result = await analyzeMessage(
        trimmedMessage,
        selectedLanguage
      );

      navigate('/results', { state: { result } });
    } catch (err) {
      console.error(err);

      const selectedLanguage = getSelectedLanguage();

      setError(
        getErrorMessage(err, selectedLanguage)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled =
    message.trim().length === 0 || isLoading;

  return (
    <div className="message-analyzer-container">
      <form
        onSubmit={handleSubmit}
        className="message-analyzer-form"
        noValidate
      >
        <div className="input-group">
          <label
            htmlFor="suspicious-message"
            className="input-label"
          >
            {t.label}
          </label>

          <textarea
            id="suspicious-message"
            className={`message-textarea${
              error ? ' input-error' : ''
            }`}
            placeholder={t.placeholder}
            value={message}
            onChange={handleChange}
            rows="6"
            aria-describedby="char-count msg-error"
            aria-invalid={!!error}
            disabled={isLoading}
          />

          <div className="textarea-footer">
            <span
              id="char-count"
              className="char-count"
            >
              {message.length} {t.characters}
            </span>

            <div className="action-buttons">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClear}
                disabled={
                  message.length === 0 || isLoading
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
                    <span style={{ marginLeft: '8px' }}>
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
        id="msg-error"
        message={error}
        onDismiss={() => setError(null)}
      />
    </div>
  );
}