import { useState } from 'react';
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
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Classify an axios error into a user-friendly message.
 */
function getErrorMessage(err) {
  if (err.code === 'ECONNABORTED') {
    return 'Request timed out (10 s). The backend may be slow or unavailable — please try again.';
  }
  if (!err.response) {
    return 'Cannot reach the backend server. Please ensure it is running at http://localhost:8000.';
  }
  const detail = err.response?.data?.detail || err.response?.data?.message;
  return detail
    ? `Analysis failed: ${detail}`
    : 'An unexpected error occurred. Please try again.';
}

export default function URLAnalyzer() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUrl(e.target.value);
    if (error) setError(null);
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('Please enter a URL before submitting.');
      return;
    }
    if (!isValidUrl(trimmedUrl)) {
      setError(
        'Please enter a valid URL starting with http:// or https:// (e.g. https://example.com).'
      );
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeURL(trimmedUrl);
      navigate('/results', { state: { result } });
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = url.trim().length === 0 || isLoading;

  return (
    <div className="url-analyzer-container">
      <form onSubmit={handleSubmit} className="url-analyzer-form" noValidate>
        <div className="input-group">
          <label htmlFor="suspicious-url" className="input-label">
            Suspicious URL
          </label>
          <div className="url-input-wrapper">
            <div className="url-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <input
              type="text"
              id="suspicious-url"
              className={`url-input${error ? ' input-error' : ''}`}
              placeholder="Paste a suspicious URL (e.g. https://example.com/login)…"
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
                disabled={url.length === 0 || isLoading}
              >
                Clear
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
                    <span style={{ marginLeft: '8px' }}>Analyzing…</span>
                  </>
                ) : (
                  'Analyze URL'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      <ErrorBanner id="url-error" message={error} onDismiss={() => setError(null)} />
    </div>
  );
}
