import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeMessage } from '../services/api';
import Spinner from './Spinner';
import ErrorBanner from './ErrorBanner';
import './MessageAnalyzer.css';

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

export default function MessageAnalyzer() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (error) setError(null);
  };

  const handleClear = () => {
    setMessage('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError('Please paste a message before submitting.');
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeMessage(trimmedMessage);
      navigate('/results', { state: { result } });
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = message.trim().length === 0 || isLoading;

  return (
    <div className="message-analyzer-container">
      <form onSubmit={handleSubmit} className="message-analyzer-form" noValidate>
        <div className="input-group">
          <label htmlFor="suspicious-message" className="input-label">
            Suspicious Message Content
          </label>
          <textarea
            id="suspicious-message"
            className={`message-textarea${error ? ' input-error' : ''}`}
            placeholder="Paste a suspicious SMS, WhatsApp or email message..."
            value={message}
            onChange={handleChange}
            rows="6"
            aria-describedby="char-count msg-error"
            aria-invalid={!!error}
            disabled={isLoading}
          />
          <div className="textarea-footer">
            <span id="char-count" className="char-count">
              {message.length} characters
            </span>
            <div className="action-buttons">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClear}
                disabled={message.length === 0 || isLoading}
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
                  'Analyze Message'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      <ErrorBanner id="msg-error" message={error} onDismiss={() => setError(null)} />
    </div>
  );
}
