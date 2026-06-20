import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ShopDetail from './pages/ShopDetail';
import ProductDetail from './pages/ProductDetail';
import Collections from './pages/Collections';
import ImageZoom from './pages/ImageZoom';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:shopId/:shopSlug?" element={<ShopDetail />} />
          <Route path="/product/:productId/:productSlug?" element={<ProductDetail />} />
          <Route path="/collections/:category" element={<Collections />} />
          <Route path="/product/:productId/:productSlug?/images" element={<ImageZoom />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
