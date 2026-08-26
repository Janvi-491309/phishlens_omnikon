import { useState, useRef } from 'react';
import { extractTextFromImage } from '../services/ocr';
import OCRResult from './OCRResult';
import './ScreenshotAnalyzer.css';

export default function ScreenshotAnalyzer({ onAnalyze }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Unsupported image format. Please use PNG or JPG.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setExtractedText('');
      setError(null);
      setProgress(0);
    }
  };

  const handleExtractText = async () => {
    if (!imageFile) return;
    setIsExtracting(true);
    setError(null);
    setProgress(0);
    setExtractedText('');

    try {
      const text = await extractTextFromImage(imageFile, setProgress);
      if (!text) {
        setError('No text could be extracted from this image.');
      } else {
        setExtractedText(text);
        if (onAnalyze) {
          onAnalyze(text);
        }
      }
    } catch (err) {
      setError('Failed to extract text. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setExtractedText('');
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="analyzer-container screenshot-analyzer-container">
      <div className="analyzer-form">
        <label className="input-label">Suspicious Screenshot</label>
        
        {!imagePreview ? (
          <div 
            className="upload-zone"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              className="file-input-hidden"
              aria-label="Upload a suspicious screenshot"
            />
            <div className="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p>Click to upload a screenshot</p>
            <span className="upload-hint">PNG or JPG</span>
          </div>
        ) : (
          <div className="preview-container">
            <img src={imagePreview} alt="Screenshot preview" className="image-preview" />
            <div className="preview-actions">
              <button className="btn btn-secondary btn-sm" onClick={handleClear}>
                Remove Image
              </button>
              {!extractedText && !isExtracting && (
                <button className="btn btn-primary btn-sm" onClick={handleExtractText}>
                  Extract Text
                </button>
              )}
            </div>
          </div>
        )}

        {error && <div className="error-message" role="alert">{error}</div>}

        {isExtracting && (
          <div className="progress-container" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">Extracting text... {progress}%</p>
          </div>
        )}

        {extractedText && (
          <OCRResult text={extractedText} onClear={() => setExtractedText('')} />
        )}
      </div>
    </div>
  );
}
