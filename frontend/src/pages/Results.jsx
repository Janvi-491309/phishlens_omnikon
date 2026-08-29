import { useLocation, useNavigate, Link } from 'react-router-dom';
import './Results.css';

/* ─── Helper: Classify risk level ───────────────── */
function getRiskClass(risk_score, risk_level) {
  const level = (risk_level || '').toUpperCase();
  if (level === 'HIGH' || risk_score >= 70) return 'risk-high';
  if (level === 'MEDIUM' || level === 'SUSPICIOUS' || risk_score >= 40) return 'risk-medium';
  return 'risk-low';
}

/* ─── Component: Risk Badge ──────────────────────── */
function RiskBadge({ riskLevel, riskClass }) {
  return (
    <div className={`risk-badge ${riskClass}`} role="status">
      <span className="risk-badge-dot" aria-hidden="true"></span>
      <span>{riskLevel || 'UNKNOWN'} RISK</span>
    </div>
  );
}

/* ─── Component: Risk Score Card ─────────────────── */
function RiskScoreCard({ riskScore, riskLevel, riskClass }) {
  return (
    <aside className="score-section risk-score-card" aria-label="Risk assessment score">
      <RiskBadge riskLevel={riskLevel} riskClass={riskClass} />

      <div 
        className={`score-circle ${riskClass}`} 
        aria-label={`Threat score: ${riskScore ?? 'unknown'} out of 100`}
      >
        <span className="score-value">{riskScore !== undefined ? riskScore : '?'}</span>
        <span className="score-max">/100</span>
      </div>

      <div className="score-meta">
        <h2 className="score-label">Threat Score</h2>
        <p className="score-description">
          {riskScore >= 70 ? 'High probability of malicious intent' :
           riskScore >= 40 ? 'Suspicious patterns detected' :
           'No immediate threat detected'}
        </p>
      </div>
    </aside>
  );
}

/* ─── Component: Explanation Card ────────────────── */
function ExplanationCard({ explanation }) {
  return (
    <div className="result-sub-card explanation-card">
      <div className="result-sub-card-header">
        <span className="result-sub-card-icon icon-explanation" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </span>
        <h3>Analysis Explanation</h3>
      </div>
      <div className="result-sub-card-body">
        <p>{explanation || 'No explanation was provided by the analysis engine.'}</p>
      </div>
    </div>
  );
}

/* ─── Component: Findings List ───────────────────── */
function FindingsList({ findings }) {
  return (
    <div className="result-sub-card findings-card">
      <div className="result-sub-card-header">
        <span className="result-sub-card-icon icon-findings" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <h3>Key Threat Indicators</h3>
      </div>
      <div className="result-sub-card-body">
        {findings && findings.length > 0 ? (
          <ul className="indicators-list" aria-label="Detected threat indicators">
            {findings.map((finding, index) => (
              <li key={index}>
                <span className="indicator-icon" aria-hidden="true">⚠️</span>
                <span className="indicator-text">{finding}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-findings">No specific threat indicators were detected.</p>
        )}
      </div>
    </div>
  );
}

/* ─── Component: Safe Action Card ────────────────── */
function SafeActionCard({ safeAction }) {
  return (
    <div className="result-sub-card safe-action-card">
      <div className="result-sub-card-header">
        <span className="result-sub-card-icon icon-safe-action" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </span>
        <h3>Recommended Safe Action</h3>
      </div>
      <div className="result-sub-card-body">
        <div className="safe-action-box" role="note" aria-label="Safety recommendation">
          <span className="action-icon" aria-hidden="true">🛡️</span>
          <p>{safeAction || 'No specific action was provided. Proceed with caution.'}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Results Page ──────────────────────────── */
export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  /* Empty state */
  if (!result) {
    return (
      <div className="results-page-container empty-state" role="main">
        <div className="results-header">
          <div className="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h1>No Results Found</h1>
          <p className="results-subtitle">Please submit a message, URL or screenshot for analysis first.</p>
          <button
            className="btn btn-primary btn-lg"
            style={{ marginTop: '2rem' }}
            onClick={() => navigate('/analyze')}
          >
            Go to Analysis
          </button>
        </div>
      </div>
    );
  }

  const { risk_score, risk_level, findings, explanation, safe_action } = result;
  const riskClass = getRiskClass(risk_score, risk_level);

  return (
    <div className="results-page-container" role="main">
      <div className="results-header fade-in-up">
        <h1>Analysis Results</h1>
        <p className="results-subtitle">Multi-vector threat intelligence assessment complete.</p>
      </div>

      <div className="results-content">
        {/* ── Main Outer Card ── */}
        <div className="results-card fade-in-up" style={{ animationDelay: '0.08s' }}>

          {/* Left: Score Card Panel */}
          <RiskScoreCard 
            riskScore={risk_score} 
            riskLevel={risk_level} 
            riskClass={riskClass} 
          />

          {/* Right: Details Cards */}
          <div className="details-section">
            <ExplanationCard explanation={explanation} />
            <FindingsList findings={findings} />
            <SafeActionCard safeAction={safe_action} />
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="results-actions fade-in-up" style={{ animationDelay: '0.16s' }}>
          <Link to="/analyze" className="btn btn-primary btn-lg">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }} aria-hidden="true">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Analyze Another
          </Link>
          <Link to="/" className="btn btn-secondary btn-lg">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
