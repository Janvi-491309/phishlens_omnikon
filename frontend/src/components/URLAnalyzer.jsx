import { useState } from 'react';
import './URLAnalyzer.css';

export default function URLAnalyzer({ onAnalyze }) {
  const [url, setUrl] = useState('');

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleClear = () => {
    setUrl('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (trimmedUrl) {
      onAnalyze(trimmedUrl);
    }
  };

  const isSubmitDisabled = url.trim().length === 0;

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
              type="text"
              id="suspicious-url"
              className="url-input"
              placeholder="Paste a suspicious URL (e.g., https://example.com)..."
              value={url}
              onChange={handleChange}
            />
          </div>
          <div className="url-footer">
            <div className="action-buttons">
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handleClear}
                disabled={url.length === 0}
              >
                Clear
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
                disabled={isSubmitDisabled}
              >
                Analyze URL
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
