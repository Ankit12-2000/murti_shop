import './FindArtisans.css';

const FindArtisans = ({ shops = [] }) => {
  if (shops.length === 0) return null;

  return (
    <section className="artisans-section">
      <div className="artisans-container">
        <div className="artisans-content">
          <h2 className="artisans-title">Artisans of the Holy Ghats</h2>
          <p className="artisans-description">
            Every piece on Bhakti Mart comes with a Certificate of Provenance. We work directly with over 400 families in Varanasi, Jaipur, and Thanjavur to ensure fair trade and preservation of 1,000-year-old techniques.
          </p>

          <div className="artisans-stats">
            <div className="artisans-stat">
              <span className="artisans-stat-number">400+</span>
              <span className="artisans-stat-label">MASTER CRAFTSMEN</span>
            </div>
            <div className="artisans-stat">
              <span className="artisans-stat-number">12</span>
              <span className="artisans-stat-label">G.I. TAGS</span>
            </div>
            <div className="artisans-stat">
              <span className="artisans-stat-number">100%</span>
              <span className="artisans-stat-label">ECO-FRIENDLY</span>
            </div>
          </div>
        </div>

        <div className="artisans-images">
          {shops.slice(0, 2).map((shop) => (
            <div key={shop.id} className="artisans-image-card">
              {shop.image_url && !shop.image_url.includes('example.com') ? (
                <img src={shop.image_url} alt={shop.name} className="artisans-image-img" />
              ) : (
                <div className="artisans-image-placeholder">
                  <span>🏛️</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FindArtisans;
