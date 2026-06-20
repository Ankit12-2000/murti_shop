import { useState, useEffect } from 'react';
import { API_BASE, apiFetch } from '../utils/api';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPhone('');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        // Save user in localStorage
        localStorage.setItem('murti_user', JSON.stringify(json.data));
        onLogin(json.data, json.is_new_user);
        onClose();
      } else {
        setError(json.message || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button className="login-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="login-logo">
          <div className="login-logo-icon">M</div>
          <span className="login-logo-text">BHAKTI <span>MART</span></span>
        </div>

        <h3 className="login-title">Welcome to Bhakti Mart</h3>
        <p className="login-subtitle">Login or register with your phone number</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Phone Number</label>
            <div className="login-phone-input">
              <span className="login-phone-prefix">+91</span>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength="10"
                autoFocus
              />
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit-btn" disabled={submitting}>
            {submitting ? (
              <>
                <div className="login-spinner"></div>
                Please wait...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        <p className="login-privacy">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
