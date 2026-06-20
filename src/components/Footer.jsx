import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryUrl } from '../utils/slug';
import { API_BASE, cachedFetch } from '../utils/api';
import './Footer.css';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const json = await cachedFetch(`${API_BASE}/api/home`);
        if (json.success && json.data.categories) {
          setCategories(json.data.categories);
        }
      } catch {
        // silently fail - footer still works with static links
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">BM</div>
              <span className="footer-logo-text">BHAKTI <span className="footer-logo-highlight">MART</span></span>
            </Link>
            <p className="footer-brand-text">
              Preserving Indian heritage through exquisite craftsmanship. Connecting you with the finest murtis for your spiritual journey.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={categoryUrl(cat.name)}>{cat.name}</Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/collections/ganesh-ji">Ganesh Ji</Link></li>
                  <li><Link to="/collections/krishna-ji">Krishna Ji</Link></li>
                  <li><Link to="/collections/shiv-ji">Shiv Ji</Link></li>
                  <li><Link to="/collections/durga-maa">Durga Maa</Link></li>
                  <li><Link to="/collections/ram-ji">Ram Ji</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shops</Link></li>
              <li><a href="#">Custom Orders</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Bulk Inquiries</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Returns & Refunds</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4 className="footer-heading">Newsletter</h4>
            <p className="footer-newsletter-text">
              Subscribe to receive festive offers and new collection updates.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Email Address" className="newsletter-input" />
              <button className="newsletter-btn" aria-label="Subscribe">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Bhakti Mart. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
