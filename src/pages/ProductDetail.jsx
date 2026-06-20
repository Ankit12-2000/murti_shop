import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { shopUrl, productUrl, toSlug, categoryUrl } from '../utils/slug';
import InquiryModal from '../components/InquiryModal';
import { API_BASE, cachedFetch } from '../utils/api';
import './ProductDetail.css';

const formatPrice = (price) => {
  const num = parseFloat(price);
  return `₹${num.toLocaleString('en-IN')}`;
};

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    if (product && !showInquiry) {
      const timer = setTimeout(() => {
        const dismissed = sessionStorage.getItem(`inquiry_dismissed_${productId}`);
        if (!dismissed) setShowInquiry(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [product, productId]);

  useEffect(() => {
    setError(null);
    setActiveThumb(0);
    const fetchProduct = async () => {
      try {
        const json = await cachedFetch(`${API_BASE}/api/product/${productId}`);
        if (json.success) setProduct(json.data);
        else setError('Product not found');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return (
    <div className="pd-page">
      {/* Top Section Skeleton */}
      <section className="pd-top">
        <div className="pd-top-inner pd-no-thumbs">
          {/* Main Image */}
          <div className="pd-skeleton-main-img pd-shimmer" />
          {/* Thumbnails row */}
          <div className="pd-thumbs-col" style={{order:2}}>
            {[0,1,2,3].map(i => <div key={i} className="pd-thumb pd-shimmer" />)}
          </div>
          {/* Info */}
          <div className="pd-info">
            <div className="pd-skeleton-breadcrumb pd-shimmer" />
            <div className="pd-skeleton-title pd-shimmer" />
            <div className="pd-skeleton-title pd-skeleton-title-sm pd-shimmer" />
            <div className="pd-skeleton-badges">
              <span className="pd-skeleton-badge pd-shimmer" />
              <span className="pd-skeleton-badge pd-shimmer" />
            </div>
            <div className="pd-skeleton-price pd-shimmer" />
            <div className="pd-skeleton-specs">
              <div className="pd-skeleton-spec pd-shimmer" />
              <div className="pd-skeleton-spec pd-shimmer" />
              <div className="pd-skeleton-spec pd-shimmer" />
              <div className="pd-skeleton-spec pd-shimmer" />
            </div>
            <div className="pd-skeleton-btn pd-shimmer" />
            <div className="pd-skeleton-btn pd-skeleton-btn-outline pd-shimmer" />
            <div className="pd-skeleton-artisan pd-shimmer" />
          </div>
        </div>
      </section>

      {/* Highlights Skeleton */}
      <section className="pd-highlights">
        <div className="pd-highlights-inner">
          {[0,1,2,3].map(i => (
            <div key={i} className="pd-highlight-item">
              <div className="pd-shimmer" style={{width:20,height:20,borderRadius:'50%',flexShrink:0}} />
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
                <div className="pd-shimmer" style={{width:'70%',height:12}} />
                <div className="pd-shimmer" style={{width:'90%',height:10}} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section Skeleton */}
      <section className="pd-story-section">
        <div className="pd-story-inner">
          <div className="pd-story-left" style={{display:'flex',flexDirection:'column',gap:14}}>
            <div className="pd-skeleton-line pd-shimmer" style={{width:200,height:24}} />
            <div className="pd-skeleton-line pd-shimmer" style={{width:'100%',height:16}} />
            <div className="pd-skeleton-line pd-shimmer" style={{width:'90%',height:16}} />
            <div className="pd-skeleton-line pd-shimmer" style={{width:'75%',height:16}} />
            <div className="pd-skeleton-line pd-shimmer" style={{width:'60%',height:16}} />
            <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:10}}>
              <div className="pd-skeleton-line pd-shimmer" style={{width:160,height:20}} />
              <div className="pd-skeleton-line pd-shimmer" style={{width:'80%',height:14}} />
              <div className="pd-skeleton-line pd-shimmer" style={{width:'70%',height:14}} />
              <div className="pd-skeleton-line pd-shimmer" style={{width:'65%',height:14}} />
            </div>
          </div>
          <div className="pd-story-right">
            <div className="pd-skeleton-market pd-shimmer" />
          </div>
        </div>
      </section>

      {/* Shop Banner Skeleton */}
      <section className="pd-shop-banner">
        <div className="pd-shop-banner-inner">
          <div className="pd-shop-banner-left">
            <div className="pd-shop-banner-avatar pd-shimmer" />
            <div style={{display:'flex',flexDirection:'column',gap:6,flex:1}}>
              <div className="pd-shimmer" style={{width:60,height:10}} />
              <div className="pd-shimmer" style={{width:'80%',height:18}} />
              <div className="pd-shimmer" style={{width:'50%',height:12}} />
            </div>
          </div>
          <div className="pd-shop-banner-stats">
            {[0,1,2,3].map(i => (
              <div key={i} className="pd-shop-banner-stat">
                <div className="pd-shimmer" style={{width:16,height:16,borderRadius:'50%',flexShrink:0}} />
                <div style={{display:'flex',flexDirection:'column',gap:4,flex:1}}>
                  <div className="pd-shimmer" style={{width:50,height:9}} />
                  <div className="pd-shimmer" style={{width:'80%',height:13}} />
                </div>
              </div>
            ))}
          </div>
          <div className="pd-shop-banner-actions">
            <div className="pd-shimmer" style={{height:40,borderRadius:8}} />
            <div className="pd-shimmer" style={{height:40,borderRadius:8}} />
          </div>
        </div>
      </section>

      {/* Similar Products Skeleton */}
      <section className="pd-related-section">
        <div className="pd-related-inner">
          <div className="pd-related-header">
            <div>
              <div className="pd-skeleton-line pd-shimmer" style={{width:220,height:26}} />
              <div className="pd-skeleton-line pd-shimmer" style={{width:280,height:14,marginTop:8,maxWidth:'100%'}} />
            </div>
          </div>
          <div className="pd-related-grid">
            {[0,1,2,3].map(i => (
              <div key={i} className="pd-skeleton-related-card">
                <div className="pd-skeleton-related-img pd-shimmer" />
                <div className="pd-skeleton-line pd-shimmer" style={{width:'75%',height:14,marginTop:10}} />
                <div className="pd-skeleton-line pd-shimmer" style={{width:'45%',height:12,marginTop:6}} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
  if (error || !product) return <div className="pd-error"><p>{error || 'Product not found'}</p><Link to="/" className="pd-error-btn">Go Home</Link></div>;

  const images = product.images?.length > 0
    ? product.images.sort((a, b) => a.sort_order - b.sort_order)
    : [{ id: 0, image_url: product.image_url }];
  const currentImage = images[activeThumb]?.image_url || product.image_url;

  const careList = product.care_instructions
    ? product.care_instructions.split('. ').filter(Boolean).map(s => s.endsWith('.') ? s : s + '.')
    : [];

  const storyText = product.craftsmanship_story || '';

  const openImageZoom = () => {
    navigate(`/product/${productId}/${product ? toSlug(product.name) : ''}/images?img=${activeThumb}`);
  };

  return (
    <div className="pd-page">
      {/* Top Section */}
      <section className="pd-top">
        <div className={`pd-top-inner ${images.length <= 1 ? 'pd-no-thumbs' : ''}`}>
          {/* Left - Thumbnails */}
          {images.length > 1 && (
            <div className="pd-thumbs-col">
              {images.map((img, i) => (
                <button key={img.id} className={`pd-thumb ${activeThumb === i ? 'active' : ''}`} onClick={() => setActiveThumb(i)}>
                  <img src={img.image_url} alt="" className="pd-thumb-img" onError={(e) => { e.target.style.display = 'none'; }} />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="pd-main-image" onClick={openImageZoom}>
            {currentImage && !currentImage.includes('example.com') ? (
              <img src={currentImage} alt={product.name} className="pd-main-img" />
            ) : (
              <span style={{ fontSize: '80px' }}>🕉️</span>
            )}
            <div className="pd-image-badge">
              <span className="pd-auth-label">AUTHENTICITY RANK</span>
              <span className="pd-auth-value">A+ Certified Grade</span>
            </div>
            <button className="pd-zoom-btn" aria-label="Fullscreen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </button>
          </div>

          {/* Right - Info */}
          <div className="pd-info">
            <div className="pd-breadcrumb">
              <Link to="/" className="pd-crumb">HERITAGE</Link>
              <span className="pd-crumb-sep">/</span>
              <span className="pd-crumb">STATUES</span>
              {product.category && (
                <>
                  <span className="pd-crumb-sep">/</span>
                  <Link to={categoryUrl(product.category.name)} className="pd-crumb pd-crumb-active">{product.category.name.toUpperCase()} SELECTION</Link>
                </>
              )}
            </div>

            <h1 className="pd-name">{product.name}</h1>

            {/* Trust Badges */}
            <div className="pd-badges">
              <span className="pd-badge pd-badge-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Verified Seller
              </span>
              <span className="pd-badge pd-badge-blue">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                GST Verified
              </span>
            </div>

            <p className="pd-price">{formatPrice(product.price)}</p>
            <p className="pd-price-note">Excl. Shipping & International Crating</p>

            {/* Specs Grid */}
            <div className="pd-specs-grid">
              {product.material && (
                <div className="pd-spec-box">
                  <span className="pd-spec-label">MATERIAL</span>
                  <span className="pd-spec-value">{product.material}</span>
                </div>
              )}
              {product.size && (
                <div className="pd-spec-box">
                  <span className="pd-spec-label">HEIGHT</span>
                  <span className="pd-spec-value">{product.size}</span>
                </div>
              )}
              <div className="pd-spec-box">
                <span className="pd-spec-label">WEIGHT</span>
                <span className="pd-spec-value">Approx</span>
              </div>
              <div className="pd-spec-box">
                <span className="pd-spec-label">ORIGIN</span>
                <span className="pd-spec-value">{product.shop?.address || 'India'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pd-actions">
              {product.shop?.owner_phone && (
                <a href={`tel:${product.shop.owner_phone}`} className="pd-call-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Call to Inquire
                </a>
              )}
              <button className="pd-msg-btn" onClick={() => setShowInquiry(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Message Shop
              </button>
            </div>

            {/* Artisan Card - Enhanced */}
            {product.shop && (
              <div className="pd-artisan">
                <div className="pd-artisan-top">
                  <div className="pd-artisan-avatar">
                    {product.shop.image ? (
                      <img src={product.shop.image} alt={product.shop.name} />
                    ) : <span className="pd-artisan-avatar-letter">{product.shop.name?.charAt(0) || 'S'}</span>}
                  </div>
                  <div className="pd-artisan-info">
                    <h4 className="pd-artisan-name">{product.shop.name}</h4>
                    {product.shop.owner_name && <p className="pd-artisan-role">Master Craftsman: {product.shop.owner_name}</p>}
                    <p className="pd-artisan-loc">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                      {product.shop.address}
                    </p>
                  </div>
                </div>
                <div className="pd-artisan-stats">
                  <div className="pd-artisan-stat">
                    <span className="pd-artisan-stat-val">
                      {product.shop.created_at ? `${Math.max(1, new Date().getFullYear() - new Date(product.shop.created_at).getFullYear())}+ Yrs` : 'Expert'}
                    </span>
                    <span className="pd-artisan-stat-lbl">Experience</span>
                  </div>
                  <div className="pd-artisan-stat-divider" />
                  <div className="pd-artisan-stat">
                    <span className="pd-artisan-stat-val">
                      {product.shop.is_top ? 'Verified' : 'Registered'}
                    </span>
                    <span className="pd-artisan-stat-lbl">GST Status</span>
                  </div>
                  <div className="pd-artisan-stat-divider" />
                  <div className="pd-artisan-stat">
                    <span className="pd-artisan-stat-val">A+</span>
                    <span className="pd-artisan-stat-lbl">Trust Grade</span>
                  </div>
                </div>
                <div className="pd-artisan-bottom">
                  {product.shop.owner_phone && (
                    <a href={`tel:${product.shop.owner_phone}`} className="pd-artisan-phone">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Call Shop
                    </a>
                  )}
                  <Link to={shopUrl(product.shop?.shop_code || '', product.shop.name)} className="pd-visit-shop">Visit Shop</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Highlights Strip */}
      <section className="pd-highlights">
        <div className="pd-highlights-inner">
          <div className="pd-highlight-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <span className="pd-highlight-title">Authentic Craft</span>
              <span className="pd-highlight-sub">Handmade by master artisans</span>
            </div>
          </div>
          <div className="pd-highlight-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4"/></svg>
            <div>
              <span className="pd-highlight-title">Secure Packaging</span>
              <span className="pd-highlight-sub">Premium crating for safe delivery</span>
            </div>
          </div>
          <div className="pd-highlight-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div>
              <span className="pd-highlight-title">Quality Assured</span>
              <span className="pd-highlight-sub">Inspected before dispatch</span>
            </div>
          </div>
          <div className="pd-highlight-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <div>
              <span className="pd-highlight-title">Made in India</span>
              <span className="pd-highlight-sub">{product.shop?.address || 'Traditional Indian craft'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story + Market Interest */}
      {(storyText || careList.length > 0 || product.description) && (
        <section className="pd-story-section">
          <div className="pd-story-inner">
            <div className="pd-story-left">
              <h2 className="pd-story-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#92400E" stroke="none"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 7h8M8 11h5" stroke="white" strokeWidth="2"/></svg>
                Craftsmanship & Story
              </h2>
              {storyText && <p className="pd-story-quote">"{storyText}"</p>}
              {product.description && <p className="pd-story-desc">{product.description}</p>}

              {careList.length > 0 && (
                <div className="pd-care-box">
                  <h3 className="pd-care-title">Care Instructions</h3>
                  <ul className="pd-care-list">
                    {careList.map((item, i) => (
                      <li key={i}>
                        <span className="pd-care-dot"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pd-story-right">
              <div className="pd-market-card">
                <div className="pd-market-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>MARKET INTEREST</span>
                </div>
                <div className="pd-market-avatars">
                  <div className="pd-market-avatar-stack">
                    <span className="pd-market-av">AK</span>
                    <span className="pd-market-av pd-market-av-2">RV</span>
                    <span className="pd-market-av pd-market-av-3">+9</span>
                  </div>
                  <span className="pd-market-count">12 Recently Inquired</span>
                </div>
                <div className="pd-market-last">
                  <span className="pd-market-last-label">Last inquiry from</span>
                  <span className="pd-market-last-city">India</span>
                  <span className="pd-market-last-time">2 HOURS AGO</span>
                </div>
                <div className="pd-market-demand">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/></svg>
                  High Demand Item
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Full Shop Banner */}
      {product.shop && (
        <section className="pd-shop-banner">
          <div className="pd-shop-banner-inner">
            <div className="pd-shop-banner-left">
              <div className="pd-shop-banner-avatar">
                {product.shop.image ? (
                  <img src={product.shop.image} alt={product.shop.name} />
                ) : <span className="pd-shop-banner-letter">{product.shop.name?.charAt(0) || 'S'}</span>}
              </div>
              <div className="pd-shop-banner-info">
                <span className="pd-shop-banner-label">SOLD BY</span>
                <h3 className="pd-shop-banner-name">{product.shop.name}</h3>
                {product.shop.owner_name && <p className="pd-shop-banner-owner">Owner: {product.shop.owner_name}</p>}
              </div>
            </div>
            <div className="pd-shop-banner-stats">
              <div className="pd-shop-banner-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <span className="pd-shop-stat-label">Location</span>
                  <span className="pd-shop-stat-value">{product.shop.address || 'India'}</span>
                </div>
              </div>
              {product.shop.owner_phone && (
                <div className="pd-shop-banner-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <div>
                    <span className="pd-shop-stat-label">Contact</span>
                    <a href={`tel:${product.shop.owner_phone}`} className="pd-shop-stat-value pd-shop-stat-link">{product.shop.owner_phone}</a>
                  </div>
                </div>
              )}
              <div className="pd-shop-banner-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <div>
                  <span className="pd-shop-stat-label">Verification</span>
                  <span className="pd-shop-stat-value">{product.shop.is_top ? 'GST Verified Seller' : 'Registered Seller'}</span>
                </div>
              </div>
              {product.shop.created_at && (
                <div className="pd-shop-banner-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div>
                    <span className="pd-shop-stat-label">Established</span>
                    <span className="pd-shop-stat-value">Since {new Date(product.shop.created_at).getFullYear()}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="pd-shop-banner-actions">
              <Link to={shopUrl(product.shop?.shop_code || '', product.shop.name)} className="pd-shop-banner-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Visit Full Shop
              </Link>
              <button className="pd-shop-banner-btn pd-shop-banner-btn-outline" onClick={() => setShowInquiry(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Send Inquiry
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Similar Masterpieces */}
      {product.related_products?.length > 0 && (
        <section className="pd-related-section">
          <div className="pd-related-inner">
            <div className="pd-related-header">
              <div>
                <h2 className="pd-related-title">Similar Masterpieces</h2>
                <p className="pd-related-subtitle">Exquisite hand-carved selections from the artisans.</p>
              </div>
              {product.shop && (
                <Link to={shopUrl(product.shop?.shop_code || '', product.shop.name)} className="pd-view-all">View Collection</Link>
              )}
            </div>
            <div className="pd-related-grid">
              {product.related_products.map((item) => (
                <Link to={productUrl(item.product_code, item.name)} key={item.id} className="pd-related-card">
                  <div className="pd-related-image">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="pd-related-img" />
                    ) : <span className="pd-related-emoji">🕉️</span>}
                  </div>
                  <h4 className="pd-related-name">{item.name}</h4>
                  <p className="pd-related-price">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <InquiryModal
        isOpen={showInquiry}
        onClose={() => { setShowInquiry(false); sessionStorage.setItem(`inquiry_dismissed_${productId}`, '1'); }}
        product={product}
        productId={product?.product_code}
      />
    </div>
  );
};

export default ProductDetail;
