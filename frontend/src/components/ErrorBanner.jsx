import './ErrorBanner.css';

/**
 * Reusable error banner component with an icon and optional dismiss button.
 * Renders nothing when message is falsy.
 *
 * @param {string}   message   - Error text to display. Pass null/'' to hide.
 * @param {Function} onDismiss - Optional callback; renders an X button when provided.
 * @param {string}   id        - Optional id for aria-describedby linkage.
 */
export default function ErrorBanner({ message, onDismiss, id }) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert" aria-live="polite" id={id}>
      <span className="error-banner-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </span>
      <span className="error-banner-message">{message}</span>
      {onDismiss && (
        <button
          type="button"
          className="error-banner-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
