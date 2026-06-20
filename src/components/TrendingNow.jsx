import { Link } from 'react-router-dom';
import { productUrl } from '../utils/slug';
import './TrendingNow.css';

const formatPrice = (price) => {
  const num = parseFloat(price);
  return `₹${num.toLocaleString('en-IN')}`;
};

const badges = ['VERIFIED SELLER', 'BESTSELLER', 'GST VERIFIED', 'NEW ARRIVAL'];
const badgeColors = ['#1E3A5F', '#92400E', '#065F46', '#B91C1C'];

const TrendingNow = ({ products = [] }) => {
  const displayProducts = products.slice(0, 20);

  if (displayProducts.length === 0) return null;

  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="featured-header">
          <div>
            <h2 className="featured-title">Featured Masterpieces</h2>
            <p className="featured-subtitle">Direct from the finest artisan clusters across Bharat.</p>
          </div>
          <Link to="/shop" className="featured-view-all">View All Catalog →</Link>
        </div>

        <div className="featured-grid">
          {displayProducts.map((product, idx) => {
            const badgeIdx = idx % badges.length;
            return (
              <div key={product.id} className="featured-card">
                <Link to={productUrl(product.product_code, product.name)} className="featured-card-image">
                  {/* Badge */}
                  <span className="featured-badge" style={{ background: badgeColors[badgeIdx] }}>
                    {product.is_featured ? 'FEATURED' : badges[badgeIdx]}
                  </span>

                  {product.image_url && !product.image_url.includes('example.com') ? (
                    <img src={product.image_url} alt={product.name} className="featured-card-img" />
                  ) : (
                    <span className="featured-card-emoji">🙏</span>
                  )}

                  {/* Global Delivery tag on some */}
                  {idx % 3 === 1 && (
                    <span className="featured-delivery-tag">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                      GLOBAL DELIVERY
                    </span>
                  )}
                </Link>

                <div className="featured-card-body">
                  <div className="featured-card-top">
                    <Link to={productUrl(product.product_code, product.name)} className="featured-card-name-link">
                      <h3 className="featured-card-name">{product.name}</h3>
                    </Link>
                    <span className="featured-card-price">{formatPrice(product.price)}</span>
                  </div>

                  <p className="featured-card-cluster">
                    {product.shop_name?.toUpperCase()} · {product.category_name?.toUpperCase()}
                  </p>

                  {product.description && (
                    <p className="featured-card-desc">{product.description}</p>
                  )}

                  <div className="featured-card-actions">
                    <Link to={productUrl(product.product_code, product.name)} className="featured-btn-details">
                      DETAILS
                    </Link>
                    <Link to={productUrl(product.product_code, product.name)} className="featured-btn-inquire">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      INQUIRE
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
