import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productUrl } from '../utils/slug';
import { API_BASE, cachedFetch } from '../utils/api';
import './ArtisansChoice.css';

const formatPrice = (price) => {
  const num = parseFloat(price);
  return `₹${num.toLocaleString('en-IN')}`;
};

const ArtisansChoice = ({ fallbackProducts = [] }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      try {
        const json = await cachedFetch(`${API_BASE}/api/product/artisan-choice?page=${page}&limit=20`);
        if (json.success && json.data && json.data.length > 0) {
          const newProducts = json.data;
          if (page === 1) setProducts(newProducts);
          else setProducts(prev => [...prev, ...newProducts]);
          setHasMore(json.pagination?.has_next || false);
        } else if (page === 1) {
          setApiFailed(true);
        }
      } catch {
        if (page === 1) setApiFailed(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchProducts();
  }, [page]);

  const displayProducts = apiFailed && products.length === 0 ? fallbackProducts : products;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="choice-section">
        <div className="choice-container">
          <h2 className="choice-title">The Artisan's Choice</h2>
          <p className="choice-subtitle">Premium handcrafted masterpieces for the discerning collector</p>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="loader-spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) return null;

  return (
    <section className="choice-section">
      <div className="choice-container">
        <h2 className="choice-title">The Artisan's Choice</h2>
        <p className="choice-subtitle">Premium handcrafted masterpieces for the discerning collector</p>

        <div className="choice-scroll-wrapper">
          <div className="choice-scroll-header">
            <button className="choice-arrow" onClick={() => scroll('left')} aria-label="Scroll left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="choice-arrow" onClick={() => scroll('right')} aria-label="Scroll right">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          <div className="choice-grid" ref={scrollRef}>
            {displayProducts.map((product, index) => (
              <Link to={productUrl(product.product_code, product.name)} key={product.product_code || index} className="choice-card">
                <div className="choice-card-image">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="choice-card-img" />
                  ) : (
                    <span className="choice-card-emoji">🕉️</span>
                  )}
                </div>
                <div className="choice-card-body">
                  <span className="choice-card-category">{product.category_name}</span>
                  <h3 className="choice-card-name">{product.name}</h3>
                  <p className="choice-card-shop">{product.shop_name}</p>
                  <div className="choice-card-divider"></div>
                  <div className="choice-card-footer">
                    <span className="choice-card-price">{formatPrice(product.price)}</span>
                    {product.material && <span className="choice-card-material">{product.material}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {hasMore && !apiFailed && (
          <div className="choice-show-more">
            <button
              className="choice-show-more-btn"
              onClick={() => setPage(p => p + 1)}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <div className="loader-spinner" style={{ width: 18, height: 18 }}></div>
                  Loading...
                </>
              ) : (
                'Show More'
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtisansChoice;
