import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shopUrl } from '../utils/slug';
import { API_BASE, cachedFetch } from '../utils/api';
import InquiryModal from '../components/InquiryModal';
import './Shop.css';

const locations = ['All', 'Jaipur, Rajasthan', 'Varanasi, UP', 'New Delhi', 'Agra', 'Gujarat', 'Indore'];
const categories = ['Marble Statues', 'Brass Artifacts', 'Hand-carved Wood', 'Pashmina Textiles'];
const sortOptions = [
  { value: 'featured', label: 'Response Time' },
  { value: 'newest', label: 'Newest First' },
];

const Shop = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategories, setSelectedCategories] = useState(['Marble Statues']);
  const [sortBy, setSortBy] = useState('featured');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryShop, setInquiryShop] = useState(null);
  const limit = 8;

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: currentPage, limit });
        if (selectedLocation !== 'All') params.set('location', selectedLocation.split(',')[0]);
        if (sortBy === 'newest') params.set('sort', 'newest');
        const json = await cachedFetch(`${API_BASE}/api/shops?${params}`);
        if (json.success) {
          setShops(json.data || []);
          setPagination(json.pagination || null);
        } else {
          setError('Failed to load shops');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [currentPage, selectedLocation, sortBy]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleLocation = (loc) => {
    setSelectedLocation(prev => prev === loc ? 'All' : loc);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedLocation('All');
    setSelectedCategories(['Marble Statues']);
    setSortBy('featured');
    setCurrentPage(1);
  };

  useEffect(() => {
    const close = () => setShowSortDropdown(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const getPageNumbers = () => {
    if (!pagination) return [1];
    const total = pagination.total_pages;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [1, 2, 3];
    if (total > 4) pages.push('...');
    if (total > 3) pages.push(total);
    return pages;
  };

  const memberYear = (dateStr) => {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const years = new Date().getFullYear() - y;
    return `${y} (${years} Years)`;
  };

  return (
    <div className="sl-page">
      <div className="sl-container">
        {/* Left Sidebar */}
        <aside className={`sl-sidebar ${showFilters ? 'sl-sidebar-open' : ''}`}>
          <h3 className="sl-sidebar-title">Refine Search</h3>

          <div className="sl-filter-group">
            <h4 className="sl-filter-label">CATEGORIES</h4>
            {categories.map((cat) => (
              <label key={cat} className="sl-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span className="sl-checkmark"></span>
                {cat}
              </label>
            ))}
          </div>

          <div className="sl-filter-group">
            <h4 className="sl-filter-label">CRAFT HUBS</h4>
            {locations.filter(l => l !== 'All').map((loc) => (
              <label key={loc} className="sl-checkbox">
                <input
                  type="checkbox"
                  checked={selectedLocation === loc}
                  onChange={() => toggleLocation(loc)}
                />
                <span className="sl-checkmark"></span>
                {loc}
              </label>
            ))}
          </div>

          <button className="sl-reset-btn" onClick={resetFilters}>Reset All Filters</button>

          {/* Promo Card */}
          <div className="sl-promo">
            <div className="sl-promo-overlay"></div>
            <div className="sl-promo-content">
              <h4>Bulk Order Concierge</h4>
              <p>Get customized quotes for corporate gifting and international exports.</p>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <main className="sl-main">
          <div className="sl-main-header">
            <div className="sl-title-row">
              <h1 className="sl-title">
                Verified Artisan Shops
                {pagination && <span className="sl-count">({pagination.total_items} matches)</span>}
              </h1>
              <button className={`sl-filter-toggle ${showFilters ? 'sl-filter-toggle-active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/></svg>
                {showFilters ? 'Hide Filters' : 'Filters'}
              </button>
            </div>
            <div className="sl-sort-wrapper" onClick={(e) => e.stopPropagation()}>
              <span className="sl-sort-label">Sort by:</span>
              <button className="sl-sort-btn" onClick={() => setShowSortDropdown(!showSortDropdown)}>
                {sortOptions.find(s => s.value === sortBy)?.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {showSortDropdown && (
                <div className="sl-sort-dropdown">
                  {sortOptions.map((opt) => (
                    <button key={opt.value} className={`sl-sort-item ${sortBy === opt.value ? 'active' : ''}`} onClick={() => { setSortBy(opt.value); setCurrentPage(1); setShowSortDropdown(false); }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="sl-divider"></div>

          {loading ? (
            <div className="sl-loader"><div className="loader-spinner"></div><p>Loading shops...</p></div>
          ) : error ? (
            <div className="sl-error"><p>{error}</p></div>
          ) : shops.length === 0 ? (
            <div className="sl-empty"><p>No shops found.</p></div>
          ) : (
            <>
              <div className="sl-list">
                {shops.map((shop) => (
                  <div key={shop.id} className="sl-card">
                    <Link to={shopUrl(shop.shop_code, shop.name)} className="sl-card-image">
                      {shop.image_url && !shop.image_url.includes('example.com') ? (
                        <img src={shop.image_url} alt={shop.name} />
                      ) : <span className="sl-card-emoji">🏪</span>}
                    </Link>
                    <div className="sl-card-body">
                      <div className="sl-card-top">
                        <Link to={shopUrl(shop.shop_code, shop.name)} className="sl-card-name">{shop.name}</Link>
                        <span className="sl-verified-badge">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          VERIFIED SELLER
                        </span>
                      </div>
                      {shop.owner_name && (
                        <p className="sl-card-subtitle">Master Artisan {shop.owner_name}</p>
                      )}

                      <div className="sl-card-meta">
                        <div className="sl-meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                          <div>
                            <span className="sl-meta-label">LOCATION</span>
                            <span className="sl-meta-value">{shop.address?.split(',').slice(0, 2).join(',')}</span>
                          </div>
                        </div>
                        <div className="sl-meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <div>
                            <span className="sl-meta-label">RESPONSE RATE</span>
                            <span className="sl-meta-value">95% within 2 hours</span>
                          </div>
                        </div>
                        <div className="sl-meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <div>
                            <span className="sl-meta-label">ESTABLISHED</span>
                            <span className="sl-meta-value">{memberYear(shop.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="sl-card-actions">
                        <button className="sl-contact-btn" onClick={() => { setInquiryShop(shop); setShowInquiry(true); }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                          Contact Supplier
                        </button>
                        {shop.owner_phone && (
                          <a href={`tel:${shop.owner_phone}`} className="sl-call-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            Call to Inquire
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination && pagination.total_pages > 1 && (
                <div className="sl-pagination">
                  <button className="sl-page-btn" disabled={!pagination.has_prev} onClick={() => setCurrentPage(p => p - 1)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  {getPageNumbers().map((page, i) =>
                    page === '...' ? <span key={`d${i}`} className="sl-page-dots">...</span> : (
                      <button key={page} className={`sl-page-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
                    )
                  )}
                  <button className="sl-page-btn" disabled={!pagination.has_next} onClick={() => setCurrentPage(p => p + 1)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <InquiryModal
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
        shopInfo={inquiryShop ? { id: inquiryShop.id, name: inquiryShop.name, image_url: inquiryShop.image_url, firstProductCode: null } : null}
      />
    </div>
  );
};

export default Shop;
