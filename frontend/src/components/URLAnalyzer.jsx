import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeURL } from '../services/api';
import Spinner from './Spinner';
import './URLAnalyzer.css';

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
    if (!trimmedUrl || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeURL(trimmedUrl);
      navigate('/results', { state: { result } });
    } catch (err) {
      console.error(err);
      setError("Failed to analyze URL. Ensure the backend is running at http://localhost:8000.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = url.trim().length === 0 || isLoading;

  return (
    <div className="url-analyzer-container">
      <form onSubmit={handleSubmit} className="url-analyzer-form">
        <div className="input-group">
          <label htmlFor="suspicious-url" className="input-label">
            Suspicious URL
          </label>
          <div className="url-input-wrapper">
            <div className="url-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <input
              type="url"
              id="suspicious-url"
              className="url-input"
              placeholder="Paste a suspicious URL (e.g., https://example.com/login)..."
              value={url}
              onChange={handleChange}
              disabled={isLoading}
              aria-describedby="url-error"
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
              >
                {isLoading ? (
                  <>
                    <Spinner size="16px" />
                    <span style={{ marginLeft: '8px' }}>Analyzing...</span>
                  </>
                ) : 'Analyze URL'}
              </button>
            </div>
          </div>
        </div>
      </form>
      {error && <div id="url-error" className="error-message" role="alert" style={{ marginTop: '1rem' }}>{error}</div>}
    </div>
  );
}
