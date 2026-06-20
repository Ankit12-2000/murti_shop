import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { API_BASE, apiFetch } from '../utils/api';
import './InquiryModal.css';

const InquiryModal = ({ isOpen, onClose, product, productId, shopInfo }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPhone('');
      setMessage('');
      setSubmitted(false);
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
      const body = {
        phone: phone.trim(),
        message: message.trim() || null,
      };
      // Send product_code if product exists, otherwise send shop info in message
      const pCode = product?.product_code || productId;
      if (pCode) {
        body.product_code = pCode;
      } else if (shopInfo) {
        // Shop-level inquiry without specific product
        body.shop_id = shopInfo.id;
        body.message = `[Shop Inquiry: ${shopInfo.name}] ${body.message || 'General inquiry'}`;
        // API requires product_code, send first product or a placeholder
        body.product_code = shopInfo.firstProductCode || null;
      }

      const res = await apiFetch(`${API_BASE}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setError(json.message || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="inquiry-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="inquiry-modal">
        <button className="inquiry-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {submitted ? (
          <div className="inquiry-success">
            <div className="inquiry-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 className="inquiry-success-title">Inquiry Sent!</h3>
            <p className="inquiry-success-text">
              Aapki inquiry bhej di gayi hai. Shop owner jaldi aapko contact karenge.
            </p>
            <button className="inquiry-done-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="inquiry-header">
              <h3 className="inquiry-title">Send Inquiry</h3>
              <p className="inquiry-subtitle">Apna number aur message dein</p>
            </div>

            {product ? (
              <div className="inquiry-product">
                <div className="inquiry-product-img">
                  {product.image_url && !product.image_url.includes('example.com') ? (
                    <img src={product.image_url} alt={product.name} />
                  ) : (
                    <span>🕉️</span>
                  )}
                </div>
                <div className="inquiry-product-info">
                  <h4>{product.name}</h4>
                  <p>₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ) : shopInfo ? (
              <div className="inquiry-product">
                <div className="inquiry-product-img">
                  {shopInfo.image_url && !shopInfo.image_url.includes('example.com') ? (
                    <img src={shopInfo.image_url} alt={shopInfo.name} />
                  ) : (
                    <span>🏪</span>
                  )}
                </div>
                <div className="inquiry-product-info">
                  <h4>{shopInfo.name}</h4>
                  <p style={{ color: '#64748B', fontSize: '13px' }}>General Shop Inquiry</p>
                </div>
              </div>
            ) : null}

            <form className="inquiry-form" onSubmit={handleSubmit}>
              <div className="inquiry-field">
                <label>Phone Number</label>
                <div className="inquiry-phone-input">
                  <span className="inquiry-phone-prefix">+91</span>
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

              <div className="inquiry-field">
                <label>Message <span className="inquiry-optional">(optional)</span></label>
                <textarea
                  className="inquiry-textarea"
                  placeholder="e.g. Kya ye murti available hai?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                />
              </div>

              {error && <p className="inquiry-error">{error}</p>}

              <button type="submit" className="inquiry-submit-btn" disabled={submitting}>
                {submitting ? (
                  <>
                    <div className="inquiry-spinner"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Send Inquiry
                  </>
                )}
              </button>
            </form>

            <p className="inquiry-privacy">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Your details are safe with us. No spam, ever.
            </p>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default InquiryModal;
