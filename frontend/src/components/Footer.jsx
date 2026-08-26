import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo-small">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>PhishLens</h3>
          </div>
          <p className="footer-description">
            Regional-language phishing detection helping users analyze suspicious messages, URLs, and screenshot-based content safely.
          </p>
        </div>
        <div className="footer-status-wrapper">
          <div className="footer-status">
            <span className="status-indicator pulse"></span>
            Project Status: Active
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PhishLens Omnikon. All rights reserved.</p>
      </div>
    </footer>
  );
}
