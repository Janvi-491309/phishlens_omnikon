import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import "./Results.css";

const LANGUAGE_STORAGE_KEY = "phishlens-language";
const LANGUAGE_CHANGE_EVENT = "phishlens-language-change";

const translations = {
  en: {
    language: "Language",
    reportTitle: "Threat Analysis Report",
    reportSubtitle:
      "Multi-vector threat intelligence assessment complete.",
    scanComplete: "Scan Complete",

    riskScore: "Threat Score",
    riskLevel: "Risk Level",
    scanType: "Scan Type",
    multiVector: "Multi-Vector Scan",
    confidence: "Threat Confidence",

    high: "HIGH",
    medium: "MEDIUM",
    low: "LOW",
    unknown: "UNKNOWN",

    highDescription:
      "High probability of phishing or malicious activity detected.",
    mediumDescription:
      "Suspicious patterns detected. Verify before interacting.",
    lowDescription:
      "No immediate phishing indicators were detected.",

    confidenceHigh: "High",
    confidenceMedium: "Medium",
    confidenceLow: "Low",

    explanation: "Analysis Explanation",
    findings: "Threat Indicators Detected",
    safeAction: "Recommended Safe Action",

    noExplanation:
      "No explanation was provided by the analysis engine.",
    noFindings:
      "No specific threat indicators were detected.",
    noSafeAction:
      "No specific action was provided. Proceed with caution.",

    noResults: "No Results Found",
    noResultsText:
      "Please submit a message, URL or screenshot for analysis first.",
    goToAnalysis: "Go to Security Scanner",

    analyzeAnother: "Analyze Another Item",
    returnHome: "Return Home",
  },

  hi: {
    language: "भाषा",
    reportTitle: "खतरे का विश्लेषण रिपोर्ट",
    reportSubtitle:
      "बहु-स्रोत सुरक्षा विश्लेषण सफलतापूर्वक पूरा हुआ।",
    scanComplete: "स्कैन पूरा हुआ",

    riskScore: "जोखिम स्कोर",
    riskLevel: "जोखिम स्तर",
    scanType: "स्कैन प्रकार",
    multiVector: "बहु-स्रोत स्कैन",
    confidence: "खतरे का विश्वास स्तर",

    high: "उच्च",
    medium: "मध्यम",
    low: "कम",
    unknown: "अज्ञात",

    highDescription:
      "फ़िशिंग या दुर्भावनापूर्ण गतिविधि की उच्च संभावना पाई गई।",
    mediumDescription:
      "संदिग्ध पैटर्न पाए गए। आगे बढ़ने से पहले सत्यापित करें।",
    lowDescription:
      "कोई तत्काल फ़िशिंग संकेत नहीं पाए गए।",

    confidenceHigh: "उच्च",
    confidenceMedium: "मध्यम",
    confidenceLow: "कम",

    explanation: "विश्लेषण की व्याख्या",
    findings: "पाए गए खतरे के संकेत",
    safeAction: "अनुशंसित सुरक्षित कार्रवाई",

    noExplanation:
      "विश्लेषण इंजन द्वारा कोई व्याख्या उपलब्ध नहीं कराई गई।",
    noFindings:
      "कोई विशिष्ट खतरे के संकेत नहीं पाए गए।",
    noSafeAction:
      "कोई विशिष्ट कार्रवाई उपलब्ध नहीं है। सावधानी से आगे बढ़ें।",

    noResults: "कोई परिणाम नहीं मिला",
    noResultsText:
      "इस रिपोर्ट को देखने से पहले कोई संदेश, यूआरएल या स्क्रीनशॉट सबमिट करें।",
    goToAnalysis: "सुरक्षा स्कैनर खोलें",

    analyzeAnother: "एक और आइटम का विश्लेषण करें",
    returnHome: "होम पर लौटें",
  },

  te: {
    language: "భాష",
    reportTitle: "ముప్పు విశ్లేషణ నివేదిక",
    reportSubtitle:
      "బహుళ-వెక్టర్ ముప్పు విశ్లేషణ విజయవంతంగా పూర్తయింది.",
    scanComplete: "స్కాన్ పూర్తయింది",

    riskScore: "రిస్క్ స్కోర్",
    riskLevel: "రిస్క్ స్థాయి",
    scanType: "స్కాన్ రకం",
    multiVector: "బహుళ-వెక్టర్ స్కాన్",
    confidence: "ముప్పు నమ్మక స్థాయి",

    high: "అధిక",
    medium: "మధ్యస్థ",
    low: "తక్కువ",
    unknown: "తెలియదు",

    highDescription:
      "ఫిషింగ్ లేదా హానికరమైన చర్యకు అధిక అవకాశం గుర్తించబడింది.",
    mediumDescription:
      "అనుమానాస్పద నమూనాలు గుర్తించబడ్డాయి. కొనసాగించే ముందు ధృవీకరించండి.",
    lowDescription:
      "తక్షణ ఫిషింగ్ సంకేతాలు గుర్తించబడలేదు.",

    confidenceHigh: "అధిక",
    confidenceMedium: "మధ్యస్థ",
    confidenceLow: "తక్కువ",

    explanation: "విశ్లేషణ వివరణ",
    findings: "గుర్తించిన ముప్పు సంకేతాలు",
    safeAction: "సిఫార్సు చేసిన సురక్షిత చర్య",

    noExplanation:
      "విశ్లేషణ ఇంజిన్ ఎటువంటి వివరణను అందించలేదు.",
    noFindings:
      "ఎటువంటి ప్రత్యేక ముప్పు సంకేతాలు గుర్తించబడలేదు.",
    noSafeAction:
      "ఎటువంటి ప్రత్యేక చర్య అందించబడలేదు. జాగ్రత్తగా కొనసాగండి.",

    noResults: "ఫలితాలు కనుగొనబడలేదు",
    noResultsText:
      "ఈ నివేదికను చూడటానికి ముందు సందేశం, URL లేదా స్క్రీన్‌షాట్‌ను సమర్పించండి.",
    goToAnalysis: "సెక్యూరిటీ స్కానర్‌కు వెళ్లండి",

    analyzeAnother: "మరో అంశాన్ని విశ్లేషించండి",
    returnHome: "హోమ్‌కు తిరిగి వెళ్లండి",
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

/* ================= RISK CLASSIFICATION ================= */

function getRiskClass(risk_score, risk_level) {
  const score = Number(risk_score) || 0;
  const level = String(risk_level || "").toUpperCase();

  if (level === "HIGH" || score >= 70) {
    return "risk-high";
  }

  if (
    level === "MEDIUM" ||
    level === "SUSPICIOUS" ||
    score >= 40
  ) {
    return "risk-medium";
  }

  return "risk-low";
}

/* ================= RISK BADGE ================= */

function RiskBadge({
  riskLevel,
  riskClass,
  text,
}) {
  const normalizedLevel = String(
    riskLevel || ""
  ).toUpperCase();

  let displayLevel = text.unknown;

  if (normalizedLevel === "HIGH") {
    displayLevel = text.high;
  } else if (
    normalizedLevel === "MEDIUM" ||
    normalizedLevel === "SUSPICIOUS"
  ) {
    displayLevel =
      normalizedLevel === "SUSPICIOUS"
        ? text.medium
        : text.medium;
  } else if (normalizedLevel === "LOW") {
    displayLevel = text.low;
  }

  return (
    <div
      className={`risk-badge ${riskClass}`}
      role="status"
    >
      <span
        className="risk-badge-dot"
        aria-hidden="true"
      />

      <span>{displayLevel} RISK</span>
    </div>
  );
}

/* ================= SCORE CARD ================= */

function RiskScoreCard({
  riskScore,
  riskLevel,
  riskClass,
  text,
}) {
  const numericScore = Number(riskScore);

  const score = Number.isFinite(numericScore)
    ? Math.max(0, Math.min(numericScore, 100))
    : 0;

  const description =
    score >= 70
      ? text.highDescription
      : score >= 40
      ? text.mediumDescription
      : text.lowDescription;

  const confidence =
    score >= 70
      ? text.confidenceHigh
      : score >= 40
      ? text.confidenceMedium
      : text.confidenceLow;

  const normalizedLevel = String(
    riskLevel || ""
  ).toUpperCase();

  let localizedLevel = text.unknown;

  if (normalizedLevel === "HIGH") {
    localizedLevel = text.high;
  } else if (
    normalizedLevel === "MEDIUM" ||
    normalizedLevel === "SUSPICIOUS"
  ) {
    localizedLevel = text.medium;
  } else if (normalizedLevel === "LOW") {
    localizedLevel = text.low;
  }

  return (
    <aside
      className="score-section risk-score-card"
      aria-label={text.riskScore}
    >
      <div className="score-top-row">
        <RiskBadge
          riskLevel={riskLevel}
          riskClass={riskClass}
          text={text}
        />
      </div>

      <div
        className={`score-circle-wrapper ${riskClass}`}
      >
        <div
          className={`score-progress-ring ${riskClass}`}
          style={{
            "--score": `${score}%`,
          }}
        >
          <div
            className={`score-circle-glow ${riskClass}`}
            aria-hidden="true"
          />

          <div
            className={`score-circle ${riskClass}`}
            aria-label={`${text.riskScore}: ${score} / 100`}
          >
            <span className="score-value">
              {score}
            </span>

            <span className="score-max">
              /100
            </span>
          </div>
        </div>
      </div>

      <div className="score-meta">
        <h2 className="score-label">
          {text.riskScore}
        </h2>

        <p className="score-description">
          {description}
        </p>
      </div>

      <div className="threat-summary glass-card">
        <div className="summary-item">
          <span className="summary-label">
            {text.riskLevel}
          </span>

          <span className="summary-value">
            {localizedLevel}
          </span>
        </div>

        <div className="summary-item">
          <span className="summary-label">
            {text.scanType}
          </span>

          <span className="summary-value">
            {text.multiVector}
          </span>
        </div>

        <div className="summary-item">
          <span className="summary-label">
            {text.confidence}
          </span>

          <span className="summary-value">
            {confidence}
          </span>
        </div>
      </div>
    </aside>
  );
}

/* ================= EXPLANATION ================= */

function ExplanationCard({
  explanation,
  text,
}) {
  return (
    <section className="result-sub-card explanation-card glass-card">
      <div className="result-sub-card-header">
        <span
          className="result-sub-card-icon icon-explanation"
          aria-hidden="true"
        >
          🧠
        </span>

        <h3>{text.explanation}</h3>
      </div>

      <div className="result-sub-card-body">
        <p>
          {explanation || text.noExplanation}
        </p>
      </div>
    </section>
  );
}

/* ================= FINDINGS ================= */

function FindingsList({
  findings,
  text,
}) {
  const hasFindings =
    Array.isArray(findings) &&
    findings.length > 0;

  return (
    <section className="result-sub-card findings-card glass-card">
      <div className="result-sub-card-header">
        <span
          className="result-sub-card-icon icon-findings"
          aria-hidden="true"
        >
          🚨
        </span>

        <h3>{text.findings}</h3>
      </div>

      <div className="result-sub-card-body">
        {hasFindings ? (
          <ul
            className="indicators-list"
            aria-label={text.findings}
          >
            {findings.map((finding, index) => (
              <li key={index}>
                <span
                  className="indicator-icon"
                  aria-hidden="true"
                >
                  ⚠️
                </span>

                <span className="indicator-text">
                  {finding}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-findings">
            {text.noFindings}
          </p>
        )}
      </div>
    </section>
  );
}

/* ================= SAFE ACTION ================= */

function SafeActionCard({
  safeAction,
  text,
}) {
  return (
    <section className="result-sub-card safe-action-card glass-card">
      <div className="result-sub-card-header">
        <span
          className="result-sub-card-icon icon-safe-action"
          aria-hidden="true"
        >
          🛡️
        </span>

        <h3>{text.safeAction}</h3>
      </div>

      <div className="result-sub-card-body">
        <div
          className="safe-action-box"
          role="note"
          aria-label={text.safeAction}
        >
          <p>
            {safeAction || text.noSafeAction}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================= RESULTS PAGE ================= */

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    getInitialLanguage
  );

  /*
   * IMPORTANT:
   * This is the Round 2 backend contract.
   * Do not rename this.
   */
  const result = location.state?.result;

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

  const text = translations[language];

  /* ---------- EMPTY STATE ---------- */

  if (!result) {
    return (
      <main
        className="results-page-container empty-state"
        role="main"
      >
        <div className="results-header">
          <div className="empty-icon" aria-hidden="true">
            🔍
          </div>

          <h1>{text.noResults}</h1>

          <p className="results-subtitle">
            {text.noResultsText}
          </p>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/analyze")}
          >
            {text.goToAnalysis}
          </button>
        </div>
      </main>
    );
  }

  /*
   * EXACT backend field names.
   */
  const {
    risk_score,
    risk_level,
    findings,
    explanation,
    safe_action,
  } = result;

  const riskClass = getRiskClass(
    risk_score,
    risk_level
  );

  return (
    <main
      className="results-page-container"
      role="main"
    >
      {/* ================= HERO ================= */}

      <section className="hero-section glass-hero fade-in-up">
        <div
          className="hero-glow"
          aria-hidden="true"
        />

        <div className="hero-content">
          <div className="hero-status-row">
            <div
              className="hero-icon-wrapper"
              aria-hidden="true"
            >
              <span className="hero-icon">
                🛡️
              </span>
            </div>

            <div className="scan-status-pill">
              ✓ {text.scanComplete}
            </div>
          </div>

          <h1 className="threat-report-title">
            {text.reportTitle}
          </h1>

          <p className="results-subtitle">
            {text.reportSubtitle}
          </p>
        </div>
      </section>

      {/* ================= DASHBOARD ================= */}

      <section className="results-content">
        <div
          className="results-card fade-in-up"
          style={{
            animationDelay: "0.08s",
          }}
        >
          <RiskScoreCard
            riskScore={risk_score}
            riskLevel={risk_level}
            riskClass={riskClass}
            text={text}
          />

          <div className="intelligence-panel">
            <ExplanationCard
              explanation={explanation}
              text={text}
            />

            <FindingsList
              findings={findings}
              text={text}
            />

            <SafeActionCard
              safeAction={safe_action}
              text={text}
            />
          </div>
        </div>

        {/* ================= ACTIONS ================= */}

        <div
          className="results-actions fade-in-up"
          style={{
            animationDelay: "0.16s",
          }}
        >
          <Link
            to="/analyze"
            className="btn btn-primary btn-lg scan-again-btn"
          >
            {text.analyzeAnother}
          </Link>

          <Link
            to="/"
            className="btn btn-secondary btn-lg"
          >
            {text.returnHome}
          </Link>
        </div>
      </section>
    </main>
  );
}