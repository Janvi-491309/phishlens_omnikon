import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractTextFromImage } from '../services/ocr';
import { analyzeMessage } from '../services/api';
import Spinner from './Spinner';
import './ScreenshotAnalyzer.css';

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
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Unsupported image format. Please use PNG or JPG.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setProgress(0);
    }
  };

  const handleExtractAndAnalyze = async () => {
    if (!imageFile || isExtracting || isAnalyzing) return;
    
    setIsExtracting(true);
    setError(null);
    setProgress(0);

    try {
      const extractedText = await extractTextFromImage(imageFile, setProgress);
      
      if (!extractedText) {
        setError('No text could be extracted from this image.');
        setIsExtracting(false);
        return;
      }
      
      // Move to analyzing phase
      setIsExtracting(false);
      setIsAnalyzing(true);
      
      try {
        const result = await analyzeMessage(extractedText);
        navigate('/results', { state: { result } });
      } catch (apiErr) {
        console.error(apiErr);
        setError('Backend analysis failed. Please ensure the backend is running at http://localhost:8000.');
        setIsAnalyzing(false);
      }
      
    } catch (err) {
      console.error(err);
      setError('Failed to extract text using OCR. Please try again with a clearer image.');
      setIsExtracting(false);
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
            onKeyDown={(e) => { if((e.key === 'Enter' || e.key === ' ') && !isLoading) fileInputRef.current?.click(); }}
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
              <button className="btn btn-secondary btn-sm" onClick={handleClear} disabled={isLoading}>
                Remove Image
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleExtractAndAnalyze} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner size="16px" />
                    <span style={{ marginLeft: '8px' }}>
                      {isExtracting ? 'Extracting Text...' : 'Analyzing...'}
                    </span>
                  </>
                ) : 'Extract & Analyze'}
              </button>
            </div>
          </div>
        )}

        {error && <div className="error-message" role="alert">{error}</div>}

        {isExtracting && (
          <div className="progress-container" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">Extracting text using OCR... {progress}%</p>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="progress-container" style={{ textAlign: 'center', marginTop: '2rem' }}>
             <p className="progress-text" style={{ textAlign: 'center' }}>Sending extracted text to intelligence engine...</p>
          </div>
        )}
      </div>
    </div>
  );
}
