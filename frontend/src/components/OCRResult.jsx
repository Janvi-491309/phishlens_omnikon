import { useState } from 'react';
import './OCRResult.css';

export default function OCRResult({ text, onClear }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ocr-result-container">
      <div className="ocr-result-header">
        <h4>Extracted Text</h4>
        <div className="ocr-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleCopy} aria-label="Copy extracted text">
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onClear} aria-label="Clear extracted text">
            Clear Text
          </button>
        </div>
      </div>
      <div className="ocr-textarea-wrapper">
        <textarea
          className="ocr-textarea"
          value={text}
          readOnly
          rows="5"
          aria-label="Extracted text"
        />
      </div>
    </div>
  );
}
