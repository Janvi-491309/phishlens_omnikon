import MessageAnalyzer from '../components/MessageAnalyzer';
import URLAnalyzer from '../components/URLAnalyzer';
import ScreenshotAnalyzer from '../components/ScreenshotAnalyzer';
import './Analysis.css';

export default function Analysis() {
  return (
    <div className="analysis-page-container">
      <div className="analysis-header">
        <h1>Analysis Center</h1>
        <p className="analysis-subtitle">
          Submit suspicious content below for intelligence-driven threat detection.
        </p>
      </div>
      
      <div className="analysis-content">
        <div className="analyzers-grid">
          <div className="analyzer-section">
            <h2 className="analyzer-title">Message Analysis</h2>
            <MessageAnalyzer />
          </div>
          <div className="analyzer-section">
            <h2 className="analyzer-title">URL Analysis</h2>
            <URLAnalyzer />
          </div>
          <div className="analyzer-section">
            <h2 className="analyzer-title">Screenshot Analysis</h2>
            <ScreenshotAnalyzer />
          </div>
        </div>
      </div>
    </div>
  );
}
