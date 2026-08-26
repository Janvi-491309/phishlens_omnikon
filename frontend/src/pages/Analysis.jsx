import MessageAnalyzer from '../components/MessageAnalyzer';
import URLAnalyzer from '../components/URLAnalyzer';
import ScreenshotAnalyzer from '../components/ScreenshotAnalyzer';
import './Analysis.css';

export default function Analysis() {
  const handleAnalyzeMessage = (message) => {
    console.log("Analyzing message:", message);
  };

  const handleAnalyzeUrl = (url) => {
    console.log("Analyzing URL:", url);
  };

  const handleAnalyzeScreenshot = (text) => {
    console.log("Analyzing Extracted Text:", text);
  };

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
            <MessageAnalyzer onAnalyze={handleAnalyzeMessage} />
          </div>
          <div className="analyzer-section">
            <h2 className="analyzer-title">URL Analysis</h2>
            <URLAnalyzer onAnalyze={handleAnalyzeUrl} />
          </div>
          <div className="analyzer-section">
            <h2 className="analyzer-title">Screenshot Analysis</h2>
            <ScreenshotAnalyzer onAnalyze={handleAnalyzeScreenshot} />
          </div>
        </div>
      </div>
    </div>
  );
}
