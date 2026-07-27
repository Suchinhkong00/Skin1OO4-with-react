import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { friendlyAuthError } from "./Login";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! Welcome to SKIN1004.");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-5 auth-section">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="auth-card">
              <span className="section-tag">Join Us</span>
              <h3 className="fw-bold mt-2 mb-4">Create Your Account</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text" id="name" className="form-control"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <div className="form-msg error mt-1">{errors.name}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email" id="email" className="form-control"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {errors.email && <div className="form-msg error mt-1">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password" id="password" className="form-control"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  {errors.password && <div className="form-msg error mt-1">{errors.password}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="confirm" className="form-label">Confirm Password</label>
                  <input
                    type="password" id="confirm" className="form-control"
                    value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  />
                  {errors.confirm && <div className="form-msg error mt-1">{errors.confirm}</div>}
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill" disabled={submitting}>
                  {submitting ? "Creating account…" : "Create Account"}
                </button>
              </form>
              <p className="text-center text-muted mt-4 mb-0">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
