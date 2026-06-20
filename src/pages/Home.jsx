import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ShopByDeity from '../components/ShopByDeity';
import TrendingNow from '../components/TrendingNow';
import FindArtisans from '../components/FindArtisans';
import ArtisansChoice from '../components/ArtisansChoice';
import { API_BASE, cachedFetch } from '../utils/api';

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchHomeData = async () => {
      try {
        const json = await cachedFetch(`${API_BASE}/api/home`);
        if (cancelled) return;
        if (json.success) {
          setHomeData(json.data);
        } else {
          setError('Failed to load data');
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchHomeData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="home-loader">
        <div className="loader-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <p>Something went wrong: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <Hero banners={homeData?.banners || []} categories={homeData?.categories || []} />
      <TrendingNow products={homeData?.trending_products || []} />
      <FindArtisans shops={homeData?.top_shops || []} />
      <ArtisansChoice fallbackProducts={homeData?.featured_products || []} />
    </>
  );
};

export default Home;
