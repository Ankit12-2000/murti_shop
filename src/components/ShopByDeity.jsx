import { Link } from 'react-router-dom';
import { categoryUrl } from '../utils/slug';
import './ShopByDeity.css';

// Emoji/color mapping for known categories
const categoryMeta = {
  'ganesh ji': { emoji: '🐘', color: '#C5993A' },
  'krishna ji': { emoji: '🪈', color: '#1E3A5F' },
  'shiv ji': { emoji: '🔱', color: '#4A90D9' },
  'durga maa': { emoji: '🦁', color: '#B91C1C' },
  'ram ji': { emoji: '🏹', color: '#2D6A4F' },
  'lakshmi ji': { emoji: '🪷', color: '#D97706' },
  'hanuman ji': { emoji: '🙏', color: '#EA580C' },
  'saraswati maa': { emoji: '🎵', color: '#7C3AED' },
};

const ShopByDeity = ({ categories = [] }) => {
  if (categories.length === 0) return null;

  return (
    <section className="deity-section">
      <h2 className="section-title deity-title">Shop by Deity</h2>
      <p className="deity-subtitle">Browse our divine collection by your favourite deity</p>
      <div className="deity-grid">
        {categories.map((cat) => {
          const key = cat.name.toLowerCase();
          const meta = categoryMeta[key] || { emoji: '🙏', color: '#6B7280' };
          return (
            <Link to={categoryUrl(cat.name)} key={cat.id} className="deity-item">
              <div
                className="deity-circle"
                style={{
                  background: cat.image_url && !cat.image_url.includes('example.com')
                    ? `url(${cat.image_url}) center/cover no-repeat`
                    : `linear-gradient(135deg, ${meta.color}22, ${meta.color}44)`
                }}
              >
                {(!cat.image_url || cat.image_url.includes('example.com')) && (
                  <span className="deity-emoji">{meta.emoji}</span>
                )}
              </div>
              <span className="deity-name">{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ShopByDeity;
