import { useLocation, useNavigate, Link } from 'react-router-dom';
import './Results.css';

/* ================= Risk Classification ================= */
function getRiskClass(risk_score, risk_level) {
  const score = Number(risk_score) || 0;
  const level = (risk_level || '').toUpperCase();

  if (level === 'HIGH' || score >= 70) return 'risk-high';
  if (level === 'MEDIUM' || level === 'SUSPICIOUS' || score >= 40)
    return 'risk-medium';

  return 'risk-low';
}

/* ================= Risk Badge ================= */
function RiskBadge({ riskLevel, riskClass }) {
  return (
    <div className={`risk-badge ${riskClass}`} role="status">
      <span className="risk-badge-dot" aria-hidden="true"></span>
      <span>{(riskLevel || 'UNKNOWN').toUpperCase()} RISK</span>
    </div>
  );
}

/* ================= Risk Score Card ================= */
function RiskScoreCard({ riskScore, riskLevel, riskClass }) {
  const score = Math.max(0, Math.min(Number(riskScore) || 0, 100));

  return (
    <aside className="score-section risk-score-card">
      <RiskBadge riskLevel={riskLevel} riskClass={riskClass} />

      <div className={`score-circle-wrapper ${riskClass}`}>
        <div
          className={`score-progress-ring ${riskClass}`}
          style={{ '--score': `${score}%` }}
        >
          <div className={`score-circle-glow ${riskClass}`}>
            <div
              className={`score-circle ${riskClass}`}
              aria-label={`Threat score: ${score} out of 100`}
            >
              <span className="score-value">{score}</span>
              <span className="score-max">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="score-meta">
        <h2 className="score-label">Threat Score</h2>
        <p className="score-description">
          {score >= 70
            ? 'High probability of phishing or malicious activity detected.'
            : score >= 40
            ? 'Suspicious patterns detected. Verify before interacting.'
            : 'No immediate phishing indicators were detected.'}
        </p>
      </div>

      <div className="threat-summary glass-card">
        <div className="summary-item">
          <span className="summary-label">Risk Level</span>
          <span className="summary-value">{riskLevel || 'Unknown'}</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Scan Type</span>
          <span className="summary-value">Multi-Vector Scan</span>
        </div>

        <div className="summary-item">
          <span className="summary-label">Threat Confidence</span>
          <span className="summary-value">
            {score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'}
          </span>
        </div>
      </div>
    </aside>
  );
}

/* ================= Explanation Card ================= */
function ExplanationCard({ explanation }) {
  return (
    <section className="result-sub-card explanation-card glass-card">
      <div className="result-sub-card-header">
        <span className="result-sub-card-icon icon-explanation">🧠</span>
        <h3>Analysis Explanation</h3>
      </div>

      <div className="result-sub-card-body">
        <p>
          {explanation ||
            'No explanation was returned from the phishing analysis engine.'}
        </p>
      </div>
    </section>
  );
}

/* ================= Findings Card ================= */
function FindingsList({ findings }) {
  return (
    <section className="result-sub-card findings-card glass-card">
      <div className="result-sub-card-header">
        <span className="result-sub-card-icon icon-findings">🚨</span>
        <h3>Threat Indicators Detected</h3>
      </div>

      <div className="result-sub-card-body">
        {Array.isArray(findings) && findings.length > 0 ? (
          <ul className="indicators-list">
            {findings.map((finding, index) => (
              <li key={index}>
                <span className="indicator-icon">⚠️</span>
                <span className="indicator-text">{finding}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-findings">
            No specific phishing indicators were detected.
          </p>
        )}
      </div>
    </section>
  );
}

/* ================= Safe Action Card ================= */
function SafeActionCard({ safeAction }) {
  return (
    <section className="result-sub-card safe-action-card glass-card">
      <div className="result-sub-card-header">
        <span className="result-sub-card-icon icon-safe-action">🛡️</span>
        <h3>Recommended Safe Action</h3>
      </div>

      <div className="result-sub-card-body">
        <div className="safe-action-box">
          <p>
            {safeAction ||
              'No recommendation was returned. Treat this content with caution.'}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================= Results Page ================= */
export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  // Backend contract from Round 2 — DO NOT CHANGE
  const result = location.state?.result;

  /* ---------- Empty State ---------- */
  if (!result) {
    return (
      <main className="results-page-container empty-state">
        <div className="results-header">
          <div className="empty-icon">🔍</div>

          <h1>No Results Found</h1>

          <p className="results-subtitle">
            Submit a suspicious message, URL or screenshot before viewing the
            threat report.
          </p>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/analyze')}
          >
            Go to Security Scanner
          </button>
        </div>
      </main>
    );
  }

  const { risk_score, risk_level, findings, explanation, safe_action } = result;
  const riskClass = getRiskClass(risk_score, risk_level);

  return (
    <main className="results-page-container">
      {/* ================= HERO ================= */}
      <section className="hero-section glass-hero fade-in-up">
        <div className="hero-glow"></div>

        <div className="hero-content">
          <div className="hero-icon-wrapper">
            <div className="hero-icon">🛡️</div>
          </div>

          <div className="scan-status-pill">✔ Scan Complete</div>

          <h1 className="threat-report-title">Threat Analysis Report</h1>

          <p className="results-subtitle">
            PhishLens completed a multi-vector phishing intelligence assessment
            across suspicious messages, URLs and screenshots.
          </p>
        </div>
      </section>

      {/* ================= DASHBOARD ================= */}
      <section className="results-content">
        <div className="results-card fade-in-up">
          <RiskScoreCard
            riskScore={risk_score}
            riskLevel={risk_level}
            riskClass={riskClass}
          />

          <div className="intelligence-panel">
            <ExplanationCard explanation={explanation} />
            <FindingsList findings={findings} />
            <SafeActionCard safeAction={safe_action} />
          </div>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <section className="results-actions fade-in-up">
          <Link
            to="/analyze"
            className="btn btn-primary btn-lg scan-again-btn"
          >
            Analyze Another Item
          </Link>

          <Link to="/" className="btn btn-secondary btn-lg">
            Return Home
          </Link>
        </section>
      </section>
    </main>
  );
}