import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };
const mapUrl = "https://www.google.com/maps/search/?api=1&query=11.561119,104.901344";

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Message is required.";
    else if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject || "General",
        message: form.message.trim(),
        status: "new",
        createdAt: serverTimestamp(),
      });
      toast.success("Thank you! We'll get back to you within 1 business day.");
      setForm(initialForm);
      setErrors({});
    } catch {
      toast.error("Something went wrong sending your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Contact <span style={{ color: "#a8d5b5" }}>Us</span></h1>
          <p>Questions, feedback, or just want to say hello — we're here.</p>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Contact</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-5">
        <div className="container py-4">
          <div className="row g-4 g-lg-5">
            <div className="col-lg-7">
              <span className="section-tag">Drop Us a Line</span>
              <h3 className="fw-bold mt-2 mb-4">We'd Love to Hear From You</h3>

              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Full Name <span className="req">*</span></label>
                    <input
                      type="text" id="name" name="name" className="form-control"
                      placeholder="Your full name" value={form.name} onChange={handleChange}
                    />
                    {errors.name && <div className="form-msg error mt-1">{errors.name}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email Address <span className="req">*</span></label>
                    <input
                      type="email" id="email" name="email" className="form-control"
                      placeholder="your@email.com" value={form.email} onChange={handleChange}
                    />
                    {errors.email && <div className="form-msg error mt-1">{errors.email}</div>}
                  </div>

                  <div className="col-12">
                    <label htmlFor="phone" className="form-label">
                      Phone Number <span className="text-muted fw-normal">(optional)</span>
                    </label>
                    <input
                      type="tel" id="phone" name="phone" className="form-control"
                      placeholder="+855 12 345 678" value={form.phone} onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <select id="subject" name="subject" className="form-control" value={form.subject} onChange={handleChange}>
                      <option value="" disabled>What can we help with?</option>
                      <option>Product Recommendation</option>
                      <option>Order Enquiry</option>
                      <option>Wholesale &amp; Partnerships</option>
                      <option>General Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label htmlFor="message" className="form-label">Message <span className="req">*</span></label>
                    <textarea
                      id="message" name="message" className="form-control" rows="5"
                      placeholder="Tell us about your skin concerns or questions…"
                      value={form.message} onChange={handleChange}
                    />
                    {errors.message && <div className="form-msg error mt-1">{errors.message}</div>}
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill" disabled={submitting}>
                      <i className="ri-send-plane-2-line me-2"></i>
                      {submitting ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-lg-5">
              <span className="section-tag">Find Us</span>
              <h3 className="fw-bold mt-2 mb-4">Get in Touch</h3>

              <div className="info-card">
                <i className="ri-phone-line"></i>
                <div>
                  <h5>Phone</h5>
                  <a href="tel:+85587786790">+855 87 786 790</a>
                </div>
              </div>

              <div className="info-card">
                <i className="ri-mail-line"></i>
                <div>
                  <h5>Email</h5>
                  <a href="mailto:contact@skin1004.com">contact@skin1004.com</a>
                </div>
              </div>

              <div className="info-card">
                <i className="ri-time-line"></i>
                <div>
                  <h5>Business Hours</h5>
                  <p>Monday – Saturday &nbsp;|&nbsp; 8 AM – 6 PM</p>
                </div>
              </div>

              <div className="info-card">
                <i className="ri-map-pin-line"></i>
                <div>
                  <h5>Location</h5>
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    317K Street 202, Sangkat Phsar Depou Ti Bei, Phnom Penh, Cambodia
                  </a>
                </div>
              </div>

              <div className="map-wrap mt-2">
                <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`${import.meta.env.BASE_URL}images/map.png`}
                    alt="Map"
                    className="map-img"
                  />
                </a>
                <div className="map-label">
                  <i className="ri-map-pin-fill"></i> Phnom Penh, Cambodia
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}