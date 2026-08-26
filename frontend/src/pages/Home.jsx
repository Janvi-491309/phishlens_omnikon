import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Advanced Phishing Detection</div>
          <h1 className="hero-title">
            Detect Phishing.<br />
            <span className="text-gradient">Protect Everyone.</span>
          </h1>
          <p className="hero-subtitle">
            PhishLens analyzes suspicious messages, URLs, and screenshots to identify phishing risks and provide safe-action guidance in your regional language.
          </p>
          <div className="hero-actions">
            <Link to="/analyze" className="btn btn-primary btn-lg">Analyze Message</Link>
            <Link to="/analyze" className="btn btn-secondary btn-lg">Upload Screenshot</Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="glass-panel mock-phone">
            <div className="scan-line"></div>
            <div className="mock-message">
              <div className="mock-header">
                <div className="mock-avatar">S</div>
                <div className="mock-sender-info">
                  <div className="mock-sender">Support Alert</div>
                  <div className="mock-time">Just now</div>
                </div>
              </div>
              <div className="mock-body">
                Your account will be suspended. Click here to verify immediately: 
                <span className="mock-link"> http://secure-login.alert-update.com</span>
              </div>
              <div className="risk-indicator high-risk">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                High Risk Detected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Comprehensive Protection</h2>
        <p className="section-subtitle">Multi-vector analysis to catch what humans miss.</p>
        
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon bg-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3>Message Analysis</h3>
            <p>Analyze suspicious SMS, WhatsApp, and email content instantly for subtle phishing indicators and manipulation techniques.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon bg-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <h3>Screenshot OCR</h3>
            <p>Extract text from suspicious message screenshots before analysis seamlessly. Perfect for image-based spam and scams.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon bg-cyan">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
            </div>
            <h3>Risk Intelligence</h3>
            <p>Display backend-generated risk score, critical indicators, plain-language explanation, and safe action guidance.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="workflow">
        <h2 className="section-title">How It Works</h2>
        
        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <h4>1. Input</h4>
            <p>Paste text, a link, or upload a screenshot of the suspicious message.</p>
          </div>
          
          <div className="step-connector">
            <div className="connector-line"></div>
            <div className="connector-arrow"></div>
          </div>
          
          <div className="workflow-step">
            <div className="step-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h4>2. Detection</h4>
            <p>Our intelligence engine analyzes the content for known threat patterns.</p>
          </div>
          
          <div className="step-connector">
             <div className="connector-line"></div>
             <div className="connector-arrow"></div>
          </div>
          
          <div className="workflow-step">
            <div className="step-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h4>3. Risk Analysis</h4>
            <p>A detailed risk score and explanation of indicators are generated.</p>
          </div>
          
          <div className="step-connector">
             <div className="connector-line"></div>
             <div className="connector-arrow"></div>
          </div>
          
          <div className="workflow-step">
            <div className="step-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h4>4. Safe Action</h4>
            <p>Receive clear, regional-language guidance on what to do next.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
