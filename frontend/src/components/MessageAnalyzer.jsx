import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeMessage } from '../services/api';
import Spinner from './Spinner';
import './MessageAnalyzer.css';

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
    if (!trimmedMessage || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeMessage(trimmedMessage);
      navigate('/results', { state: { result } });
    } catch (err) {
      console.error(err);
      setError("Failed to analyze message. Ensure the backend is running at http://localhost:8000.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = message.trim().length === 0 || isLoading;

  return (
    <div className="message-analyzer-container">
      <form onSubmit={handleSubmit} className="message-analyzer-form">
        <div className="input-group">
          <label htmlFor="suspicious-message" className="input-label">
            Suspicious Message Content
          </label>
          <textarea
            id="suspicious-message"
            className="message-textarea"
            placeholder="Paste a suspicious SMS, WhatsApp or email message..."
            value={message}
            onChange={handleChange}
            rows="6"
            aria-describedby="char-count message-error"
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
              >
                {isLoading ? (
                  <>
                    <Spinner size="16px" />
                    <span style={{ marginLeft: '8px' }}>Analyzing...</span>
                  </>
                ) : 'Analyze Message'}
              </button>
            </div>
          </div>
        </div>
      </form>
      {error && <div id="message-error" className="error-message" role="alert" style={{ marginTop: '1rem' }}>{error}</div>}
    </div>
  );
}
