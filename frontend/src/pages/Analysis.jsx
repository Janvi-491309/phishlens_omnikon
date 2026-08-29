import MessageAnalyzer from '../components/MessageAnalyzer';
import URLAnalyzer from '../components/URLAnalyzer';
import ScreenshotAnalyzer from '../components/ScreenshotAnalyzer';
import './Analysis.css';

export default function Analysis() {
  return (
    <div className="analysis-page-container">
      <div className="analysis-header">
        <h1>Analyze Suspicious Content</h1>
        <p className="analysis-subtitle">
          Choose an input type and let the engine detect phishing threats in messages, URLs, and screenshots.
        </p>
      </div>

      <div className="analysis-content">
        <div className="analyzers-grid">
          <div className="analyzer-section message-section">
            <h2 className="analyzer-title">
              <span className="section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              Message Analysis
              <span className="section-badge">Text</span>
            </h2>
            <MessageAnalyzer />
          </div>

          <div className="analyzer-section url-section">
            <h2 className="analyzer-title">
              <span className="section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </span>
              URL Analysis
              <span className="section-badge">Link</span>
            </h2>
            <URLAnalyzer />
          </div>

          <div className="analyzer-section screenshot-section">
            <h2 className="analyzer-title">
              <span className="section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </span>
              Screenshot Analysis
              <span className="section-badge">Image</span>
            </h2>
            <ScreenshotAnalyzer />
          </div>
        </div>
      </div>
    </div>
  );
}
