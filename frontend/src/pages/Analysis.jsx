import React, { useState, useRef } from "react";
import "./Analysis.css";

import MessageAnalyzer from "../components/MessageAnalyzer";
import URLAnalyzer from "../components/URLAnalyzer";
import ScreenshotAnalyzer from "../components/ScreenshotAnalyzer";

const Analysis = () => {
  const [activeTab, setActiveTab] = useState("message");
  const [screenshotImage, setScreenshotImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setIsUploading(true);

      const reader = new FileReader();

      reader.onload = (e) => {
        setScreenshotImage(e.target.result);
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClearScreenshot = () => {
    setScreenshotImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="analysis-page-container">
      <div className="analysis-header">
        <h1>Security Scanner</h1>

        <p className="analysis-subtitle">
          AI-powered phishing detection for messages, links, and screenshots.
        </p>
      </div>

      <div className="scanner-container">
        <div className="scanner-tabs">
          <button
            className={`scanner-tab blue-tab ${
              activeTab === "message" ? "active" : ""
            }`}
            onClick={() => handleTabChange("message")}
          >
            <span className="tab-emoji">📧</span>
            Message Scan
          </button>

          <button
            className={`scanner-tab cyan-tab ${
              activeTab === "url" ? "active" : ""
            }`}
            onClick={() => handleTabChange("url")}
          >
            <span className="tab-emoji">🔗</span>
            Link Check
          </button>

          <button
            className={`scanner-tab purple-tab ${
              activeTab === "screenshot" ? "active" : ""
            }`}
            onClick={() => handleTabChange("screenshot")}
          >
            <span className="tab-emoji">📸</span>
            Screenshot OCR
          </button>
        </div>

        <div className="scanner-panels">
          <div
            className={`scanner-panel ${
              activeTab === "message" ? "active" : ""
            }`}
          >
            <MessageAnalyzer />
          </div>

          <div
            className={`scanner-panel ${
              activeTab === "url" ? "active" : ""
            }`}
          >
            <URLAnalyzer />
          </div>

          <div
            className={`scanner-panel ${
              activeTab === "screenshot" ? "active" : ""
            }`}
          >
            <ScreenshotAnalyzer
              screenshotImage={screenshotImage}
              isUploading={isUploading}
              onUpload={handleScreenshotUpload}
              onClear={handleClearScreenshot}
              fileInputRef={fileInputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;