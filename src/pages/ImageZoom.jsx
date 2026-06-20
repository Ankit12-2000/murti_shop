import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE, cachedFetch } from '../utils/api';
import InquiryModal from '../components/InquiryModal';
import './ImageZoom.css';

const ImageZoom = () => {
  const { productId, productSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialIndex = parseInt(searchParams.get('img') || '0', 10);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const json = await cachedFetch(`${API_BASE}/api/product/${productId}`);
        if (json.success) {
          setProduct(json.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        navigate(`/product/${productId}/${productSlug || ''}`);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveIndex((prev) => (prev + 1) % images.length);
        setZoomed(false);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
        setZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  if (loading) {
    return (
      <div className="iz-page iz-loading">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (!product) {
    navigate(`/product/${productId}/${productSlug || ''}`);
    return null;
  }

  const images = product.images && product.images.length > 0
    ? product.images.sort((a, b) => a.sort_order - b.sort_order)
    : [{ id: 0, image_url: product.image_url }];

  const currentImage = images[activeIndex]?.image_url || product.image_url;

  const handleImageClick = () => {
    setZoomed(!zoomed);
  };

  const handleMouseMove = (e) => {
    if (!zoomed || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const goBack = () => {
    navigate(`/product/${productId}/${productSlug || ''}`);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomed(false);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    setZoomed(false);
  };

  return (
    <div className="iz-page">
      {/* Top Bar */}
      <div className="iz-topbar">
        <button className="iz-back-btn" onClick={goBack}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <span className="iz-counter">{activeIndex + 1} / {images.length}</span>
        <button className="iz-close-btn" onClick={goBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Main Image Area */}
      <div className="iz-main">
        {/* Left Arrow */}
        {images.length > 1 && (
          <button className="iz-arrow iz-arrow-left" onClick={goPrev}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}

        {/* Image */}
        <div
          className={`iz-image-container ${zoomed ? 'zoomed' : ''}`}
          ref={imageContainerRef}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { if (zoomed) setZoomed(false); }}
        >
          <img
            src={currentImage}
            alt={product.name}
            className="iz-image"
            style={zoomed ? {
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transform: 'scale(2.5)',
            } : {}}
            draggable={false}
          />
        </div>

        {/* Right Arrow */}
        {images.length > 1 && (
          <button className="iz-arrow iz-arrow-right" onClick={goNext}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Thumbnails */}
      {images.length > 1 && (
        <div className="iz-thumbs">
          {images.map((img, i) => (
            <button
              key={img.id}
              className={`iz-thumb ${activeIndex === i ? 'active' : ''}`}
              onClick={() => { setActiveIndex(i); setZoomed(false); }}
            >
              <img src={img.image_url} alt="" className="iz-thumb-img" />
            </button>
          ))}
        </div>
      )}

      {/* Right Panel - Product Info */}
      <div className="iz-product-panel">
        <h3 className="iz-product-name">{product.name}</h3>
        <p className="iz-product-price">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
        {product.shop?.owner_phone && (
          <a href={`tel:${product.shop.owner_phone}`} className="iz-call-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Call to Inquire
          </a>
        )}
        <button className="iz-inquiry-btn" onClick={() => setShowInquiry(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Send Inquiry
        </button>
      </div>

      {/* Zoom hint */}
      <div className="iz-hint">
        {zoomed ? 'Move mouse to pan · Click to zoom out' : 'Click image to zoom in · Use arrow keys to navigate'}
      </div>

      <InquiryModal
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
        product={product}
        productId={product?.id}
      />
    </div>
  );
};

export default ImageZoom;
