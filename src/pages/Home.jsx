import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Home() {
  const { products, loading } = useProducts();
  const featured = products.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-bg">
          <img src="/images/hero.png" alt="SKIN1004 products" />
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 hero-content">
              <p className="hero-eyebrow">Korean Skincare, Rooted in Nature</p>
              <h1 className="hero-title">Your Skin Deserves<br /><em>Better Ingredients.</em></h1>
              <p className="hero-sub">
                Centella Asiatica from Madagascar. Five forms of Hyaluronic Acid. Zero harmful additives.
                Skincare with nothing to hide.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                <Link to="/products" className="btn btn-primary btn-lg px-4 rounded-pill">Shop Now</Link>
                <Link to="/contact" className="btn btn-outline-light btn-lg px-4 rounded-pill">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SKIN1004 */}
      <section className="py-5 mt-2">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-tag">Why SKIN1004?</span>
            <h2 className="fw-bold mt-2">Your Skin Deserves Better</h2>
            <p className="text-muted">The principles behind every formula we make.</p>
          </div>
          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <div className="feature-card">
                <h5>Natural Ingredients</h5>
                <p className="text-muted small mb-0">100% plant-derived actives, ethically sourced from certified suppliers worldwide.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="feature-card">
                <h5>Dermatologist Tested</h5>
                <p className="text-muted small mb-0">Every formula independently verified by board-certified dermatologists.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="feature-card">
                <h5>Eco-Friendly</h5>
                <p className="text-muted small mb-0">Biodegradable packaging, refillable options, and a carbon-neutral manufacturing pledge.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="feature-card">
                <h5>97% Satisfaction</h5>
                <p className="text-muted small mb-0">97% of customers report visible improvement within just 4 weeks of use.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-5 bg-beige">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-tag">Bestsellers</span>
            <h2 className="fw-bold mt-2">Start Your Ritual</h2>
            <p className="text-muted">Our most loved products, handpicked for you.</p>
          </div>
          {loading ? (
            <Loader label="Loading featured products…" />
          ) : (
            <div className="row g-4">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-5">
            <Link to="/products" className="btn btn-primary btn-lg px-5 rounded-pill">View All Products</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container py-4">
          <div className="cta-box">
            <h2>Ready to Transform Your Skin?</h2>
            <p>Explore our complete skincare ritual built for real, visible results.</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/why-choose-us" className="btn btn-light btn-lg px-4 rounded-pill text-success fw-bold">See Why We're Different</Link>
              <Link to="/about" className="btn btn-outline-light btn-lg px-4 rounded-pill">Learn About Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
