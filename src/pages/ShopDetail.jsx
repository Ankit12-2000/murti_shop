import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productUrl } from '../utils/slug';
import { API_BASE, cachedFetch } from '../utils/api';
import InquiryModal from '../components/InquiryModal';
import './ShopDetail.css';

const formatPrice = (price) => {
  const num = parseFloat(price);
  return `₹${num.toLocaleString('en-IN')}`;
};

const ShopDetail = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All Collection');
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const productsRef = useRef(null);
  const workshopRef = useRef(null);

  useEffect(() => {
    const fetchShop = async () => {
      setError(null);
      try {
        const json = await cachedFetch(`${API_BASE}/api/shops/${shopId}`);
        if (json.success) {
          setShop(json.data.shop);
          setProducts(json.data.products || []);
        } else {
          setError('Shop not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopId]);

  if (loading) return <div className="sd-loader"><div className="loader-spinner"></div><p>Loading shop...</p></div>;
  if (error || !shop) return <div className="sd-error"><p>{error || 'Shop not found'}</p><Link to="/shop" className="sd-error-btn">Back to Shops</Link></div>;

  const categories = ['All Collection', ...new Set(products.map(p => p.category_name).filter(Boolean))];
  const filteredProducts = activeCategory === 'All Collection'
    ? products
    : products.filter(p => p.category_name === activeCategory);

  const memberSince = new Date(shop.created_at);
  const yearsInBusiness = new Date().getFullYear() - memberSince.getFullYear();

  return (
    <div className="sd-page">
      {/* Hero Banner */}
      <section className="sd-hero">
        <div className="sd-hero-bg"></div>
        <div className="sd-hero-inner">
          <div className="sd-hero-profile">
            <div className="sd-avatar">
              {shop.image_url && !shop.image_url.includes('example.com') ? (
                <img src={shop.image_url} alt={shop.name} />
              ) : <span>🏪</span>}
            </div>
            <div className="sd-hero-info">
              <div className="sd-hero-name-row">
                <h1 className="sd-hero-name">{shop.name}</h1>
                <span className="sd-badge-green">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Verified Seller
                </span>
                {shop.is_top === 1 && (
                  <span className="sd-badge-blue">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    GST Verified
                  </span>
                )}
              </div>
              {shop.owner_name && (
                <p className="sd-hero-owner">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Master Artisan {shop.owner_name} · Established {memberSince.getFullYear()}
                </p>
              )}
              <div className="sd-hero-meta">
                <span className="sd-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                  {shop.address}
                </span>
                <span className="sd-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {yearsInBusiness} Years in Business
                </span>
              </div>
            </div>
          </div>
          <div className="sd-hero-actions">
            {shop.owner_phone && (
              <a href={`tel:${shop.owner_phone}`} className="sd-call-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Call to Inquire
              </a>
            )}
            <button className="sd-msg-btn" onClick={() => { setInquiryProduct(null); setShowInquiry(true); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Business Stats */}
      <section className="sd-stats">
        <div className="sd-stats-inner">
          <div className="sd-stat">
            <span className="sd-stat-label">RESPONSE RATE</span>
            <span className="sd-stat-value">98% within 2 hours</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-label">PAYMENT METHODS</span>
            <span className="sd-stat-value">UPI, Bank Transfer, Card</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat-label">NATURE OF BUSINESS</span>
            <span className="sd-stat-value">Manufacturer & Exporter</span>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sd-cat-section">
        <div className="sd-cat-inner">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`sd-cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All Collection' ? 'All Collection' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <div ref={productsRef}></div>
      <section className="sd-products">
        <div className="sd-products-inner">
          {filteredProducts.length === 0 ? (
            <div className="sd-empty"><p>No products found in this category.</p></div>
          ) : (
            <div className="sd-products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="sd-pcard">
                  <Link to={productUrl(product.product_code, product.name)} className="sd-pcard-image">
                    {product.image_url && !product.image_url.includes('example.com') ? (
                      <img src={product.image_url} alt={product.name} className="sd-pcard-img" />
                    ) : <span className="sd-pcard-emoji">🕉️</span>}
                    {product.is_featured === 1 && <span className="sd-pcard-badge">BEST SELLER</span>}
                  </Link>
                  <div className="sd-pcard-body">
                    <Link to={productUrl(product.product_code, product.name)} className="sd-pcard-name">{product.name}</Link>
                    <div className="sd-pcard-price-row">
                      <span className="sd-pcard-price">{formatPrice(product.price)}</span>
                      <span className="sd-pcard-unit">/ Piece</span>
                    </div>
                    {/* Specs Table */}
                    <div className="sd-pcard-specs">
                      {product.material && (
                        <div className="sd-pcard-spec">
                          <span>Material</span>
                          <span>{product.material}</span>
                        </div>
                      )}
                      {product.size && (
                        <div className="sd-pcard-spec">
                          <span>Size</span>
                          <span>{product.size}</span>
                        </div>
                      )}
                      {product.category_name && (
                        <div className="sd-pcard-spec">
                          <span>Category</span>
                          <span>{product.category_name}</span>
                        </div>
                      )}
                    </div>
                    <button className="sd-pcard-contact" onClick={() => { setInquiryProduct(product); setShowInquiry(true); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Contact Supplier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Visit Workshop */}
      <div ref={workshopRef}></div>
      <section className="sd-workshop">
        <div className="sd-workshop-inner">
          <h2 className="sd-workshop-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            Visit our Workshop
          </h2>
          <div className="sd-workshop-grid">
            <div className="sd-workshop-info">
              <h3 className="sd-workshop-name">{shop.name}</h3>
              <p className="sd-workshop-addr">{shop.address}<br/>India</p>
              {shop.owner_phone && (
                <div className="sd-workshop-contacts">
                  <p className="sd-workshop-contact">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Open: Mon - Sat (9:00 AM - 8:00 PM)
                  </p>
                  <p className="sd-workshop-contact">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {shop.owner_phone}
                  </p>
                </div>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sd-workshop-directions"
              >
                Get Directions on Google Maps
              </a>
            </div>
            <div className="sd-workshop-map">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(shop.address)}&z=14&output=embed`}
                className="sd-workshop-iframe"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${shop.name} Location`}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <InquiryModal
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
        product={inquiryProduct}
        productId={inquiryProduct?.product_code}
        shopInfo={!inquiryProduct ? { id: shop.id, name: shop.name, image_url: shop.image_url, firstProductCode: products.length > 0 ? products[0].product_code : null } : null}
      />
    </div>
  );
};

export default ShopDetail;
