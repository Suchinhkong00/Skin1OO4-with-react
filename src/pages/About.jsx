import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>About <span className="accent" style={{ color: "#a8d5b5" }}>SKIN1004</span></h1>
          <p>Rooted in nature. Backed by science. Built for you.</p>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">About</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-5">
        <div className="container py-4">
          <div className="row g-4 g-lg-5 align-items-center">
            <div className="col-lg-6">
              <div className="about-img-wrap">
                <img src="/images/aboutSKIN1004.webp" alt="About SKIN1004" className="about-img" />
                <div className="about-badge">
                  <span className="badge-num">8+</span>
                  <span className="badge-label">Years of Expertise</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 pt-4 pt-lg-0">
              <span className="section-tag">Our Story</span>
              <h2 className="fw-bold mt-2">From Madagascar,<br />to Your Skin.</h2>
              <p className="text-muted mt-3">
                In search of the purest Centella Asiatica on earth, we traveled to Madagascar — a land
                untouched by industrial farming. What we found there shaped every formula we've made since.
              </p>
              <p className="text-muted">We carry that quiet, natural purity in every bottle — and share it with you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-beige">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-tag">Purpose</span>
            <h2 className="fw-bold mt-2">Mission &amp; Vision</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="mv-card h-100">
                <h4 className="fw-bold mb-2">Our Mission</h4>
                <p className="text-muted mb-0">
                  To make clean, effective skincare accessible to everyone — formulated without harmful
                  chemicals and kind to the planet. Every ingredient is chosen with intention: safe for
                  skin, safe for the earth.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mv-card h-100">
                <h4 className="fw-bold mb-2">Our Vision</h4>
                <p className="text-muted mb-0">
                  A world where every person feels confident in their own skin, supported by transparent,
                  sustainable beauty rituals. We envision a future where clean beauty is the standard, not
                  the exception.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-tag">Our Values</span>
            <h2 className="fw-bold mt-2">Four Pillars of SKIN1004</h2>
          </div>
          <div className="row g-4">
            <div className="col-sm-6 col-lg-3">
              <div className="feature-card text-center">
                <h5>Natural Ingredients</h5>
                <p className="text-muted small mb-0">100% plant-derived actives, ethically sourced from certified suppliers worldwide.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="feature-card text-center">
                <h5>Dermatologist Tested</h5>
                <p className="text-muted small mb-0">Every formula independently verified by board-certified dermatologists.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="feature-card text-center">
                <h5>Eco-Friendly</h5>
                <p className="text-muted small mb-0">Biodegradable packaging, refillable options, and a carbon-neutral manufacturing pledge.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="feature-card text-center">
                <h5>97% Satisfaction</h5>
                <p className="text-muted small mb-0">97% of customers report visible skin improvement within just 4 weeks of use.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-green">
        <div className="container py-2">
          <div className="row g-3 text-center">
            <div className="col-6 col-md-3"><div className="stat-card"><span className="stat-num">8+</span><span className="stat-label">Years of Research</span></div></div>
            <div className="col-6 col-md-3"><div className="stat-card"><span className="stat-num">50K+</span><span className="stat-label">Happy Customers</span></div></div>
            <div className="col-6 col-md-3"><div className="stat-card"><span className="stat-num">12</span><span className="stat-label">Products in Range</span></div></div>
            <div className="col-6 col-md-3"><div className="stat-card"><span className="stat-num">97%</span><span className="stat-label">Satisfaction Rate</span></div></div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="cta-box">
            <h2>Discover Our Products</h2>
            <p>Every product tells our story. Find your perfect skincare match.</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/products" className="btn btn-light btn-lg px-4 rounded-pill text-success fw-bold">Shop Now</Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg px-4 rounded-pill">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
