import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productUrl } from '../utils/slug';
import { API_BASE, cachedFetch } from '../utils/api';
import './Collections.css';

const formatPrice = (price) => {
  const num = parseFloat(price);
  return `₹${num.toLocaleString('en-IN')}`;
};

const sortOptions = [
  { value: '', label: 'Popularity' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

const Collections = () => {
  const { category } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const [availableFilters, setAvailableFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Filters state
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Dropdown visibility
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const close = () => setOpenDropdown(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  // Reset filters on category change
  useEffect(() => {
    setSelectedMaterial('');
    setSelectedSize('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setPage(1);
    setProducts([]);
    setHasMore(false);
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (page === 1) {
        setLoading(true);
        setProducts([]);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('page', page);
        if (selectedMaterial) params.set('material', selectedMaterial);
        if (selectedSize) params.set('size', selectedSize);
        if (minPrice) params.set('min_price', minPrice);
        if (maxPrice) params.set('max_price', maxPrice);
        if (sortBy) params.set('sort', sortBy);

        const url = `${API_BASE}/api/categories/${category}/products?${params}`;
        const json = await cachedFetch(url);
        if (json.success) {
          setCategoryData(json.data.category);
          const newProducts = json.data.products || [];
          if (page === 1) {
            setProducts(newProducts);
          } else {
            setProducts(prev => [...prev, ...newProducts]);
          }
          if (json.data.available_filters) {
            setAvailableFilters(json.data.available_filters);
          }
          // Check if more pages exist
          const total = json.data.total || 0;
          setHasMore(products.length + newProducts.length < total);
        } else {
          setError('Category not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchProducts();
  }, [category, page, selectedMaterial, selectedSize, minPrice, maxPrice, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedMaterial, selectedSize, minPrice, maxPrice, sortBy]);

  const hasActiveFilters = selectedMaterial || selectedSize || minPrice || maxPrice || sortBy;

  const clearAllFilters = () => {
    setSelectedMaterial('');
    setSelectedSize('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setPage(1);
  };

  const toggleDropdown = (name, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    setOpenDropdown(null);
  };

  if (loading && !categoryData) {
    return (
      <div className="col-loader">
        <div className="loader-spinner"></div>
        <p>Loading collection...</p>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="col-error">
        <p>{error || 'Category not found'}</p>
        <Link to="/" className="col-error-btn">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="collections-page">
      {/* Breadcrumb + Hero */}
      <section className="col-hero">
        <div className="col-hero-container">
          <div className="col-breadcrumb">
            <Link to="/" className="col-crumb">Home</Link>
            <span className="col-crumb-sep">›</span>
            <span className="col-crumb">Categories</span>
            <span className="col-crumb-sep">›</span>
            <span className="col-crumb col-crumb-active">{categoryData.name}</span>
          </div>
          <h1 className="col-heading">
            {categoryData.name} <span className="col-heading-highlight">Collection</span>
          </h1>
          <p className="col-subtitle">
            {categoryData.description || `Handcrafted ${categoryData.name} idols for your home and temple by master artisans.`}
          </p>
        </div>
      </section>

      {/* Filters + Sort */}
      <section className="col-filters-section">
        <div className="col-filters-container">
          <div className="col-filters-left">
            {/* Material Filter */}
            <div className="col-dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
              <button
                className={`col-filter-btn ${selectedMaterial ? 'col-filter-active' : ''}`}
                onClick={(e) => toggleDropdown('material', e)}
              >
                {selectedMaterial || 'Material'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {openDropdown === 'material' && availableFilters?.materials && (
                <div className="col-dropdown">
                  <button
                    className={`col-dropdown-item ${!selectedMaterial ? 'active' : ''}`}
                    onClick={() => { setSelectedMaterial(''); setOpenDropdown(null); }}
                  >All Materials</button>
                  {availableFilters.materials.map((mat) => (
                    <button
                      key={mat}
                      className={`col-dropdown-item ${selectedMaterial === mat ? 'active' : ''}`}
                      onClick={() => { setSelectedMaterial(mat); setOpenDropdown(null); }}
                    >{mat}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="col-dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
              <button
                className={`col-filter-btn ${selectedSize ? 'col-filter-active' : ''}`}
                onClick={(e) => toggleDropdown('size', e)}
              >
                {selectedSize || 'Size'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {openDropdown === 'size' && availableFilters?.sizes && (
                <div className="col-dropdown">
                  <button
                    className={`col-dropdown-item ${!selectedSize ? 'active' : ''}`}
                    onClick={() => { setSelectedSize(''); setOpenDropdown(null); }}
                  >All Sizes</button>
                  {availableFilters.sizes.map((size) => (
                    <button
                      key={size}
                      className={`col-dropdown-item ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => { setSelectedSize(size); setOpenDropdown(null); }}
                    >{size}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="col-dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
              <button
                className={`col-filter-btn ${minPrice || maxPrice ? 'col-filter-active' : ''}`}
                onClick={(e) => toggleDropdown('price', e)}
              >
                {minPrice || maxPrice ? `₹${minPrice || '0'} - ₹${maxPrice || '∞'}` : 'Price Range'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {openDropdown === 'price' && (
                <div className="col-dropdown col-price-dropdown">
                  {availableFilters?.price_range && (
                    <p className="col-price-range-hint">
                      Range: ₹{parseFloat(availableFilters.price_range.min).toLocaleString('en-IN')} — ₹{parseFloat(availableFilters.price_range.max).toLocaleString('en-IN')}
                    </p>
                  )}
                  <form className="col-price-form" onSubmit={handlePriceApply}>
                    <input
                      type="number"
                      placeholder="Min"
                      className="col-price-input"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="col-price-sep">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="col-price-input"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <button type="submit" className="col-price-apply">Apply</button>
                  </form>
                  {(minPrice || maxPrice) && (
                    <button className="col-price-clear" onClick={() => { setMinPrice(''); setMaxPrice(''); setOpenDropdown(null); }}>Clear price</button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="col-filters-right">
            <span className="col-sort-label">Sort by:</span>
            <div className="col-dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
              <button className="col-sort-btn" onClick={(e) => toggleDropdown('sort', e)}>
                {sortOptions.find(s => s.value === sortBy)?.label || 'Popularity'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="16" y2="12" />
                  <line x1="4" y1="18" x2="12" y2="18" />
                </svg>
              </button>
              {openDropdown === 'sort' && (
                <div className="col-dropdown col-dropdown-right">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      className={`col-dropdown-item ${sortBy === opt.value ? 'active' : ''}`}
                      onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                    >{opt.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Active Filters */}
      {hasActiveFilters && (
        <section className="col-active-filters">
          <div className="col-active-container">
            {selectedMaterial && (
              <span className="col-active-tag">
                {selectedMaterial}
                <button onClick={() => setSelectedMaterial('')}>✕</button>
              </span>
            )}
            {selectedSize && (
              <span className="col-active-tag">
                {selectedSize}
                <button onClick={() => setSelectedSize('')}>✕</button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="col-active-tag">
                ₹{minPrice || '0'} - ₹{maxPrice || '∞'}
                <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}>✕</button>
              </span>
            )}
            {sortBy && (
              <span className="col-active-tag">
                {sortOptions.find(s => s.value === sortBy)?.label}
                <button onClick={() => setSortBy('')}>✕</button>
              </span>
            )}
            <button className="col-clear-all" onClick={clearAllFilters}>Clear all</button>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="col-products-section">
        <div className="col-products-container">
          {loading ? (
            <div className="col-loading-overlay">
              <div className="loader-spinner"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="col-empty">
              <p>No products found{hasActiveFilters ? ' with these filters' : ' in this category yet'}.</p>
              {hasActiveFilters && (
                <button className="col-empty-clear" onClick={clearAllFilters}>Clear Filters</button>
              )}
            </div>
          ) : (
            <div className="col-products-grid">
              {products.map((product) => (
                <div key={product.id} className="col-product-card">
                  <Link to={productUrl(product.product_code, product.name)} className="col-product-image">
                    {product.image_url && !product.image_url.includes('example.com') ? (
                      <img src={product.image_url} alt={product.name} className="col-product-img" />
                    ) : (
                      <span className="col-product-emoji">🕉️</span>
                    )}
                    <button className="col-wishlist-btn" onClick={(e) => e.preventDefault()} aria-label="Wishlist">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </Link>
                  <div className="col-product-body">
                    <div className="col-product-meta">
                      {product.material && (
                        <span className="col-product-tag">{product.material}</span>
                      )}
                    </div>
                    <Link to={productUrl(product.product_code, product.name)} className="col-product-name-link">
                      <h3 className="col-product-name">{product.name}</h3>
                    </Link>
                    {product.shop_name && (
                      <span className="col-product-artisan">{product.shop_name}</span>
                    )}
                    <div className="col-product-bottom">
                      <span className="col-product-price">{formatPrice(product.price)}</span>
                      {product.shop_phone ? (
                        <a href={`tel:${product.shop_phone}`} className="col-inquire-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          CALL
                        </a>
                      ) : (
                        <Link to={productUrl(product.product_code, product.name)} className="col-inquire-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          CALL
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show More */}
          {hasMore && (
            <div className="col-show-more">
              <button
                className="col-show-more-btn"
                onClick={() => setPage(p => p + 1)}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <div className="loader-spinner" style={{ width: 18, height: 18 }}></div>
                    Loading...
                  </>
                ) : (
                  'Show More Products'
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collections;
