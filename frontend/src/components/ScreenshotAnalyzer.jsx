import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractTextFromImage } from '../services/ocr';
import { analyzeMessage } from '../services/api';
import Spinner from './Spinner';
import ErrorBanner from './ErrorBanner';
import './ScreenshotAnalyzer.css';

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
];

const translations = {
  en: {
    label: 'Suspicious Screenshot',
    upload: 'Click to upload a screenshot',
    hint: 'PNG or JPG · Max readable text recommended',
    remove: 'Remove Image',
    analyze: 'Extract & Analyze',
    extracting: 'Extracting Text…',
    analyzing: 'Analyzing…',
    ocrProgress: 'Extracting text using OCR…',
    backendProgress:
      'Sending extracted text to the intelligence engine…',
    invalidFile:
      'Unsupported file type. Please upload a PNG or JPG image.',
    ocrFailed:
      'OCR failed to process this image. Try a clearer screenshot with readable text.',
    noText:
      'No readable text was found in this image. Please upload a screenshot with visible message content.',
    timeout:
      'Request timed out (10 s). The backend may be slow or unavailable — please try again.',
    unreachable:
      'Cannot reach the backend server. Please ensure it is running at http://localhost:8000.',
    analysisFailed: 'Backend analysis failed',
    unexpected:
      'An unexpected error occurred during analysis. Please try again.',
  },

  hi: {
    label: 'संदिग्ध स्क्रीनशॉट',
    upload: 'स्क्रीनशॉट अपलोड करने के लिए क्लिक करें',
    hint: 'PNG या JPG · स्पष्ट टेक्स्ट वाला स्क्रीनशॉट बेहतर है',
    remove: 'छवि हटाएँ',
    analyze: 'टेक्स्ट निकालें और विश्लेषण करें',
    extracting: 'टेक्स्ट निकाला जा रहा है…',
    analyzing: 'विश्लेषण हो रहा है…',
    ocrProgress: 'OCR से टेक्स्ट निकाला जा रहा है…',
    backendProgress:
      'निकाला गया टेक्स्ट सुरक्षा इंजन को भेजा जा रहा है…',
    invalidFile:
      'असमर्थित फ़ाइल प्रकार। कृपया PNG या JPG छवि अपलोड करें।',
    ocrFailed:
      'OCR इस छवि को संसाधित नहीं कर सका। स्पष्ट और पढ़ने योग्य स्क्रीनशॉट आज़माएँ।',
    noText:
      'इस छवि में कोई पढ़ने योग्य टेक्स्ट नहीं मिला। कृपया स्पष्ट संदेश वाला स्क्रीनशॉट अपलोड करें।',
    timeout:
      'अनुरोध का समय समाप्त हो गया (10 सेकंड)। बैकएंड धीमा या अनुपलब्ध हो सकता है — कृपया फिर प्रयास करें।',
    unreachable:
      'बैकएंड सर्वर तक नहीं पहुँचा जा सकता। कृपया सुनिश्चित करें कि यह http://localhost:8000 पर चल रहा है।',
    analysisFailed: 'बैकएंड विश्लेषण विफल हुआ',
    unexpected:
      'विश्लेषण के दौरान एक अप्रत्याशित त्रुटि हुई। कृपया फिर प्रयास करें।',
  },

  te: {
    label: 'అనుమానాస్పద స్క్రీన్‌షాట్',
    upload: 'స్క్రీన్‌షాట్‌ను అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి',
    hint: 'PNG లేదా JPG · స్పష్టమైన టెక్స్ట్ ఉన్న చిత్రం ఉత్తమం',
    remove: 'చిత్రాన్ని తొలగించండి',
    analyze: 'టెక్స్ట్ తీసి విశ్లేషించండి',
    extracting: 'టెక్స్ట్ తీస్తోంది…',
    analyzing: 'విశ్లేషిస్తోంది…',
    ocrProgress: 'OCR ద్వారా టెక్స్ట్ తీస్తోంది…',
    backendProgress:
      'తీసిన టెక్స్ట్‌ను ఇంటెలిజెన్స్ ఇంజిన్‌కు పంపుతోంది…',
    invalidFile:
      'మద్దతు లేని ఫైల్ రకం. దయచేసి PNG లేదా JPG చిత్రాన్ని అప్‌లోడ్ చేయండి.',
    ocrFailed:
      'OCR ఈ చిత్రాన్ని ప్రాసెస్ చేయలేకపోయింది. మరింత స్పష్టమైన స్క్రీన్‌షాట్‌ను ప్రయత్నించండి.',
    noText:
      'ఈ చిత్రంలో చదవగలిగే టెక్స్ట్ కనుగొనబడలేదు. స్పష్టమైన సందేశం ఉన్న స్క్రీన్‌షాట్‌ను అప్‌లోడ్ చేయండి.',
    timeout:
      'అభ్యర్థన సమయం ముగిసింది (10 సెకన్లు). బ్యాకెండ్ నెమ్మదిగా లేదా అందుబాటులో లేకపోవచ్చు — మళ్లీ ప్రయత్నించండి.',
    unreachable:
      'బ్యాకెండ్ సర్వర్‌ను చేరుకోలేకపోయాము. ఇది http://localhost:8000 వద్ద నడుస్తుందో నిర్ధారించండి.',
    analysisFailed: 'బ్యాకెండ్ విశ్లేషణ విఫలమైంది',
    unexpected:
      'విశ్లేషణ సమయంలో అనూహ్యమైన లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
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

/**
 * Classify an axios error into a user-friendly message.
 */
function getApiErrorMessage(err, language) {
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

export default function ScreenshotAnalyzer() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(
    getSelectedLanguage()
  );

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(t.invalidFile);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    setProgress(0);
  };

  const handleExtractAndAnalyze = async () => {
    if (
      !imageFile ||
      isExtracting ||
      isAnalyzing
    ) {
      return;
    }

    setIsExtracting(true);
    setError(null);
    setProgress(0);

    let extractedText = '';

    const selectedLanguage =
      getSelectedLanguage();

    try {
      extractedText =
        await extractTextFromImage(
          imageFile,
          setProgress,
          selectedLanguage
        );
    } catch (err) {
      console.error(err);

      setError(t.ocrFailed);
      setIsExtracting(false);
      return;
    }

    if (
      !extractedText ||
      extractedText.trim().length === 0
    ) {
      setError(t.noText);
      setIsExtracting(false);
      return;
    }

    setIsExtracting(false);
    setIsAnalyzing(true);

    try {
      const result = await analyzeMessage(
        extractedText.trim(),
        selectedLanguage
      );

      navigate('/results', {
        state: { result },
      });
    } catch (err) {
      console.error(err);

      setError(
        getApiErrorMessage(
          err,
          selectedLanguage
        )
      );

      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isLoading =
    isExtracting || isAnalyzing;

  return (
    <div className="analyzer-container screenshot-analyzer-container">
      <div className="analyzer-form">
        <label className="input-label">
          {t.label}
        </label>

        {!imagePreview ? (
          <div
            className="upload-zone"
            onClick={() =>
              !isLoading &&
              fileInputRef.current?.click()
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (
                (e.key === 'Enter' ||
                  e.key === ' ') &&
                !isLoading
              ) {
                fileInputRef.current?.click();
              }
            }}
            aria-label={t.upload}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              className="file-input-hidden"
              aria-label={t.upload}
              disabled={isLoading}
            />

            <div
              className="upload-icon"
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
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                ></rect>

                <circle
                  cx="8.5"
                  cy="8.5"
                  r="1.5"
                ></circle>

                <polyline
                  points="21 15 16 10 5 21"
                ></polyline>
              </svg>
            </div>

            <p>{t.upload}</p>

            <span className="upload-hint">
              {t.hint}
            </span>
          </div>
        ) : (
          <div className="preview-container">
            <img
              src={imagePreview}
              alt={t.label}
              className="image-preview"
            />

            <div className="preview-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClear}
                disabled={isLoading}
              >
                {t.remove}
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleExtractAndAnalyze}
                disabled={isLoading}
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
                      {isExtracting
                        ? t.extracting
                        : t.analyzing}
                    </span>
                  </>
                ) : (
                  t.analyze
                )}
              </button>
            </div>
          </div>
        )}

        <ErrorBanner
          message={error}
          onDismiss={() => setError(null)}
        />

        {isExtracting && (
          <div
            className="progress-container"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${t.ocrProgress} ${progress}%`}
          >
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>

            <p className="progress-text">
              {t.ocrProgress} {progress}%
            </p>
          </div>
        )}

        {isAnalyzing && (
          <div
            className="progress-container"
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
            }}
          >
            <p
              className="progress-text"
              style={{
                textAlign: 'center',
              }}
            >
              {t.backendProgress}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}