import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryUrl } from '../utils/slug';
import './Hero.css';

const Hero = ({ banners = [], categories = [] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const banner = banners[current];

  // Category tabs
  const categoryTabs = [
    { name: 'All Categories', link: '/shop' },
    ...categories.slice(0, 7).map(cat => ({
      name: cat.name,
      link: categoryUrl(cat.name),
    })),
  ];

  return (
    <>
      {/* Category Tabs */}
      {categories.length > 0 && (
        <div className="home-cat-bar">
          <div className="home-cat-bar-inner">
            {categoryTabs.map((tab, i) => (
              <Link
                key={i}
                to={tab.link}
                className={`home-cat-tab ${i === 0 ? 'home-cat-tab-active' : ''}`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section - 2 columns */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Left - Banner */}
          <div className="hero-banner">
            {banner?.image_url && !banner.image_url.includes('example.com') && (
              <img
                src={banner.image_url}
                alt={banner?.title}
                className="hero-bg-image"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div className="hero-banner-overlay"></div>
            <div className="hero-banner-content">
              <span className="hero-label">HERITAGE CELEBRATION</span>
              <h1 className="hero-title">{banner?.title || 'Festive Specials'}</h1>
              <p className="hero-description">
                Exclusive collection of handcrafted idols from the heart of India. Limited edition artisan pieces.
              </p>
              <Link to={banner?.link || '/shop'} className="hero-explore-btn">
                Explore Collection
              </Link>
            </div>
            {banners.length > 1 && (
              <div className="hero-dots">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    className={`hero-dot ${i === current ? 'active' : ''}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right - Verified Exporters */}
          <div className="hero-exporters">
            <h3 className="hero-export-title">Verified Exporters</h3>
            <p className="hero-export-desc">
              Connect with GST-verified artisans for bulk global shipping and wholesale inquiries.
            </p>
            <div className="hero-export-features">
              <div className="hero-export-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B6914" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                <span>QUALITY CERTIFICATION</span>
              </div>
              <div className="hero-export-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B6914" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span>EXPORT COMPLIANT</span>
              </div>
            </div>
            <Link to="/shop" className="hero-register-btn">Register as Buyer</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
