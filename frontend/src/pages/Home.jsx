import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import URLAnalyzer from "../components/URLAnalyzer";
import MessageAnalyzer from "../components/MessageAnalyzer";
import ScreenshotAnalyzer from "../components/ScreenshotAnalyzer";
import "./Home.css";

const Home = () => {
  const [activeTab, setActiveTab] = useState("url");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="home-container">
      {/* Hero */}
      <section className={`hero-section ${isVisible ? "fade-in" : ""}`}>
        <div className="hero-content">
          <span className="hero-badge">🛡 AI Powered Phishing Protection</span>

          <h1 className="hero-title">
            <span className="gradient-text">PhishLens</span>
          </h1>

          <p className="hero-subtitle">
            Detect phishing URLs, suspicious messages, and scam screenshots in
            seconds using AI-powered security analysis.
          </p>
        </div>
      </section>

      {/* Analyzer Section (UNCHANGED FUNCTIONALITY) */}
      <section className="analyzer-section">
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "url" ? "active" : ""}`}
              onClick={() => setActiveTab("url")}
            >
              🔗 URL Scanner
            </button>

            <button
              className={`tab-button ${activeTab === "message" ? "active" : ""}`}
              onClick={() => setActiveTab("message")}
            >
              💬 Message Scanner
            </button>

            <button
              className={`tab-button ${activeTab === "screenshot" ? "active" : ""}`}
              onClick={() => setActiveTab("screenshot")}
            >
              📸 Screenshot Scanner
            </button>
          </div>
        </div>

        <div className="analyzer-content">
          <div className={`tab-panel ${activeTab === "url" ? "active" : ""}`}>
            <URLAnalyzer />
          </div>

          <div className={`tab-panel ${activeTab === "message" ? "active" : ""}`}>
            <MessageAnalyzer />
          </div>

          <div
            className={`tab-panel ${
              activeTab === "screenshot" ? "active" : ""
            }`}
          >
            <ScreenshotAnalyzer />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Why Choose PhishLens?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Real-Time Detection</h3>
            <p>
              Instantly analyze suspicious URLs, messages, and screenshots for
              phishing indicators.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Analysis</h3>
            <p>
              Hybrid rule-based and AI detection provides fast and reliable risk
              assessment.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Risk Reports</h3>
            <p>
              Understand why content is suspicious through clear explanations,
              risk scores, and safe actions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Multi-Source Protection</h3>
            <p>
              Protect yourself from phishing attempts across text messages,
              websites, screenshots, and regional-language scams.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;