import { useLocation, useNavigate, Link } from 'react-router-dom';
import './Results.css';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="results-page-container empty-state">
        <div className="results-header">
          <h1>No Results Found</h1>
          <p className="results-subtitle">Please submit a message or URL for analysis first.</p>
          <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/analyze')}>
            Go to Analysis
          </button>
        </div>
      </div>
    );
  }

  const { risk_score, risk_level, findings, explanation, safe_action } = result;

  let riskColorClass = 'risk-low';
  if (risk_score >= 70 || (risk_level && risk_level.toUpperCase() === 'HIGH')) {
    riskColorClass = 'risk-high';
  } else if (risk_score >= 40 || (risk_level && risk_level.toUpperCase() === 'SUSPICIOUS')) {
    riskColorClass = 'risk-medium';
  } else if (risk_level && risk_level.toUpperCase() === 'SAFE') {
    riskColorClass = 'risk-low';
  }

  return (
    <div className="results-page-container">
      <div className="results-header">
        <h1>Analysis Results</h1>
        <p className="results-subtitle">Intelligence-driven threat detection complete.</p>
      </div>

      <div className="results-content">
        <div className="results-card">
          <div className="score-section">
            <div className={`risk-badge ${riskColorClass}`}>
              {risk_level || 'UNKNOWN'}
            </div>
            <div className={`score-circle ${riskColorClass}`}>
              <span className="score-value">{risk_score !== undefined ? risk_score : '?'}</span>
              <span className="score-max">/100</span>
            </div>
            <h3 className="score-label">Threat Score</h3>
          </div>

          <div className="details-section">
            <div className="detail-group">
              <h3>Explanation</h3>
              <p>{explanation || 'No explanation provided.'}</p>
            </div>

            <div className="detail-group">
              <h3>Key Findings</h3>
              {findings && findings.length > 0 ? (
                <ul className="indicators-list">
                  {findings.map((finding, index) => (
                    <li key={index}>
                      <span className="indicator-icon">⚠️</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No specific findings detected.</p>
              )}
            </div>

            <div className="detail-group action-group">
              <h3>Recommended Action</h3>
              <div className="safe-action-box">
                <span className="action-icon">🛡️</span>
                <p>{safe_action || 'No action specified. Proceed with caution.'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="results-actions">
          <Link to="/analyze" className="btn btn-primary btn-lg">
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
