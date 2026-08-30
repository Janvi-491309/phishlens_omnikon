import React, { useEffect, useState } from "react";
import URLAnalyzer from "../components/URLAnalyzer";
import MessageAnalyzer from "../components/MessageAnalyzer";
import ScreenshotAnalyzer from "../components/ScreenshotAnalyzer";
import "./Home.css";

const LANGUAGE_STORAGE_KEY = "phishlens-language";
const LANGUAGE_CHANGE_EVENT = "phishlens-language-change";

const translations = {
  en: {
    badge: "🛡 AI Powered Phishing Protection",
    subtitle:
      "Detect phishing URLs, suspicious messages, and scam screenshots in seconds using AI-powered security analysis.",
    sectionTitle: "Why Choose PhishLens?",
    urlScanner: "🔗 URL Scanner",
    messageScanner: "💬 Message Scanner",
    screenshotScanner: "📸 Screenshot Scanner",
    features: [
      {
        icon: "🛡️",
        title: "Real-Time Detection",
        description:
          "Instantly analyze suspicious URLs, messages, and screenshots for phishing indicators.",
      },
      {
        icon: "🤖",
        title: "AI-Powered Analysis",
        description:
          "Hybrid rule-based and AI detection provides fast and reliable phishing risk assessment.",
      },
      {
        icon: "📊",
        title: "Risk Reports",
        description:
          "Understand suspicious content through risk scores, explanations, and recommended safe actions.",
      },
      {
        icon: "🌐",
        title: "Multi-Source Protection",
        description:
          "Protect yourself from phishing across websites, messages, screenshots, and regional-language scams.",
      },
    ],
  },

  hi: {
    badge: "🛡 एआई संचालित फ़िशिंग सुरक्षा",
    subtitle:
      "एआई आधारित सुरक्षा विश्लेषण से फ़िशिंग यूआरएल, संदिग्ध संदेश और स्क्रीनशॉट को कुछ ही सेकंड में पहचानें।",
    sectionTitle: "PhishLens क्यों चुनें?",
    urlScanner: "🔗 यूआरएल स्कैनर",
    messageScanner: "💬 संदेश स्कैनर",
    screenshotScanner: "📸 स्क्रीनशॉट स्कैनर",
    features: [
      {
        icon: "🛡️",
        title: "रियल-टाइम पहचान",
        description:
          "संदिग्ध यूआरएल, संदेश और स्क्रीनशॉट का तुरंत विश्लेषण करके फ़िशिंग संकेत पहचानें।",
      },
      {
        icon: "🤖",
        title: "एआई आधारित विश्लेषण",
        description:
          "नियम-आधारित और एआई पहचान तेज़ और विश्वसनीय फ़िशिंग जोखिम आकलन प्रदान करती है।",
      },
      {
        icon: "📊",
        title: "जोखिम रिपोर्ट",
        description:
          "जोखिम स्कोर, व्याख्या और सुरक्षित कार्रवाई के माध्यम से संदिग्ध सामग्री को समझें।",
      },
      {
        icon: "🌐",
        title: "बहु-स्रोत सुरक्षा",
        description:
          "वेबसाइट, संदेश, स्क्रीनशॉट और क्षेत्रीय भाषाओं में फ़िशिंग से सुरक्षा पाएं।",
      },
    ],
  },

  te: {
    badge: "🛡 ఏఐ ఆధారిత ఫిషింగ్ రక్షణ",
    subtitle:
      "ఏఐ ఆధారిత భద్రతా విశ్లేషణతో ఫిషింగ్ URLలు, అనుమానాస్పద సందేశాలు మరియు స్క్రీన్‌షాట్‌లను కొన్ని సెకన్లలో గుర్తించండి.",
    sectionTitle: "PhishLens ఎందుకు ఎంచుకోవాలి?",
    urlScanner: "🔗 URL స్కానర్",
    messageScanner: "💬 సందేశ స్కానర్",
    screenshotScanner: "📸 స్క్రీన్‌షాట్ స్కానర్",
    features: [
      {
        icon: "🛡️",
        title: "రియల్-టైమ్ గుర్తింపు",
        description:
          "అనుమానాస్పద URLలు, సందేశాలు మరియు స్క్రీన్‌షాట్‌లను వెంటనే విశ్లేషించి ఫిషింగ్ సంకేతాలను గుర్తించండి.",
      },
      {
        icon: "🤖",
        title: "ఏఐ ఆధారిత విశ్లేషణ",
        description:
          "నియమాలు మరియు ఏఐ ఆధారిత గుర్తింపు వేగవంతమైన మరియు నమ్మదగిన ఫిషింగ్ ప్రమాద అంచనాను అందిస్తుంది.",
      },
      {
        icon: "📊",
        title: "రిస్క్ నివేదికలు",
        description:
          "రిస్క్ స్కోర్, వివరణ మరియు సురక్షిత చర్యల ద్వారా అనుమానాస్పద కంటెంట్‌ను అర్థం చేసుకోండి.",
      },
      {
        icon: "🌐",
        title: "బహుళ-మూల రక్షణ",
        description:
          "వెబ్‌సైట్లు, సందేశాలు, స్క్రీన్‌షాట్‌లు మరియు ప్రాంతీయ భాషల ఫిషింగ్ నుండి రక్షణ పొందండి.",
      },
    ],
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

const Home = () => {
  const [activeTab, setActiveTab] = useState("url");
  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    setIsVisible(true);

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

  const text = translations[language];

  return (
    <div className="home-container">
      {/* ================= HERO ================= */}

      <section
        className={`hero-section ${
          isVisible ? "fade-in" : ""
        }`}
      >
        <div className="hero-content">
          <span className="hero-badge">
            {text.badge}
          </span>

          <h1 className="hero-title">
            <span className="gradient-text">
              PhishLens
            </span>
          </h1>

          <p className="hero-subtitle">
            {text.subtitle}
          </p>
        </div>
      </section>

      {/* ================= ANALYZER ================= */}

      <section className="analyzer-section">
        <div className="tabs-container">
          <div className="tabs">
            <button
              type="button"
              className={`tab-button ${
                activeTab === "url" ? "active" : ""
              }`}
              onClick={() => setActiveTab("url")}
            >
              {text.urlScanner}
            </button>

            <button
              type="button"
              className={`tab-button ${
                activeTab === "message" ? "active" : ""
              }`}
              onClick={() => setActiveTab("message")}
            >
              {text.messageScanner}
            </button>

            <button
              type="button"
              className={`tab-button ${
                activeTab === "screenshot"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("screenshot")
              }
            >
              {text.screenshotScanner}
            </button>
          </div>
        </div>

        <div className="analyzer-content">
          <div
            className={`tab-panel ${
              activeTab === "url" ? "active" : ""
            }`}
          >
            <URLAnalyzer />
          </div>

          <div
            className={`tab-panel ${
              activeTab === "message" ? "active" : ""
            }`}
          >
            <MessageAnalyzer />
          </div>

          <div
            className={`tab-panel ${
              activeTab === "screenshot"
                ? "active"
                : ""
            }`}
          >
            <ScreenshotAnalyzer />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="features-section">
        <h2 className="section-title">
          {text.sectionTitle}
        </h2>

        <div className="features-grid">
          {text.features.map((feature, index) => (
            <div
              className="feature-card"
              key={index}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;