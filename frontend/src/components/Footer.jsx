import { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';
import './Footer.css';

export default function Footer() {
  const [isHealthy, setIsHealthy] = useState(false);

  useEffect(() => {
    // Check health initially and every 30 seconds
    const performHealthCheck = async () => {
      const healthy = await checkHealth();
      setIsHealthy(healthy);
    };

    performHealthCheck();
    const intervalId = setInterval(performHealthCheck, 30000);
    return () => clearInterval(intervalId);
  }, []);

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
          <div className="footer-status" title={isHealthy ? "Backend is online" : "Backend is offline or unreachable"}>
            <span className={`status-indicator ${isHealthy ? 'pulse' : 'offline'}`}></span>
            API Status: {isHealthy ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PhishLens Omnikon. All rights reserved.</p>
      </div>
    </footer>
  );
}
