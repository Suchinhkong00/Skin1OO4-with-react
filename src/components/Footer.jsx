import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { products } = useProducts();

  // Pulled from real product data — the exact same source Products.jsx uses
  // to build its filter dropdown — so these links can never fall out of
  // sync with whatever categories actually exist in Firestore.
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].slice(0, 6),
    [products]
  );

  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <span className="logo-text large">SKIN<span className="accent">1004</span></span>
            <p className="mt-3">Clean, science-backed skincare for every skin type. Beauty rooted in nature.</p>
            <div className="social-icons">
              <a href="https://www.facebook.com/share/1EengBx665/?mibextid=wwXIfr" aria-label="Facebook"><i className="ri-facebook-fill"></i></a>
              <a href="https://www.instagram.com/xhing_chinh?igsh=MXB1MDVhMG95b3E1MQ%3D%3D&utm_source=qr" aria-label="Instagram"><i className="ri-instagram-line"></i></a>
              <a href="https://www.tiktok.com/@xhing_chinh?_r=1&_t=ZS-9799Xhn8oL7" aria-label="TikTok"><i className="ri-tiktok-line"></i></a>
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <h6>Quick Links</h6>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/why-choose-us">Why Choose Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6>Products</h6>
            <ul>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat}>
                    <Link to={`/products?category=${encodeURIComponent(cat)}`}>{cat}</Link>
                  </li>
                ))
              ) : (
                <li><Link to="/products">Shop All</Link></li>
              )}
            </ul>
          </div>
          <div className="col-lg-4">
            <h6>Contact</h6>
            <p><i className="ri-phone-line me-2"></i>+855 87 786 790</p>
            <p><i className="ri-mail-line me-2"></i>contact@skin1004.com</p>
            <p><i className="ri-map-pin-line me-2"></i>Phnom Penh, Cambodia</p>
            <p><i className="ri-time-line me-2"></i>Mon–Sat, 8 AM–6 PM</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {year} SKIN1004. All rights reserved.</p>
          <p>Crafted in Cambodia</p>
          <p className="developer-credit">Designed &amp; Developed by <strong>KONG SUCHINH</strong></p>
        </div>
      </div>
    </footer>
  );
}