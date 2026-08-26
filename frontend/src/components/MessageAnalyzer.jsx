import { useState } from 'react';
import './MessageAnalyzer.css';

export default function MessageAnalyzer({ onAnalyze }) {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClear = () => {
    setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onAnalyze(trimmedMessage);
    }
  };

  const isSubmitDisabled = message.trim().length === 0;

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
            aria-describedby="char-count"
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
                disabled={message.length === 0}
              >
                Clear
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
                disabled={isSubmitDisabled}
              >
                Analyze Message
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
