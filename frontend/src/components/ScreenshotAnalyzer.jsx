import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractTextFromImage } from '../services/ocr';
import { analyzeMessage } from '../services/api';
import Spinner from './Spinner';
import ErrorBanner from './ErrorBanner';
import './ScreenshotAnalyzer.css';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

/**
 * Classify an axios error into a user-friendly message.
 */
function getApiErrorMessage(err) {
  if (err.code === 'ECONNABORTED') {
    return 'Request timed out (10 s). The backend may be slow or unavailable — please try again.';
  }
  if (!err.response) {
    return 'Cannot reach the backend server. Please ensure it is running at http://localhost:8000.';
  }
  const detail = err.response?.data?.detail || err.response?.data?.message;
  return detail
    ? `Backend analysis failed: ${detail}`
    : 'An unexpected error occurred during analysis. Please try again.';
}

export default function ScreenshotAnalyzer() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload a PNG or JPG image.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    setProgress(0);
  };

  const handleExtractAndAnalyze = async () => {
    if (!imageFile || isExtracting || isAnalyzing) return;

    setIsExtracting(true);
    setError(null);
    setProgress(0);

    let extractedText = '';

    try {
      extractedText = await extractTextFromImage(imageFile, setProgress);
    } catch (err) {
      console.error(err);
      setError(
        'OCR failed to process this image. Try a clearer screenshot with readable text.'
      );
      setIsExtracting(false);
      return;
    }

    if (!extractedText || extractedText.trim().length === 0) {
      setError(
        'No readable text was found in this image. Please upload a screenshot with visible message content.'
      );
      setIsExtracting(false);
      return;
    }

    // Transition to backend analysis phase
    setIsExtracting(false);
    setIsAnalyzing(true);

    try {
      const result = await analyzeMessage(extractedText.trim());
      navigate('/results', { state: { result } });
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err));
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

  const isLoading = isExtracting || isAnalyzing;

  return (
    <div className="analyzer-container screenshot-analyzer-container">
      <div className="analyzer-form">
        <label className="input-label">Suspicious Screenshot</label>

        {!imagePreview ? (
          <div
            className="upload-zone"
            onClick={() => !isLoading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                fileInputRef.current?.click();
              }
            }}
            aria-label="Click to upload a screenshot image"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              className="file-input-hidden"
              aria-label="Upload a suspicious screenshot"
              disabled={isLoading}
            />
            <div className="upload-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p>Click to upload a screenshot</p>
            <span className="upload-hint">PNG or JPG · Max readable text recommended</span>
          </div>
        ) : (
          <div className="preview-container">
            <img src={imagePreview} alt="Screenshot preview" className="image-preview" />
            <div className="preview-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClear}
                disabled={isLoading}
              >
                Remove Image
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
                    <span style={{ marginLeft: '8px' }}>
                      {isExtracting ? 'Extracting Text…' : 'Analyzing…'}
                    </span>
                  </>
                ) : (
                  'Extract & Analyze'
                )}
              </button>
            </div>
          </div>
        )}

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {isExtracting && (
          <div
            className="progress-container"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`OCR progress: ${progress}%`}
          >
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">Extracting text using OCR… {progress}%</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="progress-container" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p className="progress-text" style={{ textAlign: 'center' }}>
              Sending extracted text to the intelligence engine…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
