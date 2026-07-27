import { Link } from "react-router-dom";

const reasons = [
  {
    title: "Natural Ingredients",
    text: "We source 100% plant derived actives Centella Asiatica from the untouched landscapes of Madagascar, Hyaluronic Acid derived from fermented cassava, and Birch Sap tapped from certified forests. No synthetic fillers, no harmful additives. Just nature, purified.",
  },
  {
    title: "Gentle for Sensitive Skin",
    text: "Every formula is free from parabens, sulphates, artificial fragrances, and harsh alcohols. Our pH balanced range is clinically shown to be suitable for the most reactive skin types — including rosacea prone and post procedure skin.",
  },
  {
    title: "Dermatologist Tested",
    text: "Before any SKIN1004 product reaches your hands, it goes through independent clinical trials conducted by board certified dermatologists across South Korea and Southeast Asia. Safety isn't a marketing claim it's our baseline.",
  },
  {
    title: "Eco-Friendly Packaging",
    text: "Our packaging uses FSC certified paper, PCR plastic, and soy based inks. All glass bottles are refillable, and our mailer boxes are 100% compostable. We are on track for fully carbon neutral shipping by 2026.",
  },
  {
    title: "Trusted by Customers",
    text: "Over 50,000 customers across Southeast Asia have made SKIN1004 part of their daily ritual. 97% report visible skin improvement within four weeks, and our average product rating is 4.8 / 5 across all platforms.",
  },
];

const testimonials = [
  { text: "My dermatologist recommended SKIN1004 after I struggled with redness for years. Within three weeks my skin barrier finally felt stable. I won't switch.", name: "Sophea R.", location: "Phnom Penh, Cambodia" },
  { text: "I've tried so many 'sensitive skin' lines. SKIN1004 is the only one that hasn't triggered a flare up. The Hyalu-Cica Cream is my holy grail.", name: "Mia T.", location: "Seoul, Korea" },
  { text: "I love that the packaging is eco-friendly and the formulas are transparent. Knowing exactly what's in my products makes a huge difference to me.", name: "Linh N.", location: "Ho Chi Minh City, Vietnam" },
];

export default function WhyChooseUs() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Why Choose <span style={{ color: "#a8d5b5" }}>SKIN1004</span></h1>
          <p>Five reasons thousands of people trust SKIN1004 for their daily ritual.</p>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Why Choose Us</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-7 text-center">
              <span className="section-tag">Our Promise</span>
              <h2 className="fw-bold mt-2">Skincare You Can Trust</h2>
              <p className="text-muted mt-3 lh-lg">
                The skincare industry is full of bold claims and hidden ingredients. We chose a different
                path: full transparency, clinically tested formulas, and packaging that doesn't cost the
                planet. Here's exactly what we stand behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-beige">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-tag">What Sets Us Apart</span>
            <h2 className="fw-bold mt-2">Five Reasons to Choose SKIN1004</h2>
            <p className="text-muted">Clean formulas. Real results. Zero compromise.</p>
          </div>
          <div className="row g-4">
            {reasons.map((r, i) => (
              <div key={r.title} className={"col-sm-6 col-lg-4" + (i === 3 ? " offset-lg-2" : "")}>
                <div className="why-card h-100">
                  <h5>{r.title}</h5>
                  <p className="text-muted small mb-0">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-green">
        <div className="container py-2">
          <div className="row g-3 text-center">
            <div className="col-6 col-md-3"><div className="stat-card"><span className="stat-num">100%</span><span className="stat-label">Natural Actives</span></div></div>
            <div className="col-6 col-md-3"><div className="stat-card"><span className="stat-num">0</span><span className="stat-label">Harmful Additives</span></div></div>
            <div className="col-6 col-md-3"><div className="stat-card"><span className="stat-num">50K+</span><span className="stat-label">Happy Customers</span></div></div>
            <div className="col-6 col-md-3"><div className="stat-card"><span className="stat-num">97%</span><span className="stat-label">Satisfaction Rate</span></div></div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-tag">Real Reviews</span>
            <h2 className="fw-bold mt-2">What Our Customers Say</h2>
            <p className="text-muted">Honest words from people who use SKIN1004 every day.</p>
          </div>
          <div className="row g-4">
            {testimonials.map((t) => (
              <div key={t.name} className="col-md-4">
                <div className="testimonial-card h-100">
                  <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                  <div className="testimonial-author">
                    <div>
                      <div className="author-name">{t.name}</div>
                      <div className="author-location">{t.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="cta-box">
            <h2>Ready to Experience the Difference?</h2>
            <p>Browse the full range and find your perfect skincare ritual today.</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/products" className="btn btn-light btn-lg px-4 rounded-pill fw-bold" style={{ color: "var(--clr-primary)" }}>Shop Products</Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg px-4 rounded-pill">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
