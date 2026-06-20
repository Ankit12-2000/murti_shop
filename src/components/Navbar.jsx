import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginModal from './LoginModal';
import { categoryUrl } from '../utils/slug';
import { API_BASE, cachedFetch } from '../utils/api';
import './Navbar.css';

// Emoji fallback for categories
const categoryEmoji = {
  'ganesh ji': '🐘',
  'krishna ji': '🪈',
  'shiv ji': '🔱',
  'durga maa': '🦁',
  'ram ji': '🏹',
  'lakshmi ji': '🪷',
  'hanuman ji': '🙏',
  'saraswati maa': '🎵',
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('murti_user');
    return saved ? JSON.parse(saved) : null;
  });
  const location = useLocation();

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('murti_user');
    setUser(null);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const json = await cachedFetch(`${API_BASE}/api/home`);
        if (json.success && json.data.categories) {
          setCategories(json.data.categories);
        }
      } catch {
        // silently fail
      }
    };
    fetchCategories();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">BM</div>
          <span className="logo-text">BHAKTI <span className="logo-highlight">MART</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Categories with hover/click dropdown */}
          <div className="nav-dropdown-wrapper">
            <span
              className={`nav-link ${location.pathname.startsWith('/collections') ? 'active' : ''}`}
              onClick={() => setCatOpen(!catOpen)}
            >
              Categories
              <svg className={`nav-chevron ${catOpen ? 'nav-chevron-open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </span>
            <div className={`nav-mega-dropdown ${catOpen ? 'nav-mega-open' : ''}`}>
              <div className="mega-dropdown-inner">
                {categories.length > 0 ? (
                  categories.map((cat) => {
                    const emoji = categoryEmoji[cat.name.toLowerCase()] || '🙏';
                    const hasImage = cat.image_url && !cat.image_url.includes('example.com');
                    return (
                      <Link
                        to={categoryUrl(cat.name)}
                        key={cat.id}
                        className="mega-item"
                        onClick={() => setMenuOpen(false)}
                      >
                        <div className="mega-item-img">
                          {hasImage ? (
                            <img src={cat.image_url} alt={cat.name} />
                          ) : (
                            <span className="mega-item-emoji">{emoji}</span>
                          )}
                        </div>
                        <span className="mega-item-name">{cat.name}</span>
                      </Link>
                    );
                  })
                ) : (
                  <p className="mega-loading">Loading...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="navbar-icons">
          {user ? (
            <div className="nav-user-wrapper">
              <button className="icon-btn account-btn account-logged-in" aria-label="Account">
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </button>
              <div className="nav-user-dropdown">
                <div className="nav-user-info">
                  <p className="nav-user-name">{user.name || 'User'}</p>
                  <p className="nav-user-phone">{user.phone}</p>
                </div>
                <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <button className="icon-btn account-btn" aria-label="Login" onClick={() => setShowLogin(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </nav>
  );
};

export default Navbar;
