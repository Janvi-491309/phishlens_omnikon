import { useState } from 'react';
import MessageAnalyzer from '../components/MessageAnalyzer';
import URLAnalyzer from '../components/URLAnalyzer';
import ScreenshotAnalyzer from '../components/ScreenshotAnalyzer';
import './Analysis.css';

const TABS = [
  { id: 'message', label: 'Message Scan', emoji: '💬', color: 'blue' },
  { id: 'url', label: 'Link Check', emoji: '🔗', color: 'cyan' },
  { id: 'screenshot', label: 'Screenshot OCR', emoji: '🖼', color: 'purple' },
];

export default function Analysis() {
  const [activeTab, setActiveTab] = useState('message');

  return (
    <div className="analysis-page-container">
      <div className="analysis-header scanner-hero">
        <h1>Security Scanner</h1>
        <p className="analysis-subtitle">
          Scan suspicious messages, links and screenshots in one unified dashboard.
        </p>
      </div>

      <div className="scanner-container">
        <div className="scanner-tabs" role="tablist" aria-label="Security scanner tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={activeTab === tab.id}
              aria-controls={`scanner-panel-${tab.id}`}
              id={`scanner-tab-${tab.id}`}
              className={`scanner-tab ${tab.color}-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-emoji" aria-hidden="true">{tab.emoji}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
          <div className={`tab-indicator ${activeTab}`} aria-hidden="true" />
        </div>

        <div className="scanner-panels">
          <div
            id="scanner-panel-message"
            role="tabpanel"
            aria-labelledby="scanner-tab-message"
            className={`scanner-panel ${activeTab === 'message' ? 'active' : ''}`}
          >
            <MessageAnalyzer />
          </div>
          <div
            id="scanner-panel-url"
            role="tabpanel"
            aria-labelledby="scanner-tab-url"
            className={`scanner-panel ${activeTab === 'url' ? 'active' : ''}`}
          >
            <URLAnalyzer />
          </div>
          <div
            id="scanner-panel-screenshot"
            role="tabpanel"
            aria-labelledby="scanner-tab-screenshot"
            className={`scanner-panel ${activeTab === 'screenshot' ? 'active' : ''}`}
          >
            <ScreenshotAnalyzer />
          </div>
        </div>
      </div>
    </div>
  );
}
