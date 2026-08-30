import React, { useEffect, useRef, useState } from "react";
import "./Analysis.css";

import MessageAnalyzer from "../components/MessageAnalyzer";
import URLAnalyzer from "../components/URLAnalyzer";
import ScreenshotAnalyzer from "../components/ScreenshotAnalyzer";

const LANGUAGE_STORAGE_KEY = "phishlens-language";
const LANGUAGE_CHANGE_EVENT = "phishlens-language-change";

const translations = {
  en: {
    title: "Security Scanner",
    subtitle:
      "AI-powered phishing detection for messages, links, and screenshots.",
    messageScan: "📧 Message Scan",
    linkCheck: "🔗 Link Check",
    screenshotOCR: "📸 Screenshot OCR",
  },

  hi: {
    title: "सुरक्षा स्कैनर",
    subtitle:
      "संदेशों, लिंक और स्क्रीनशॉट के लिए एआई-संचालित फ़िशिंग पहचान।",
    messageScan: "📧 संदेश स्कैन",
    linkCheck: "🔗 लिंक जांच",
    screenshotOCR: "📸 स्क्रीनशॉट ओसीआर",
  },

  te: {
    title: "భద్రతా స్కానర్",
    subtitle:
      "సందేశాలు, లింకులు మరియు స్క్రీన్‌షాట్‌ల కోసం ఏఐ ఆధారిత ఫిషింగ్ గుర్తింపు.",
    messageScan: "📧 సందేశ స్కాన్",
    linkCheck: "🔗 లింక్ తనిఖీ",
    screenshotOCR: "📸 స్క్రీన్‌షాట్ OCR",
  },
};

const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem(
    LANGUAGE_STORAGE_KEY
  );

  return savedLanguage === "hi" || savedLanguage === "te"
    ? savedLanguage
    : "en";
};

const Analysis = () => {
  const [activeTab, setActiveTab] = useState("message");
  const [screenshotImage, setScreenshotImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [language, setLanguage] = useState(getInitialLanguage);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const selectedLanguage = event.detail;

      if (
        selectedLanguage === "en" ||
        selectedLanguage === "hi" ||
        selectedLanguage === "te"
      ) {
        setLanguage(selectedLanguage);
      }
    };

    window.addEventListener(
      LANGUAGE_CHANGE_EVENT,
      handleLanguageChange
    );

    return () => {
      window.removeEventListener(
        LANGUAGE_CHANGE_EVENT,
        handleLanguageChange
      );
    };
  }, []);

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

      reader.onerror = () => {
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

  const text = translations[language];

  return (
    <div className="analysis-page-container">
      <div className="analysis-header">
        <h1>{text.title}</h1>

        <p className="analysis-subtitle">
          {text.subtitle}
        </p>
      </div>

      <div className="scanner-container">
        <div className="scanner-tabs">
          <button
            type="button"
            className={`scanner-tab blue-tab ${
              activeTab === "message" ? "active" : ""
            }`}
            onClick={() =>
              handleTabChange("message")
            }
          >
            {text.messageScan}
          </button>

          <button
            type="button"
            className={`scanner-tab cyan-tab ${
              activeTab === "url" ? "active" : ""
            }`}
            onClick={() => handleTabChange("url")}
          >
            {text.linkCheck}
          </button>

          <button
            type="button"
            className={`scanner-tab purple-tab ${
              activeTab === "screenshot"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleTabChange("screenshot")
            }
          >
            {text.screenshotOCR}
          </button>
        </div>

        <div className="scanner-panels">
          <div
            className={`scanner-panel ${
              activeTab === "message"
                ? "active"
                : ""
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
              activeTab === "screenshot"
                ? "active"
                : ""
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